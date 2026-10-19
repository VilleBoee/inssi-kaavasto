import { getLocale, t } from "../i18n";

export const CATEGORIES = [
  { id: "tieto", label: "Tietokone" },
  { id: "verkko", label: "Tietoverkot" },
  { id: "elektroniikka", label: "Elektroniikka" },
  { id: "fysiikka", label: "Fysiikka" },
  { id: "matematiikka", label: "Matematiikka" },
  { id: "suureet", label: "Suureet" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type FormulaInput = {
  id: string;
  label: string;
  kind: "number" | "text" | "select" | "textarea";
  unit?: string;
  placeholder?: string;
  hint?: string;
  options?: { value: string; label: string }[];
};

export type ResultRow = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  emphasis?: boolean;
};

export type ComputeResult =
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "ok"; rows: ResultRow[] };

export type Formula = {
  id: string;
  subcategory: string;
  name: string;
  category: CategoryId;
  blurb: string;
  expression: string;
  note?: string;
  tags: string[];
  seed: Record<string, string>;
  fields: (raw: Record<string, string>) => FormulaInput[];
  compute: (raw: Record<string, string>) => ComputeResult;
  tables?: { title: string; columns: string[]; rows: string[][] }[];
};

const NUM_FMT = {
  fi: new Intl.NumberFormat("fi-FI", { maximumSignificantDigits: 8 }),
  en: new Intl.NumberFormat("en-GB", { maximumSignificantDigits: 8 }),
};
const COUNT_FMT = {
  fi: new Intl.NumberFormat("fi-FI", { maximumFractionDigits: 2 }),
  en: new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 }),
};

function decimal(text: string): string {
  return getLocale() === "fi" ? text.replace(".", ",") : text;
}

export function formatNum(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e7 || abs < 1e-4) return decimal(n.toExponential(4));
  return NUM_FMT[getLocale()].format(n);
}

export function formatCount(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) >= 1e15) return decimal(n.toExponential(3));
  return COUNT_FMT[getLocale()].format(n);
}

export function formatPow2(exp: number): string {
  if (!Number.isFinite(exp)) return "—";
  if (exp < 0) return formatNum(2 ** exp);
  if (exp <= 50) return formatCount(2 ** exp);
  const log10 = exp * Math.log10(2);
  const e = Math.floor(log10);
  const m = 10 ** (log10 - e);
  return `${formatNum(m)} × 10^${e}`;
}

export function formatSciFromLog10(log10: number): string {
  if (!Number.isFinite(log10)) return "—";
  if (log10 < -12) return `≈ 10^${formatNum(log10)}`;
  if (log10 > 12) {
    const e = Math.floor(log10);
    const m = 10 ** (log10 - e);
    return `${formatNum(m)} × 10^${e}`;
  }
  const n = 10 ** log10;
  if (Math.abs(n - Math.round(n)) < 1e-6 && Math.abs(n) < 1e12) return formatCount(Math.round(n));
  return formatNum(n);
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";
  if (seconds === 0) return "0 s";
  if (seconds < 1e-9) return `${formatNum(seconds * 1e12)} ps`;
  if (seconds < 1e-6) return `${formatNum(seconds * 1e9)} ns`;
  if (seconds < 1e-3) return `${formatNum(seconds * 1e6)} µs`;
  if (seconds < 1) return `${formatNum(seconds * 1e3)} ms`;
  if (seconds < 60) return `${formatNum(seconds)} s`;
  let rest = Math.round(seconds);
  const parts: string[] = [];
  const units: [number, string][] = [
    [86400, t(getLocale(), "vrk")],
    [3600, "h"],
    [60, "min"],
    [1, "s"],
  ];
  for (const [size, label] of units) {
    if (rest >= size) {
      const n = Math.floor(rest / size);
      parts.push(`${n} ${label}`);
      rest -= n * size;
    }
    if (parts.length === 3) break;
  }
  return parts.join(" ") || "0 s";
}

export function parseNum(raw: string): number | null {
  const s = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!s) return null;
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function parseBig(raw: string): bigint | null {
  const s = raw.trim().replace(/\s/g, "");
  if (!/^[+-]?\d+$/.test(s)) return null;
  try {
    return BigInt(s);
  } catch {
    return null;
  }
}

export function parseAutoInt(raw: string): bigint | null {
  let s = raw.trim().replace(/\s/g, "");
  if (!s) return null;
  let neg = false;
  if (s.startsWith("-")) {
    neg = true;
    s = s.slice(1);
  }
  if (!s) return null;
  try {
    let n: bigint;
    if (/^0b[01]+$/i.test(s)) n = BigInt(s);
    else if (/^0x[0-9a-f]+$/i.test(s)) n = BigInt(s);
    else if (/^\d+$/.test(s)) n = BigInt(s);
    else return null;
    return neg ? -n : n;
  } catch {
    return null;
  }
}

