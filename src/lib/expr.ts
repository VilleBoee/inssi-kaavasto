export type AngleMode = "deg" | "rad";

export type ExprError = "empty" | "char" | "paren" | "end" | "name" | "args" | "div0" | "domain" | "assign" | "many" | "none" | "eq";

export type MathNode =
  | { t: "num"; n: number }
  | { t: "sym"; name: string }
  | { t: "neg"; expr: MathNode }
  | { t: "bin"; op: "+" | "-" | "*" | "/" | "^"; left: MathNode; right: MathNode; implicit?: boolean }
  | { t: "call"; name: string; args: MathNode[] }
  | { t: "eq"; left: MathNode; right: MathNode };

export type CalcStep = MathNode;

export type ExprValue =
  | { ok: true; value: number; name?: string; steps: CalcStep[] }
  | { ok: false; error: ExprError; detail?: string };

type Tok = { t: "num"; n: number } | { t: "id"; s: string } | { t: "op"; s: string } | { t: "eof" };

const FUNCTIONS: Record<string, number> = {
  sqrt: 1,
  cbrt: 1,
  abs: 1,
  ln: 1,
  log: 2,
  log10: 1,
  log2: 1,
  exp: 1,
  sin: 1,
  cos: 1,
  tan: 1,
  asin: 1,
  acos: 1,
  atan: 1,
  atan2: 2,
  min: 2,
  max: 2,
  pow: 2,
  round: 1,
  floor: 1,
  ceil: 1,
};

function isLetter(char: string): boolean {
  return /\p{L}/u.test(char) || char === "_";
}

function isIdentPart(char: string): boolean {
  return isLetter(char) || (char >= "0" && char <= "9");
}

function tokenize(input: string): Tok[] | ExprValue {
  const out: Tok[] = [];
  let i = 0;
  while (i < input.length) {
    const char = input[i];
    if (char === " " || char === "\t" || char === "\n") {
      i += 1;
      continue;
    }
    if ((char >= "0" && char <= "9") || (char === "." && input[i + 1] >= "0" && input[i + 1] <= "9")) {
      let j = i;
      let dot = false;
      while (j < input.length) {
        const next = input[j];
        if (next >= "0" && next <= "9") {
          j += 1;
          continue;
        }
        const glued = j + 1 < input.length && input[j + 1] >= "0" && input[j + 1] <= "9";
        if (!dot && glued && (next === "." || next === ",")) {
          dot = true;
          j += 1;
          continue;
        }
        break;
      }
      let raw = input.slice(i, j).replace(",", ".");
      if (input[j] === "e" || input[j] === "E") {
        let k = j + 1;
        if (input[k] === "+" || input[k] === "-") k += 1;
        const start = k;
        while (k < input.length && input[k] >= "0" && input[k] <= "9") k += 1;
        if (k > start) {
          raw += input.slice(j, k);
          j = k;
        }
      }
      const n = Number(raw);
      if (!Number.isFinite(n)) return { ok: false, error: "char", detail: input.slice(i, j) };
      out.push({ t: "num", n });
      i = j;
      continue;
    }
    if (isLetter(char)) {
      let j = i + 1;
      while (j < input.length && isIdentPart(input[j])) j += 1;
      out.push({ t: "id", s: input.slice(i, j) });
      i = j;
      continue;
    }
    if (char === "-" && input[i + 1] === ">") {
      out.push({ t: "op", s: "->" });
      i += 2;
      continue;
    }
    if ("+-*/^(),;=".includes(char) || char === "·" || char === "×" || char === "−") {
      const op = char === "·" || char === "×" ? "*" : char === "−" ? "-" : char === ";" ? "," : char;
      out.push({ t: "op", s: op });
      i += 1;
      continue;
    }
    return { ok: false, error: "char", detail: char };
  }
  out.push({ t: "eof" });
  return out;
}

function toRad(value: number, angle: AngleMode): number {
  return angle === "deg" ? (value * Math.PI) / 180 : value;
}

function fromRad(value: number, angle: AngleMode): number {
  return angle === "deg" ? (value * 180) / Math.PI : value;
}

