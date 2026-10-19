import { useContext, useState } from "react";
import { ChevronDown, ChevronUp, Copy, Plus, Trash2, X } from "lucide-react";
import { clsx } from "clsx";
import { LocaleContext } from "@/components/locale-context";
import { getFormula, type FormulaInput } from "@/lib/formulas";
import { formatNum } from "@/lib/formulas/shared";
import { subcategoryLabel, t, type Locale } from "@/lib/i18n";
import { parseDisplayNumber, serializeExpr, validVariableName, type ExprError, type MathNode } from "@/lib/expr";
import {
  createId,
  createWorkspace,
  environmentUntil,
  lineValue,
  normalizeFile,
  type Block,
  type Workspace,
  type WorkspaceFile,
} from "@/lib/workspace";

const CALC_HELP: { title: string; rows: [string, string][] }[] = [
  {
    title: "Funktiot",
    rows: [
      ["sqrt(25)", "Neliöjuuri"],
      ["cbrt(8)", "Kuutiojuuri"],
      ["abs(-3)", "Itseisarvo"],
      ["ln(10)", "Luonnollinen logaritmi"],
      ["log(100)", "Kymmenkantainen logaritmi"],
      ["log(8; 2)", "Logaritmi. Kanta erotetaan puolipisteellä."],
      ["exp(1)", "e potenssiin"],
      ["sin(30)", "Sini, cos ja tan. Yksikkö valitaan yläpuolelta."],
      ["asin(1)", "Arkussini, acos ja atan"],
      ["min(2; 8)", "Pienin. Suurin on max(2; 8)."],
      ["round(1,6)", "Pyöristys. Myös floor ja ceil."],
    ],
  },
  {
    title: "Merkinnät",
    rows: [
      ["2^3", "Potenssi. Sama kuin pow(2; 3)."],
      ["2x", "Kertolasku ilman tähteä. Myös 2(x+1)."],
      ["3,5", "Desimaalipilkku tai piste"],
      ["pii", "Pii. Myös pi ja π."],
      ["U = 12", "Muuttuja myöhemmille riveille"],
      ["π -> kulma", "Anna vakiolle oma nimi"],
      ["2x = 20", "Lineaarinen yhtälö, yksi tuntematon"],
    ],
  },
];