export function row(
  id: string,
  label: string,
  value: string,
  unit?: string,
  emphasis = false,
): ResultRow {
  return { id, label, value, unit, emphasis };
}

export function ok(rows: ResultRow[]): ComputeResult {
  return { status: "ok", rows };
}

export function empty(): ComputeResult {
  return { status: "empty" };
}

export function err(message: string): ComputeResult {
  return { status: "error", message };
}

export function readNums(raw: Record<string, string>, ids: string[]): number[] | ComputeResult {
  const values: number[] = [];
  for (const id of ids) {
    const v = (raw[id] ?? "").trim();
    if (!v) return empty();
    const n = parseNum(v);
    if (n === null) return err("Lukua ei tunnistettu. Käytä desimaalipilkkua tai pistettä.");
    values.push(n);
  }
  return values;
}

export function failed(x: number[] | ComputeResult): x is ComputeResult {
  return !Array.isArray(x);
}

export function val(raw: Record<string, string>, id: string, fallback = ""): string {
  const v = raw[id];
  return v === undefined || v === null ? fallback : v;
}

export function numField(
  id: string,
  label: string,
  unit?: string,
  placeholder?: string,
  hint?: string,
): FormulaInput {
  return { id, label, kind: "number", unit, placeholder, hint };
}

export function textField(
  id: string,
  label: string,
  placeholder?: string,
  hint?: string,
): FormulaInput {
  return { id, label, kind: "text", placeholder, hint };
}

export function areaField(
  id: string,
  label: string,
  placeholder?: string,
  hint?: string,
): FormulaInput {
  return { id, label, kind: "textarea", placeholder, hint };
}

export function selectField(
  id: string,
  label: string,
  options: { value: string; label: string }[],
  hint?: string,
): FormulaInput {
  return { id, label, kind: "select", options, hint };
}

export function fixed(inputs: FormulaInput[]): (raw: Record<string, string>) => FormulaInput[] {
  return () => inputs;
}

export function groupBits(bits: string): string {
  const neg = bits.startsWith("-");
  const body = neg ? bits.slice(1) : bits;
  const pad = body.padStart(Math.ceil(body.length / 4) * 4, "0");
  const grouped = pad.replace(/(.{4})/g, "$1 ").trim();
  return neg ? `-${grouped}` : grouped;
}

export function toBase(n: bigint, base: number): string {
  if (base < 2 || base > 36) return "—";
  const neg = n < 0n;
  let x = neg ? -n : n;
  if (x === 0n) return "0";
  const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
  let out = "";
  const b = BigInt(base);
  while (x > 0n) {
    const d = Number(x % b);
    out = digits[d] + out;
    x /= b;
  }
  return neg ? `-${out}` : out;
}

export function parseInBase(raw: string, base: number): bigint | ComputeResult {
  let s = raw.trim().replace(/\s/g, "");
  if (!s) return empty();
  let neg = false;
  if (s.startsWith("-") || s.startsWith("+")) {
    neg = s.startsWith("-");
    s = s.slice(1);
  }
  if (base === 2 && /^0b/i.test(s)) s = s.slice(2);
  if (base === 16 && /^0x/i.test(s)) s = s.slice(2);
  if (base === 8 && /^0o/i.test(s)) s = s.slice(2);
  if (!s) return empty();
  if (s.length > 256) return err("Luku on liian pitkä (enintään 256 merkkiä).");
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  const body = s.toLowerCase();
  let n = 0n;
  const b = BigInt(base);
  for (const ch of body) {
    const d = alphabet.indexOf(ch);
    if (d < 0 || d >= base) return err(`Merkki "${ch}" ei kuulu kantalukuun ${base}.`);
    n = n * b + BigInt(d);
  }
  return neg ? -n : n;
}

export function isBig(x: bigint | ComputeResult): x is ComputeResult {
  return typeof x !== "bigint";
}

export const DATA_UNITS: { value: string; label: string; bytes: number }[] = [
  { value: "bit", label: "bitti (bit)", bytes: 0.125 },
  { value: "B", label: "tavu (B)", bytes: 1 },
  { value: "kB", label: "kilotavu (kB, 10³)", bytes: 1e3 },
  { value: "MB", label: "megatavu (MB, 10⁶)", bytes: 1e6 },
  { value: "GB", label: "gigatavu (GB, 10⁹)", bytes: 1e9 },
  { value: "TB", label: "teratavu (TB, 10¹²)", bytes: 1e12 },
  { value: "PB", label: "petatavu (PB, 10¹⁵)", bytes: 1e15 },
  { value: "KiB", label: "kibitavu (KiB, 2¹⁰)", bytes: 1024 },
  { value: "MiB", label: "mebitavu (MiB, 2²⁰)", bytes: 1024 ** 2 },
  { value: "GiB", label: "gibitavu (GiB, 2³⁰)", bytes: 1024 ** 3 },
  { value: "TiB", label: "tebitavu (TiB, 2⁴⁰)", bytes: 1024 ** 4 },
  { value: "PiB", label: "pebitavu (PiB, 2⁵⁰)", bytes: 1024 ** 5 },
];