function callFunction(name: string, args: number[], angle: AngleMode): ExprValue {
  const need = FUNCTIONS[name];
  if (name !== "log" && args.length !== need) return { ok: false, error: "args", detail: name };
  const [a, b] = args;
  let value: number;
  switch (name) {
    case "sqrt":
      if (a < 0) return { ok: false, error: "domain", detail: name };
      value = Math.sqrt(a);
      break;
    case "cbrt":
      value = Math.cbrt(a);
      break;
    case "abs":
      value = Math.abs(a);
      break;
    case "ln":
      if (a <= 0) return { ok: false, error: "domain", detail: name };
      value = Math.log(a);
      break;
    case "log":
      if (args.length === 1) {
        if (a <= 0) return { ok: false, error: "domain", detail: name };
        value = Math.log10(a);
        break;
      }
      if (args.length === 2) {
        if (a <= 0 || b <= 0 || b === 1) return { ok: false, error: "domain", detail: name };
        value = Math.log(a) / Math.log(b);
        break;
      }
      return { ok: false, error: "args", detail: name };
    case "log10":
      if (a <= 0) return { ok: false, error: "domain", detail: name };
      value = Math.log10(a);
      break;
    case "log2":
      if (a <= 0) return { ok: false, error: "domain", detail: name };
      value = Math.log2(a);
      break;
    case "exp":
      value = Math.exp(a);
      break;
    case "sin":
      value = Math.sin(toRad(a, angle));
      break;
    case "cos":
      value = Math.cos(toRad(a, angle));
      break;
    case "tan":
      value = Math.tan(toRad(a, angle));
      break;
    case "asin":
      if (a < -1 || a > 1) return { ok: false, error: "domain", detail: name };
      value = fromRad(Math.asin(a), angle);
      break;
    case "acos":
      if (a < -1 || a > 1) return { ok: false, error: "domain", detail: name };
      value = fromRad(Math.acos(a), angle);
      break;
    case "atan":
      value = fromRad(Math.atan(a), angle);
      break;
    case "atan2":
      value = fromRad(Math.atan2(a, b), angle);
      break;
    case "min":
      value = Math.min(a, b);
      break;
    case "max":
      value = Math.max(a, b);
      break;
    case "pow":
      value = a ** b;
      break;
    case "round":
      value = Math.round(a);
      break;
    case "floor":
      value = Math.floor(a);
      break;
    case "ceil":
      value = Math.ceil(a);
      break;
    default:
      return { ok: false, error: "name", detail: name };
  }
  if (!Number.isFinite(value)) return { ok: false, error: "domain", detail: name };
  return { ok: true, value, steps: [] };
}

type NodeResult = { ok: true; node: MathNode; right?: MathNode; alias?: string } | { ok: false; error: ExprError; detail?: string };

class Parser {
  private readonly tokens: Tok[];
  private index = 0;

  constructor(tokens: Tok[]) {
    this.tokens = tokens;
  }

  private peek(): Tok {
    return this.tokens[this.index] ?? { t: "eof" };
  }

  private eat(op: string): boolean {
    const token = this.peek();
    if (token.t === "op" && token.s === op) {
      this.index += 1;
      return true;
    }
    return false;
  }

  parse(): NodeResult {
    if (this.peek().t === "eof") return { ok: false, error: "empty" };
    const left = this.add();
    if (!left.ok) return left;
    if (this.eat("=")) {
      const right = this.add();
      if (!right.ok) return right;
      if (this.peek().t !== "eof") return { ok: false, error: "end" };
      return { ok: true, node: left.node, right: right.node };
    }
    if (this.eat("->")) {
      const name = this.peek();
      if (name.t !== "id") return { ok: false, error: "assign" };
      const canonicalName = canonical(name.s);
      if (FUNCTIONS[canonicalName]) return { ok: false, error: "assign", detail: name.s };
      this.index += 1;
      if (this.peek().t !== "eof") return { ok: false, error: "end" };
      return { ok: true, node: left.node, alias: name.s };
    }
    if (this.peek().t !== "eof") return { ok: false, error: "end" };
    return left;
  }

