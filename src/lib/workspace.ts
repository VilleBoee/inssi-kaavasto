import { getFormula } from "./formulas";
import { evaluateExpr, parseDisplayNumber, validVariableName, type AngleMode, type ExprValue } from "./expr";

export type { AngleMode };

export type NoteBlock = { id: string; kind: "note"; text: string };
export type CalcBlock = { id: string; kind: "calc"; expr: string };
export type FormulaBlock = {
  id: string;
  kind: "formula";
  formulaId: string;
  values: Record<string, string>;
  exports: { rowId: string; name: string }[];
};
export type ReferenceBlock = { id: string; kind: "reference"; formulaId: string };
export type Block = NoteBlock | CalcBlock | FormulaBlock | ReferenceBlock;

export type Workspace = {
  id: string;
  name: string;
  angle: AngleMode;
  blocks: Block[];
};

export type WorkspaceFile = {
  version: 1;
  activeId: string;
  workspaces: Workspace[];
};

const STORAGE_KEY = "kaavasto:workspaces";

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createWorkspace(name: string): Workspace {
  return {
    id: createId(),
    name,
    angle: "deg",
    blocks: [
      { id: createId(), kind: "calc", expr: "" },
      { id: createId(), kind: "note", text: "" },
    ],
  };
}

export function emptyFile(): WorkspaceFile {
  const workspace = createWorkspace("Tehtävä 1");
  return { version: 1, activeId: workspace.id, workspaces: [workspace] };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function cleanBlock(value: unknown): Block | null {
  if (!isRecord(value) || typeof value.kind !== "string") return null;
  const id = typeof value.id === "string" && value.id ? value.id : createId();
  if (value.kind === "note") return { id, kind: "note", text: typeof value.text === "string" ? value.text : "" };
  if (value.kind === "calc") return { id, kind: "calc", expr: typeof value.expr === "string" ? value.expr : "" };
  if (value.kind === "reference" && typeof value.formulaId === "string") return { id, kind: "reference", formulaId: value.formulaId };
  if (value.kind === "formula" && typeof value.formulaId === "string" && isRecord(value.values)) {
    const values: Record<string, string> = {};
    for (const [key, item] of Object.entries(value.values)) {
      if (typeof item === "string") values[key] = item;
    }
    const exports: { rowId: string; name: string }[] = [];
    if (Array.isArray(value.exports)) {
      for (const item of value.exports) {
        if (isRecord(item) && typeof item.rowId === "string" && typeof item.name === "string") {
          exports.push({ rowId: item.rowId, name: item.name });
        }
      }
    }
    return { id, kind: "formula", formulaId: value.formulaId, values, exports };
  }
  return null;
}

export function normalizeFile(value: unknown): WorkspaceFile | null {
  if (!isRecord(value) || !Array.isArray(value.workspaces)) return null;
  const workspaces: Workspace[] = [];
  for (const item of value.workspaces) {
    if (!isRecord(item) || !Array.isArray(item.blocks)) continue;
    const blocks = item.blocks.map(cleanBlock).filter((block): block is Block => Boolean(block));
    workspaces.push({
      id: typeof item.id === "string" && item.id ? item.id : createId(),
      name: typeof item.name === "string" && item.name.trim() ? item.name.trim() : "Työtila",
      angle: item.angle === "rad" ? "rad" : "deg",
      blocks: blocks.length > 0 ? blocks : createWorkspace("x").blocks,
    });
  }
  if (workspaces.length === 0) return null;
  const activeId = workspaces.some((item) => item.id === value.activeId) ? String(value.activeId) : workspaces[0].id;
  return { version: 1, activeId, workspaces };
}

export function loadWorkspaces(): WorkspaceFile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyFile();
    return normalizeFile(JSON.parse(raw)) ?? emptyFile();
  } catch {
    return emptyFile();
  }
}

export function saveWorkspaces(file: WorkspaceFile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(file));
}

export function lineValue(block: CalcBlock, env: Record<string, number>, angle: AngleMode): ExprValue | null {
  if (!block.expr.trim()) return null;
  return evaluateExpr(block.expr, env, angle);
}

export function environmentUntil(blocks: Block[], index: number, angle: AngleMode): Record<string, number> {
  const env: Record<string, number> = {};
  for (let i = 0; i < index; i += 1) {
    const block = blocks[i];
    if (block.kind === "calc") {
      const result = lineValue(block, env, angle);
      if (result?.ok && result.name && validVariableName(result.name)) env[result.name] = result.value;
    }
    if (block.kind === "formula") {
      const formula = getFormula(block.formulaId);
      if (!formula) continue;
      const computed = formula.compute(block.values);
      if (computed.status !== "ok") continue;
      for (const item of block.exports) {
        const row = computed.rows.find((line) => line.id === item.rowId);
        const value = row ? parseDisplayNumber(row.value) : null;
        if (row && value !== null && validVariableName(item.name)) env[item.name] = value;
      }
    }
  }
  return env;
}