export const BW_UNITS: { value: string; label: string; bps: number }[] = [
  { value: "bps", label: "bit/s", bps: 1 },
  { value: "kbps", label: "kbit/s", bps: 1e3 },
  { value: "Mbps", label: "Mbit/s", bps: 1e6 },
  { value: "Gbps", label: "Gbit/s", bps: 1e9 },
  { value: "kBs", label: "kB/s", bps: 8e3 },
  { value: "MBs", label: "MB/s", bps: 8e6 },
  { value: "GBs", label: "GB/s", bps: 8e9 },
];

export function dataUnit(id: string) {
  return DATA_UNITS.find((u) => u.value === id) ?? DATA_UNITS[1];
}

export function bwUnit(id: string) {
  return BW_UNITS.find((u) => u.value === id) ?? BW_UNITS[2];
}

export function bytesLabel(bytes: number): string {
  const table: [number, string][] = [
    [1024 ** 5, "PiB"],
    [1024 ** 4, "TiB"],
    [1024 ** 3, "GiB"],
    [1024 ** 2, "MiB"],
    [1024, "KiB"],
  ];
  for (const [size, label] of table) {
    if (Math.abs(bytes) >= size) return `${formatNum(bytes / size)} ${label}`;
  }
  return `${formatNum(bytes)} B`;
}

export function ipv4ToInt(ip: string): number | null {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const v = Number(part);
    if (v > 255) return null;
    n = (n << 8) + v;
  }
  return n >>> 0;
}

export function intToIpv4(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

export function maskOf(prefix: number): number {
  if (prefix <= 0) return 0;
  if (prefix >= 32) return 0xffffffff;
  return (0xffffffff << (32 - prefix)) >>> 0;
}

const C = 299_792_458;

export function waveSpeed(medium: string, custom: number): number | null {
  if (medium === "c") return C;
  if (medium === "cable") return 0.66 * C;
  if (medium === "custom") return custom > 0 ? custom : null;
  return null;
}

export const SI_PREFIXES: { value: string; label: string; exp: number }[] = [
  { value: "24", label: "jotta (Y, 10²⁴)", exp: 24 },
  { value: "21", label: "tsetta (Z, 10²¹)", exp: 21 },
  { value: "18", label: "eksa (E, 10¹⁸)", exp: 18 },
  { value: "15", label: "peta (P, 10¹⁵)", exp: 15 },
  { value: "12", label: "tera (T, 10¹²)", exp: 12 },
  { value: "9", label: "giga (G, 10⁹)", exp: 9 },
  { value: "6", label: "mega (M, 10⁶)", exp: 6 },
  { value: "3", label: "kilo (k, 10³)", exp: 3 },
  { value: "2", label: "hehto (h, 10²)", exp: 2 },
  { value: "1", label: "deka (da, 10¹)", exp: 1 },
  { value: "0", label: "perusyksikkö", exp: 0 },
  { value: "-1", label: "desi (d, 10⁻¹)", exp: -1 },
  { value: "-2", label: "sentti (c, 10⁻²)", exp: -2 },
  { value: "-3", label: "milli (m, 10⁻³)", exp: -3 },
  { value: "-6", label: "mikro (µ, 10⁻⁶)", exp: -6 },
  { value: "-9", label: "nano (n, 10⁻⁹)", exp: -9 },
  { value: "-12", label: "piko (p, 10⁻¹²)", exp: -12 },
  { value: "-15", label: "femto (f, 10⁻¹⁵)", exp: -15 },
  { value: "-18", label: "atto (a, 10⁻¹⁸)", exp: -18 },
  { value: "-21", label: "tsepto (z, 10⁻²¹)", exp: -21 },
  { value: "-24", label: "jokto (y, 10⁻²⁴)", exp: -24 },
];

export function prefixExp(id: string): number {
  return SI_PREFIXES.find((p) => p.value === id)?.exp ?? 0;
}

export function nCrLog10(n: number, r: number): number {
  const k = Math.min(r, n - r);
  let log = 0;
  for (let i = 1; i <= k; i++) log += Math.log10(n - k + i) - Math.log10(i);
  return log;
}

export function nPrLog10(n: number, r: number): number {
  let log = 0;
  for (let i = 0; i < r; i++) log += Math.log10(n - i);
  return log;
}

export function normalizeSearch(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}