  private add(): NodeResult {
    let left = this.mul();
    if (!left.ok) return left;
    for (;;) {
      const op = this.eat("+") ? "+" : this.eat("-") ? "-" : "";
      if (!op) break;
      const right = this.mul();
      if (!right.ok) return right;
      left = { ok: true, node: { t: "bin", op, left: left.node, right: right.node } };
    }
    return left;
  }

  private mul(): NodeResult {
    let left = this.pow();
    if (!left.ok) return left;
    for (;;) {
      const token = this.peek();
      if ((token.t === "op" && token.s === "(") || token.t === "id") {
        const right = this.pow();
        if (!right.ok) return right;
        left = { ok: true, node: { t: "bin", op: "*", left: left.node, right: right.node, implicit: true } };
        continue;
      }
      const op = this.eat("*") ? "*" : this.eat("/") ? "/" : "";
      if (!op) break;
      const right = this.pow();
      if (!right.ok) return right;
      left = { ok: true, node: { t: "bin", op, left: left.node, right: right.node } };
    }
    return left;
  }

  private pow(): NodeResult {
    if (this.eat("+")) return this.pow();
    if (this.eat("-")) {
      const value = this.pow();
      if (!value.ok) return value;
      return { ok: true, node: { t: "neg", expr: value.node } };
    }
    const base = this.primary();
    if (!base.ok) return base;
    if (!this.eat("^")) return base;
    const exp = this.pow();
    if (!exp.ok) return exp;
    return { ok: true, node: { t: "bin", op: "^", left: base.node, right: exp.node } };
  }

  private primary(): NodeResult {
    const token = this.peek();
    this.index += 1;
    if (token.t === "num") return { ok: true, node: { t: "num", n: token.n } };
    if (token.t === "op" && token.s === "(") {
      const inner = this.add();
      if (!inner.ok) return inner;
      if (!this.eat(")")) return { ok: false, error: "paren" };
      return inner;
    }
    if (token.t === "id") {
      const name = canonical(token.s);
      const next = this.peek();
      if (next.t === "op" && next.s === "(") {
        if (!FUNCTIONS[name]) return { ok: true, node: { t: "sym", name: token.s } };
        this.index += 1;
        const args: MathNode[] = [];
        if (!this.eat(")")) {
          for (;;) {
            const arg = this.add();
            if (!arg.ok) return arg;
            args.push(arg.node);
            if (this.eat(",")) continue;
            if (this.eat(")")) break;
            return { ok: false, error: "paren" };
          }
        }
        return { ok: true, node: { t: "call", name: token.s, args } };
      }
      if (name === "pi" || name === "pii") return { ok: true, node: { t: "sym", name: name === "pii" ? "pii" : "π" } };
      if (name === "e") return { ok: true, node: { t: "sym", name: "e" } };
      return { ok: true, node: { t: "sym", name: token.s } };
    }
    if (token.t === "eof") return { ok: false, error: "end" };
    return { ok: false, error: "char", detail: token.t === "op" ? token.s : "" };
  }
}

function substitute(node: MathNode, vars: Record<string, number>): MathNode {
  if (node.t === "sym") {
    const key = canonical(node.name);
    if (key === "pi" || key === "pii") return { t: "num", n: Math.PI };
    if (key === "e") return { t: "num", n: Math.E };
    if (Object.prototype.hasOwnProperty.call(vars, node.name)) return { t: "num", n: vars[node.name] };
    return node;
  }
  if (node.t === "neg") return { t: "neg", expr: substitute(node.expr, vars) };
  if (node.t === "call") return { ...node, args: node.args.map((arg) => substitute(arg, vars)) };
  if (node.t === "eq") return { t: "eq", left: substitute(node.left, vars), right: substitute(node.right, vars) };
  if (node.t === "bin") return { ...node, left: substitute(node.left, vars), right: substitute(node.right, vars) };
  return node;
}