function CalcHelp() {
  const locale = useContext(LocaleContext);
  return (
    <details className="group rounded-md border border-line bg-bg">
      <summary className="flex h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
        {t(locale, "Funktiot ja merkinnät")}
        <ChevronDown className="size-4 shrink-0 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="flex flex-col gap-4 border-t border-line px-3 py-3">
        {CALC_HELP.map((group) => (
          <section key={group.title} className="flex flex-col gap-2">
            <h3 className="font-mono text-xs tracking-widest text-accent uppercase">{t(locale, group.title)}</h3>
            <ul className="flex flex-col gap-1.5">
              {group.rows.map(([example, label]) => (
                <li key={example} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-pretty text-muted">{t(locale, label)}</span>
                  <code className="shrink-0 font-mono text-ink">{example}</code>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </details>
  );
}

function copyPlain(text: string): boolean {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "0";
  area.style.left = "0";
  area.style.width = "1px";
  area.style.height = "1px";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.focus();
  area.select();
  area.setSelectionRange(0, area.value.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

async function copyText(text: string): Promise<boolean> {
  const legacy = copyPlain(text);
  const write = navigator.clipboard?.writeText;
  if (!write) return legacy;
  try {
    await write.call(navigator.clipboard, text);
    return true;
  } catch {
    return legacy;
  }
}

function errorText(locale: Locale, error: ExprError, detail?: string): string {
  if (error === "char") return `${t(locale, "Lausekkeessa on merkki, jota ei voi laskea.")}${detail ? ` (${detail})` : ""}`;
  if (error === "paren") return t(locale, "Sulje avaava sulku.");
  if (error === "end") return t(locale, "Lauseke jäi kesken.");
  if (error === "name") return `${t(locale, "Tuntematon nimi")}${detail ? `: ${detail}` : ""}`;
  if (error === "args") return t(locale, "Funktiolle annettiin väärä määrä arvoja. Erota arvot puolipisteellä.");
  if (error === "div0") return t(locale, "Nollalla ei voi jakaa.");
  if (error === "domain") return t(locale, "Arvo ei kelpaa tälle funktiolle.");
  if (error === "assign") return t(locale, "Tätä nimeä ei voi käyttää muuttujana.");
  if (error === "many") return t(locale, "Yhtälössä voi olla vain yksi tuntematon.");
  if (error === "none" && detail === "mismatch") return t(locale, "Sivut eivät ole yhtä suuret.");
  if (error === "none") return t(locale, "Yhtälöä ei voitu ratkaista. Lineaarinen muoto, esimerkiksi 2x = 20, toimii.");
  if (error === "eq") return t(locale, "Yhtälö on tosi kaikilla arvoilla, joten tuntematonta ei voi ratkaista.");
  return t(locale, "Lauseke jäi kesken.");
}

function solutionText(workspace: Workspace, locale: Locale): string {
  const angle =
    locale === "fi"
      ? workspace.angle === "deg"
        ? "Kulmayksikkö: asteet"
        : "Kulmayksikkö: radiaanit"
      : workspace.angle === "deg"
        ? "Angle: degrees"
        : "Angle: radians";
  const lines: string[] = [workspace.name, angle, ""];
  workspace.blocks.forEach((block, index) => {
    if (block.kind === "note") {
      if (!block.text.trim()) return;
      lines.push(t(locale, "Muistiinpano"), block.text.trim(), "");
      return;
    }
    if (block.kind === "calc") {
      const result = lineValue(block, environmentUntil(workspace.blocks, index, workspace.angle), workspace.angle);
      if (!block.expr.trim()) return;
      lines.push(block.expr.trim());
      if (result?.ok && result.steps.length > 1) lines.push(result.steps.map((step) => serializeExpr(step)).join(" → "));
      if (result?.ok) lines.push(`= ${formatNum(result.value)}`);
      else if (result && !result.ok) lines.push(errorText(locale, result.error, result.detail));
      lines.push("");
      return;
    }
    const formula = getFormula(block.formulaId);
    if (!formula) {
      lines.push(t(locale, "Kaavaa ei löydy."), "");
      return;
    }
    lines.push(t(locale, formula.name), formula.expression);
    if (block.kind === "reference") {
      lines.push(t(locale, formula.blurb));
      if (formula.note) lines.push(t(locale, formula.note));
      lines.push("");
      return;
    }
    for (const field of formula.fields(block.values)) {
      const raw = block.values[field.id] ?? "";
      const shown =
        field.kind === "select"
          ? t(locale, field.options?.find((option) => option.value === raw)?.label ?? raw)
          : `${raw}${field.unit ? ` ${t(locale, field.unit)}` : ""}`;
      lines.push(`${t(locale, field.label)}: ${shown}`);
    }
    const computed = formula.compute(block.values);
    if (computed.status === "ok") {
      for (const row of computed.rows) {
        lines.push(`${t(locale, row.label)}: ${t(locale, row.value)}${row.unit ? ` ${t(locale, row.unit)}` : ""}`);
      }
    } else if (computed.status === "error") lines.push(t(locale, computed.message));
    lines.push("");
  });
  return lines.join("\n").trim();
}

export function WorkspacePanel({
  file,
  onFile,
  onClose,
  onOpenFormula,
  catalogHidden,
  onToggleCatalog,
}: {
  file: WorkspaceFile;
  onFile: (next: WorkspaceFile) => void;
  onClose: () => void;
  onOpenFormula: (formulaId: string, values: Record<string, string> | null) => void;
  catalogHidden: boolean;
  onToggleCatalog: () => void;
}) {
  const locale = useContext(LocaleContext);
  const workspace = file.workspaces.find((item) => item.id === file.activeId) ?? file.workspaces[0];
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState("");
  const [copiedSolution, setCopiedSolution] = useState(false);
  const [copyFallback, setCopyFallback] = useState("");

  function replace(next: Workspace) {
    onFile({ ...file, workspaces: file.workspaces.map((item) => (item.id === next.id ? next : item)) });
  }

  function patch(recipe: (current: Workspace) => Workspace) {
    replace(recipe(workspace));
  }

  function updateBlock(id: string, recipe: (block: Block) => Block) {
    patch((current) => ({ ...current, blocks: current.blocks.map((block) => (block.id === id ? recipe(block) : block)) }));
  }

  function move(id: string, direction: -1 | 1) {
    patch((current) => {
      const index = current.blocks.findIndex((block) => block.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.blocks.length) return current;
      const blocks = current.blocks.slice();
      const [item] = blocks.splice(index, 1);
      blocks.splice(target, 0, item);
      return { ...current, blocks };
    });
  }

  async function copySolution() {
    const text = solutionText(workspace, locale);
    const ok = await copyText(text);
    if (ok) {
      setCopiedSolution(true);
      setCopyFallback("");
      setMessage(t(locale, "Kopioitu"));
      window.setTimeout(() => setCopiedSolution(false), 1600);
      return;
    }
    setCopyFallback(text);
    setMessage(t(locale, "Kopiointi ei onnistunut. Valitse teksti alta."));
  }

  async function exportJson() {
    const text = JSON.stringify(file, null, 2);
    const ok = await copyText(text);
    if (ok) {
      setCopyFallback("");
      setMessage(t(locale, "JSON kopioitu."));
      return;
    }
    setCopyFallback(text);
    setMessage(t(locale, "Kopiointi ei onnistunut. Valitse teksti alta."));
  }

  function importJson() {
    try {
      const parsed = normalizeFile(JSON.parse(importText));
      if (!parsed) {
        setMessage(t(locale, "JSON ei ole työtilan muotoa."));
        return;
      }
      const known = new Set(file.workspaces.map((item) => item.id));
      const imported = parsed.workspaces.map((item) => (known.has(item.id) ? { ...item, id: createId() } : item));
      onFile({ version: 1, activeId: imported[0]?.id ?? file.activeId, workspaces: [...file.workspaces, ...imported] });
      setImportText("");
      setImportOpen(false);
      setMessage(t(locale, "Työtilat tuotu."));
    } catch {
      setMessage(t(locale, "JSON ei ole työtilan muotoa."));
    }
  }

  return (
    <aside className="flex max-h-[calc(100dvh-8rem)] w-full min-w-0 shrink flex-col overflow-hidden rounded-lg border border-line bg-paper lg:sticky lg:top-60 lg:flex-1">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 className="text-lg font-semibold">{t(locale, "Oma työtila")}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleCatalog}
            className="hidden h-11 items-center rounded-md border border-line px-3 text-sm lg:flex"
          >
            {t(locale, catalogHidden ? "Näytä kaavasto" : "Piilota kaavasto")}
          </button>
          <button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-md border border-line" aria-label={t(locale, "Sulje työtila")}>
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className={clsx("flex min-h-0 flex-1 flex-col", catalogHidden && "lg:flex-row")}>
      <div
        className={clsx(
          "flex flex-col gap-3 px-4 py-4",
          catalogHidden && "max-h-64 min-h-0 overflow-y-auto border-b border-line lg:max-h-none lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0",
        )}
      >
        <button
          type="button"
          onClick={() => {
            const next = createWorkspace(locale === "fi" ? `Tehtävä ${file.workspaces.length + 1}` : `Task ${file.workspaces.length + 1}`);
            onFile({ version: 1, activeId: next.id, workspaces: [...file.workspaces, next] });
          }}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-ink text-sm font-medium text-paper"
        >
          <Plus className="size-4" aria-hidden="true" />
          {t(locale, "Lisää työtila")}
        </button>
        <ul className="flex flex-col gap-2">
          {file.workspaces.map((item) => {
            const selected = item.id === workspace.id;
            return (
              <li key={item.id} className={clsx("relative rounded-md border", selected ? "border-ink bg-ink" : "border-line bg-bg")}>
                {selected ? (
                  <input
                    className="h-11 w-full bg-transparent pr-12 pl-3 text-base text-paper outline-none"
                    value={item.name}
                    aria-label={t(locale, "Työtilan nimi")}
                    onChange={(event) => replace({ ...item, name: event.target.value })}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => onFile({ ...file, activeId: item.id })}
                    className="h-11 w-full truncate pr-12 pl-3 text-left text-sm"
                  >
                    {item.name || t(locale, "Työtila")}
                  </button>
                )}
                <button
                  type="button"
                  aria-label={t(locale, "Poista työtila")}
                  onClick={() => {
                    const rest = file.workspaces.filter((entry) => entry.id !== item.id);
                    if (rest.length === 0) {
                      const next = createWorkspace(locale === "fi" ? "Tehtävä 1" : "Task 1");
                      onFile({ version: 1, activeId: next.id, workspaces: [next] });
                      return;
                    }
                    onFile({ version: 1, activeId: item.id === file.activeId ? rest[0].id : file.activeId, workspaces: rest });
                  }}
                  className="absolute top-0 right-0 grid size-11 place-items-center"
                >
                  <X className={clsx("size-4", selected ? "text-paper" : "text-muted")} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        <p className="text-sm text-pretty text-muted">{t(locale, "Työtilat säilyvät tässä selaimessa. Ne eivät siirry toiselle laitteelle.")}</p>
        <div className="flex flex-col gap-1.5">
          <p className="text-sm text-muted">{t(locale, "Vain trigonometria: sin, cos ja tan")}</p>
          <div className="flex rounded-md border border-line bg-bg p-0.5" role="group" aria-label={t(locale, "Kulmayksikkö")}>
            {(["deg", "rad"] as const).map((angle) => (
              <button
                key={angle}
                type="button"
                aria-pressed={workspace.angle === angle}
                onClick={() => replace({ ...workspace, angle })}
                className={clsx("h-11 flex-1 rounded text-sm", workspace.angle === angle ? "bg-ink text-paper" : "text-muted")}
              >
                {angle === "deg" ? t(locale, "Asteet") : t(locale, "Radiaanit")}
              </button>
            ))}
          </div>
        </div>
        <CalcHelp />
        <ul className="flex flex-col gap-3">
          {workspace.blocks.map((block, index) => (
            <li key={block.id} id={`ws-block-${block.id}`} className="rounded-lg border border-line bg-bg p-3">
              <div className="mb-2 flex justify-end gap-1">
                <button type="button" className="grid size-11 place-items-center rounded-md border border-line bg-paper" aria-label={t(locale, "Siirrä ylös")} onClick={() => move(block.id, -1)}>
                  <ChevronUp className="size-4" aria-hidden="true" />
                </button>
                <button type="button" className="grid size-11 place-items-center rounded-md border border-line bg-paper" aria-label={t(locale, "Siirrä alas")} onClick={() => move(block.id, 1)}>
                  <ChevronDown className="size-4" aria-hidden="true" />
                </button>
                <button type="button" className="grid size-11 place-items-center rounded-md border border-line bg-paper" aria-label={t(locale, "Poista")} onClick={() => patch((current) => ({ ...current, blocks: current.blocks.filter((item) => item.id !== block.id) }))}>
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>
              {block.kind === "note" ? (
                <textarea
                  className="min-h-28 w-full rounded-md border border-line bg-paper px-3 py-3 text-base"
                  placeholder={t(locale, "Tehtävänanto, tunnetut arvot, perustelut tai vastaus")}
                  value={block.text}
                  onChange={(event) => updateBlock(block.id, (item) => (item.kind === "note" ? { ...item, text: event.target.value } : item))}
                />
              ) : null}
              {block.kind === "calc" ? (
                <CalcRow
                  expr={block.expr}
                  result={lineValue(block, environmentUntil(workspace.blocks, index, workspace.angle), workspace.angle)}
                  onChange={(expr) => updateBlock(block.id, (item) => (item.kind === "calc" ? { ...item, expr } : item))}
                  onSplit={(lines) =>
                    patch((current) => {
                      const at = current.blocks.findIndex((item) => item.id === block.id);
                      if (at < 0) return current;
                      const rows = lines.map((expr) => ({ id: createId(), kind: "calc" as const, expr }));
                      const blocks = current.blocks.slice();
                      blocks.splice(at, 1, ...rows);
                      return { ...current, blocks };
                    })
                  }
                />
              ) : null}
              {block.kind === "formula" || block.kind === "reference" ? (
                <FormulaCard
                  block={block}
                  onOpen={() => onOpenFormula(block.formulaId, block.kind === "formula" ? block.values : null)}
                  onChangeValue={(fieldId, value) =>
                    updateBlock(block.id, (item) => (item.kind === "formula" ? { ...item, values: { ...item.values, [fieldId]: value } } : item))
                  }
                  onExport={(rowId, name) =>
                    updateBlock(block.id, (item) => {
                      if (item.kind !== "formula") return item;
                      const exports = item.exports.filter((entry) => entry.rowId !== rowId);
                      if (!name.trim()) return { ...item, exports };
                      return { ...item, exports: [...exports, { rowId, name: name.trim() }] };
                    })
                  }
                />
              ) : null}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => patch((current) => ({ ...current, blocks: [...current.blocks, { id: createId(), kind: "calc", expr: "" }] }))}
            className="flex h-11 items-center gap-2 rounded-md bg-ink px-3 text-sm text-paper"
          >
            <Plus className="size-4" aria-hidden="true" />
            {t(locale, "Lisää lasku")}
          </button>
          <button
            type="button"
            onClick={() => patch((current) => ({ ...current, blocks: [...current.blocks, { id: createId(), kind: "note", text: "" }] }))}
            className="flex h-11 items-center gap-2 rounded-md border border-line bg-bg px-3 text-sm"
          >
            <Plus className="size-4" aria-hidden="true" />
            {t(locale, "Lisää muistiinpano")}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void copySolution()} className="flex h-11 items-center gap-2 rounded-md border border-line bg-bg px-3 text-sm">
            <Copy className="size-4" aria-hidden="true" />
            {t(locale, copiedSolution ? "Kopioitu" : "Kopioi koko ratkaisu")}
          </button>
          <button type="button" onClick={() => void exportJson()} className="h-11 rounded-md border border-line bg-bg px-3 text-sm">
            {t(locale, "Vie JSON")}
          </button>
          <button type="button" onClick={() => setImportOpen((open) => !open)} className="h-11 rounded-md border border-line bg-bg px-3 text-sm">
            {t(locale, "Tuo JSON")}
          </button>
        </div>
        {importOpen ? (
          <div className="flex flex-col gap-2">
            <textarea
              className="min-h-28 w-full rounded-md border border-line bg-bg px-3 py-3 font-mono text-sm"
              value={importText}
              placeholder='{"version":1,"workspaces":[]}'
              onChange={(event) => setImportText(event.target.value)}
              aria-label={t(locale, "Tuo JSON")}
            />
            <button type="button" onClick={importJson} className="h-11 rounded-md bg-accent px-3 text-sm font-medium text-accent-ink">
              {t(locale, "Tuo työtilat")}
            </button>
          </div>
        ) : null}
        {message ? <p className="text-sm text-muted" role="status">{message}</p> : null}
        {copyFallback ? (
          <textarea
            className="min-h-40 w-full rounded-md border border-line bg-bg px-3 py-3 font-mono text-sm"
            readOnly
            value={copyFallback}
            aria-label={t(locale, "Kopioi koko ratkaisu")}
            onFocus={(event) => event.currentTarget.select()}
          />
        ) : null}
      </div>
      </div>
    </aside>
  );
}

function CalcRow({
  expr,
  result,
  onChange,
  onSplit,
}: {
  expr: string;
  result: ReturnType<typeof lineValue>;
  onChange: (expr: string) => void;
  onSplit: (lines: string[]) => void;
}) {
  const locale = useContext(LocaleContext);
  const steps = result?.ok && result.steps.length > 1 ? result.steps : [];
  return (
    <div className="flex flex-col gap-2">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        {t(locale, "Lasku")}
        <input
          className="h-11 w-full rounded-md border border-line bg-paper px-3 font-mono text-base font-normal"
          value={expr}
          placeholder="(12 + 8) / 4"
          spellCheck={false}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
      {result?.ok ? (
        <p className="font-mono text-lg font-medium text-accent tabular-nums">
          {result.name ? `${result.name} = ` : "= "}
          {formatNum(result.value)}
        </p>
      ) : null}
      {steps.length > 0 ? (
        <div>
          <p className="mb-1 text-sm text-muted">{t(locale, "Välivaiheet")}</p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-3 text-sm">
            {steps.map((step, index) => (
              <span key={index} className="inline-flex items-center gap-2">
                {index > 0 ? <span className="text-muted">→</span> : null}
                <MathView node={step} />
              </span>
            ))}
          </div>
          <button
            type="button"
            className="mt-2 h-11 rounded-md border border-line bg-paper px-3 text-sm"
            onClick={() => {
              const lines = steps.map((step) => serializeExpr(step));
              if (result?.ok && result.name) lines[lines.length - 1] = `${result.name} = ${lines[lines.length - 1]}`;
              onSplit(lines);
            }}
          >
            {t(locale, "Kirjaa välivaiheet riveiksi")}
          </button>
        </div>
      ) : null}
      {result && !result.ok && result.error !== "empty" ? <p className="text-sm text-pretty text-accent">{errorText(locale, result.error, result.detail)}</p> : null}
    </div>
  );
}

function FormulaCard({
  block,
  onOpen,
  onExport,
  onChangeValue,
}: {
  block: Extract<Block, { kind: "formula" | "reference" }>;
  onOpen: () => void;
  onExport: (rowId: string, name: string) => void;
  onChangeValue: (fieldId: string, value: string) => void;
}) {
  const locale = useContext(LocaleContext);
  const formula = getFormula(block.formulaId);
  if (!formula) return <p className="text-sm text-muted">{t(locale, "Kaavaa ei löydy.")}</p>;
  const values = block.kind === "formula" ? block.values : formula.seed;
  const fields = formula.fields(values);
  const computed = block.kind === "formula" ? formula.compute(values) : null;
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="font-mono text-xs tracking-widest text-accent uppercase">
          {t(locale, block.kind === "reference" ? "Kaava" : "Laskettava kaava")}
          <span className="px-2" aria-hidden="true">
            •
          </span>
          {subcategoryLabel(formula.subcategory, locale)}
        </p>
        <h3 className="mt-1 text-lg font-semibold">{t(locale, formula.name)}</h3>
        <p className="mt-2 font-mono text-sm break-words">{formula.expression}</p>
      </div>
      {block.kind === "reference" ? (
        <>
          <p className="text-sm text-pretty text-muted">{t(locale, formula.blurb)}</p>
          <ul className="flex flex-col gap-1 text-sm">
            {fields.map((field) => (
              <li key={field.id}>
                <span className="font-medium">{t(locale, field.label)}</span>
                {field.unit ? <span className="text-muted"> ({t(locale, field.unit)})</span> : null}
                {field.hint ? <span className="text-muted"> — {t(locale, field.hint)}</span> : null}
              </li>
            ))}
          </ul>
          {formula.note ? <p className="text-sm text-pretty text-muted">{t(locale, formula.note)}</p> : null}
        </>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <ValueField key={field.id} field={field} value={values[field.id] ?? ""} onChange={(value) => onChangeValue(field.id, value)} />
            ))}
          </div>
          {computed?.status === "ok" ? (
            <ul className="flex flex-col gap-2 border-t border-line pt-2">
              {computed.rows.map((row) => {
                const numeric = parseDisplayNumber(row.value);
                const exported = block.exports.find((item) => item.rowId === row.id);
                return (
                  <li key={row.id} className="flex flex-col gap-1">
                    <div className="flex justify-between gap-3 text-sm">
                      <span>{t(locale, row.label)}</span>
                      <span className="font-mono text-right">
                        {t(locale, row.value)}
                        {row.unit ? ` ${t(locale, row.unit)}` : ""}
                      </span>
                    </div>
                    {numeric !== null ? <VariableField name={exported?.name ?? ""} unit={row.unit ? t(locale, row.unit) : ""} onChange={(name) => onExport(row.id, name)} /> : null}
                  </li>
                );
              })}
            </ul>
          ) : computed?.status === "error" ? (
            <p className="text-sm text-accent">{t(locale, computed.message)}</p>
          ) : (
            <p className="text-sm text-muted">{t(locale, "Täytä kentät, niin tulos lasketaan.")}</p>
          )}
        </>
      )}
      <button type="button" onClick={onOpen} className="h-11 self-start rounded-md border border-line bg-paper px-3 text-sm">
        {t(locale, "Avaa laskuri")}
      </button>
    </div>
  );
}

function ValueField({ field, value, onChange }: { field: FormulaInput; value: string; onChange: (value: string) => void }) {
  const locale = useContext(LocaleContext);
  const unit = field.unit ? t(locale, field.unit) : "";
  const control = "w-full rounded-md border border-line bg-paper text-base text-ink outline-none";
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">
        {t(locale, field.label)}
        {unit && unit.length > 8 ? <span className="font-normal text-muted"> ({unit})</span> : null}
      </span>
      {field.kind === "select" ? (
        <select className={clsx(control, "h-11 px-3")} value={value} onChange={(event) => onChange(event.target.value)}>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {t(locale, option.label)}
            </option>
          ))}
        </select>
      ) : field.kind === "textarea" ? (
        <textarea className={clsx(control, "min-h-28 px-3 py-3")} value={value} spellCheck={false} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <span className="relative">
          <input
            className={clsx(control, "h-11 px-3", unit && unit.length <= 8 && "pr-16")}
            value={value}
            inputMode={field.kind === "number" ? "decimal" : "text"}
            placeholder={field.placeholder ? t(locale, field.placeholder) : undefined}
            spellCheck={false}
            onChange={(event) => onChange(event.target.value)}
          />
          {unit && unit.length <= 8 ? (
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-sm text-muted">{unit}</span>
          ) : null}
        </span>
      )}
    </label>
  );
}

function MathView({ node }: { node: MathNode }) {
  if (node.t === "num") return <span className="tabular-nums">{formatNum(node.n)}</span>;
  if (node.t === "sym") return <span>{node.name}</span>;
  if (node.t === "neg") {
    const wrap = node.expr.t === "bin" || node.expr.t === "neg";
    return (
      <span>
        −{wrap ? <span>(<MathView node={node.expr} />)</span> : <MathView node={node.expr} />}
      </span>
    );
  }
  if (node.t === "call") {
    return (
      <span>
        {node.name}(
        {node.args.map((arg, index) => (
          <span key={index}>
            {index > 0 ? "; " : ""}
            <MathView node={arg} />
          </span>
        ))}
        )
      </span>
    );
  }
  if (node.t === "eq") {
    return (
      <span>
        <MathView node={node.left} />
        <span className="px-1">=</span>
        <MathView node={node.right} />
      </span>
    );
  }
  if (node.op === "/") {
    return (
      <span className="mx-1 inline-flex flex-col align-middle leading-tight">
        <span className="px-1 text-center">
          <MathView node={node.left} />
        </span>
        <span className="my-0.5 h-px w-full bg-ink" />
        <span className="px-1 text-center">
          <MathView node={node.right} />
        </span>
      </span>
    );
  }
  if (node.op === "^") {
    const wrap = node.left.t === "bin" || node.left.t === "neg";
    return (
      <span>
        {wrap ? (
          <span>
            (<MathView node={node.left} />)
          </span>
        ) : (
          <MathView node={node.left} />
        )}
        <sup className="text-[0.75em]">
          <MathView node={node.right} />
        </sup>
      </span>
    );
  }
  if (node.op === "*") {
    const juxtapose = Boolean(node.implicit) && node.right.t !== "num";
    return (
      <span>
        <Term node={node.left} />
        {juxtapose ? null : "·"}
        <Term node={node.right} forceParen={juxtapose && node.right.t === "bin" && node.right.op !== "/" && node.right.op !== "^"} />
      </span>
    );
  }
  const wrapRight = node.op === "-" && node.right.t === "bin" && (node.right.op === "+" || node.right.op === "-");
  return (
    <span>
      <MathView node={node.left} />
      {node.op}
      {wrapRight ? (
        <span>
          (<MathView node={node.right} />)
        </span>
      ) : (
        <MathView node={node.right} />
      )}
    </span>
  );
}

function Term({ node, forceParen = false }: { node: MathNode; forceParen?: boolean }) {
  const wrap = forceParen || (node.t === "bin" && (node.op === "+" || node.op === "-")) || node.t === "neg";
  if (!wrap) return <MathView node={node} />;
  return (
    <span>
      (<MathView node={node} />)
    </span>
  );
}

function VariableField({ name, unit, onChange }: { name: string; unit: string; onChange: (name: string) => void }) {
  const locale = useContext(LocaleContext);
  const invalid = name.trim() !== "" && !validVariableName(name.trim());
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted">
        {t(locale, "Muuttujaksi")}
        {unit ? ` (${unit})` : ""}
      </span>
      <input
        className="h-11 rounded-md border border-line bg-paper px-3 font-mono text-base"
        value={name}
        placeholder="I"
        spellCheck={false}
        onChange={(event) => onChange(event.target.value)}
      />
      {invalid ? <span className="text-accent">{t(locale, "Tätä nimeä ei voi käyttää muuttujana.")}</span> : null}
    </label>
  );
}