function unknownName(node: MathNode): string | null {
  if (node.t === "sym") return isConstantName(node.name) ? null : node.name;
  if (node.t === "neg") return unknownName(node.expr);
  if (node.t === "call") {
    for (const arg of node.args) {
      const name = unknownName(arg);
      if (name) return name;
    }
    return null;
  }
  if (node.t === "num") return null;
  return unknownName(node.left) ?? unknownName(node.right);
}

function isConstantName(name: string): boolean {
  const key = canonical(name);
  return key === "pi" || key === "pii" || key === "e";
}

function reduceOnce(node: MathNode, angle: AngleMode): NodeResult & { changed?: boolean } {
  if (node.t === "num" || node.t === "sym" || node.t === "eq") return { ok: true, node, changed: false };
  if (node.t === "neg") {
    const inner = reduceOnce(node.expr, angle);
    if (!inner.ok) return inner;
    if (inner.changed) {
      if (inner.node.t === "num") return { ok: true, changed: true, node: { t: "num", n: -inner.node.n } };
      return { ok: true, changed: true, node: { t: "neg", expr: inner.node } };
    }
    if (node.expr.t === "num") return { ok: true, changed: true, node: { t: "num", n: -node.expr.n } };
    return { ok: true, node, changed: false };
  }
  if (node.t === "call") {
    const args = node.args.slice();
    for (let i = 0; i < args.length; i += 1) {
      const reduced = reduceOnce(args[i], angle);
      if (!reduced.ok) return reduced;
      if (reduced.changed) {
        args[i] = reduced.node;
        return { ok: true, changed: true, node: { ...node, args } };
      }
    }
    if (args.every((arg) => arg.t === "num")) {
      const called = callFunction(node.name, args.map((arg) => (arg.t === "num" ? arg.n : 0)), angle);
      if (!called.ok) return called;
      return { ok: true, changed: true, node: { t: "num", n: called.value } };
    }
    return { ok: true, node, changed: false };
  }
  const left = reduceOnce(node.left, angle);
  if (!left.ok) return left;
  if (left.changed) return { ok: true, changed: true, node: { ...node, left: left.node } };
  const right = reduceOnce(node.right, angle);
  if (!right.ok) return right;
  if (right.changed) return { ok: true, changed: true, node: { ...node, right: right.node } };
  if (node.left.t === "num" && node.right.t === "num") {
    if (node.op === "/" && node.right.n === 0) return { ok: false, error: "div0" };
    const value =
      node.op === "+"
        ? node.left.n + node.right.n
        : node.op === "-"
          ? node.left.n - node.right.n
          : node.op === "*"
            ? node.left.n * node.right.n
            : node.op === "/"
              ? node.left.n / node.right.n
              : node.left.n ** node.right.n;
    if (!Number.isFinite(value)) return { ok: false, error: "domain", detail: node.op };
    return { ok: true, changed: true, node: { t: "num", n: value } };
  }
  return { ok: true, node, changed: false };
}

export function serializeExpr(node: MathNode): string {
  if (node.t === "num") {
    if (Object.is(node.n, -0)) return "0";
    if (Number.isInteger(node.n) && Math.abs(node.n) < 1e15) return String(node.n);
    return String(node.n);
  }
  if (node.t === "sym") return node.name;
  if (node.t === "neg") return `-(${serializeExpr(node.expr)})`;
  if (node.t === "call") return `${node.name}(${node.args.map((arg) => serializeExpr(arg)).join("; ")})`;
  if (node.t === "eq") return `${serializeExpr(node.left)} = ${serializeExpr(node.right)}`;
  const left = serializeExpr(node.left);
  const right = serializeExpr(node.right);
  if (node.op === "^") return `${node.left.t === "bin" || node.left.t === "neg" ? `(${left})` : left}^${node.right.t === "bin" ? `(${right})` : right}`;
  if (node.op === "/" ) return `(${left})/(${right})`;
  if (node.op === "*" && node.implicit && node.right.t !== "num") {
    if (node.right.t === "sym" && (node.left.t === "num" || node.left.t === "sym")) return `${left}${right}`;
    return `${left}(${right})`;
  }
  return `${left} ${node.op} ${right}`;
}

export function stepExpression(step: MathNode): string {
  return serializeExpr(step);
}

function sameExpr(a: MathNode, b: MathNode): boolean {
  return serializeExpr(a) === serializeExpr(b);
}

export function evaluateExpr(input: string, vars: Record<string, number>, angle: AngleMode): ExprValue {
  const tokens = tokenize(input.trim());
  if (!Array.isArray(tokens)) return tokens;
  const parsed = new Parser(tokens).parse();
  if (!parsed.ok) return parsed;
  if (parsed.alias) return evaluateNamed(parsed.node, parsed.alias, vars, angle);
  if (parsed.right) return evaluateEquation(parsed.node, parsed.right, vars, angle);
  return evaluateTree(parsed.node, vars, angle);
}

function evaluateNamed(node: MathNode, name: string, vars: Record<string, number>, angle: AngleMode): ExprValue {
  const value = evaluateTree(node, vars, angle);
  if (!value.ok) return value;
  const key = canonical(name);
  if (isConstantName(name)) {
    const expected = key === "e" ? Math.E : Math.PI;
    if (Math.abs(value.value - expected) > 1e-6) return { ok: false, error: "assign", detail: name };
  }
  return { ...value, name };
}

function evaluateTree(node: MathNode, vars: Record<string, number>, angle: AngleMode): ExprValue {
  const steps: MathNode[] = [node];
  const substituted = substitute(node, vars);
  if (!sameExpr(substituted, node)) steps.push(substituted);
  const missing = unknownName(substituted);
  if (missing) return { ok: false, error: "name", detail: missing };
  const collapsed = collapse(substituted, angle, steps);
  if (!collapsed.ok) return collapsed;
  if (collapsed.node.t !== "num") return { ok: false, error: "name" };
  return { ok: true, value: collapsed.node.n, steps };
}

function bareName(node: MathNode): string | null {
  return node.t === "sym" && !isConstantName(node.name) ? node.name : null;
}

function collapse(node: MathNode, angle: AngleMode, steps?: MathNode[]): NodeResult {
  let current = node;
  for (let guard = 0; guard < 40; guard += 1) {
    if (current.t === "num") break;
    const next = reduceOnce(current, angle);
    if (!next.ok) return next;
    if (!next.changed) break;
    current = next.node;
    steps?.push(current);
  }
  return { ok: true, node: current };
}

function evaluateEquation(left: MathNode, right: MathNode, vars: Record<string, number>, angle: AngleMode): ExprValue {
  const defined = bareName(left);
  if (defined && !containsName(right, defined)) {
    const value = evaluateTree(right, vars, angle);
    if (!value.ok) return value;
    return { ...value, name: defined, steps: [{ t: "eq", left, right }, ...value.steps] };
  }
  const steps: MathNode[] = [{ t: "eq", left, right }];
  const knownLeft = substitute(left, vars);
  const knownRight = substitute(right, vars);
  if (!sameExpr(knownLeft, left) || !sameExpr(knownRight, right)) steps.push({ t: "eq", left: knownLeft, right: knownRight });
  const unknowns = new Set<string>();
  collectUnknowns(knownLeft, unknowns);
  collectUnknowns(knownRight, unknowns);
  if (unknowns.size > 1) return { ok: false, error: "many" };
  if (unknowns.size === 0) {
    const leftValue = collapse(knownLeft, angle);
    const rightValue = collapse(knownRight, angle);
    if (!leftValue.ok) return leftValue;
    if (!rightValue.ok) return rightValue;
    if (leftValue.node.t !== "num" || rightValue.node.t !== "num") return { ok: false, error: "name" };
    if (Math.abs(leftValue.node.n - rightValue.node.n) > 1e-9) return { ok: false, error: "none", detail: "mismatch" };
    return { ok: true, value: leftValue.node.n, steps };
  }
  const unknown = [...unknowns][0];
  const at = (x: number) => {
    const diff: MathNode = {
      t: "bin",
      op: "-",
      left: replaceName(knownLeft, unknown, x),
      right: replaceName(knownRight, unknown, x),
    };
    return collapse(diff, angle);
  };
  const y0 = at(0);
  const y1 = at(1);
  const y2 = at(2);
  if (!y0.ok) return y0;
  if (!y1.ok) return y1;
  if (!y2.ok) return y2;
  if (y0.node.t !== "num" || y1.node.t !== "num" || y2.node.t !== "num") return { ok: false, error: "none" };
  const slope = y1.node.n - y0.node.n;
  const linear = Math.abs(y2.node.n - (y0.node.n + 2 * slope)) <= 1e-6 * (1 + Math.abs(y2.node.n));
  if (!linear || Math.abs(slope) < 1e-12) {
    if (linear && Math.abs(y0.node.n) <= 1e-9) return { ok: false, error: "eq" };
    return { ok: false, error: "none" };
  }
  const solved = tidy(-y0.node.n / slope);
  const check = at(solved);
  if (!check.ok) return check;
  if (check.node.t !== "num" || Math.abs(check.node.n) > 1e-6 * (1 + Math.abs(solved))) return { ok: false, error: "none" };
  steps.push({ t: "eq", left: { t: "sym", name: unknown }, right: { t: "num", n: solved } });
  return { ok: true, value: solved, name: unknown, steps };
}

function collectUnknowns(node: MathNode, out: Set<string>) {
  if (node.t === "sym") {
    if (!isConstantName(node.name)) out.add(node.name);
    return;
  }
  if (node.t === "neg") collectUnknowns(node.expr, out);
  else if (node.t === "call") node.args.forEach((arg) => collectUnknowns(arg, out));
  else if (node.t !== "num") {
    collectUnknowns(node.left, out);
    collectUnknowns(node.right, out);
  }
}

function containsName(node: MathNode, name: string): boolean {
  const names = new Set<string>();
  collectUnknowns(node, names);
  return names.has(name);
}

function replaceName(node: MathNode, name: string, value: number): MathNode {
  if (node.t === "sym") return node.name === name ? { t: "num", n: value } : node;
  if (node.t === "neg") return { t: "neg", expr: replaceName(node.expr, name, value) };
  if (node.t === "call") return { ...node, args: node.args.map((arg) => replaceName(arg, name, value)) };
  if (node.t === "eq") return { t: "eq", left: replaceName(node.left, name, value), right: replaceName(node.right, name, value) };
  if (node.t === "bin") return { ...node, left: replaceName(node.left, name, value), right: replaceName(node.right, name, value) };
  return node;
}

function tidy(value: number): number {
  if (!Number.isFinite(value)) return value;
  const rounded = Math.round(value);
  if (Math.abs(value - rounded) < 1e-9) return rounded;
  const scaled = Math.round(value * 1e9) / 1e9;
  return Math.abs(value - scaled) < 1e-8 ? scaled : value;
}

function canonical(name: string): string {
  if (name === "π") return "pi";
  return name.toLowerCase();
}

export function validVariableName(name: string): boolean {
  return /^\p{L}[\p{L}\p{N}_]*$/u.test(name) && !FUNCTIONS[canonical(name)] && !isConstantName(name);
}


export function parseDisplayNumber(raw: string): number | null {
  let text = raw.replace(/[\u00a0\u202f]/g, " ").trim();
  const sci = text.match(/^([+-]?[\d\s.,]+)\s*[×x*]\s*10\^(-?\d+)$/);
  if (sci) {
    const base = parsePlainNumber(sci[1]);
    if (base === null) return null;
    return base * 10 ** Number(sci[2]);
  }
  text = text.replace(/\s*e\s*/i, "e");
  return parsePlainNumber(text);
}

function parsePlainNumber(raw: string): number | null {
  let text = raw.replace(/\s/g, "");
  if (!text) return null;
  if (text.includes(",") && text.includes(".")) {
    if (text.lastIndexOf(",") > text.lastIndexOf(".")) text = text.replace(/\./g, "").replace(",", ".");
    else text = text.replace(/,/g, "");
  } else if (text.includes(",")) text = text.replace(",", ".");
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(text)) return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}
