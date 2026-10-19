import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Atom,
  BookOpen,
  Check,
  Copy,
  Cpu,
  Network,
  RotateCcw,
  Ruler,
  Search,
  Sigma,
  Star,
  Zap,
} from "lucide-react";
import { clsx } from "clsx";
import {
  CATEGORIES,
  FORMULAS,
  categoryLabel,
  formulaHaystack,
  getFormula,
  type CategoryId,
  type Formula,
  type FormulaInput,
} from "@/lib/formulas";
import { setLocale, subcategoryLabel, t, type Locale } from "@/lib/i18n";

type FilterId = "kaikki" | "suosikit" | CategoryId;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "kaikki", label: "Kaikki" },
  { id: "suosikit", label: "Suosikit" },
  ...CATEGORIES,
];

const LocaleContext = createContext<Locale>("fi");

function loadList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function CategoryGlyph({ id }: { id: FilterId }) {
  const className = "size-4 shrink-0";
  if (id === "tieto") return <Cpu className={className} aria-hidden="true" />;
  if (id === "verkko") return <Network className={className} aria-hidden="true" />;
  if (id === "elektroniikka") return <Zap className={className} aria-hidden="true" />;
  if (id === "fysiikka") return <Atom className={className} aria-hidden="true" />;
  if (id === "matematiikka") return <Sigma className={className} aria-hidden="true" />;
  if (id === "suureet") return <Ruler className={className} aria-hidden="true" />;
  if (id === "suosikit") return <Star className={className} aria-hidden="true" />;
  return <BookOpen className={className} aria-hidden="true" />;
}

function FieldControl({
  input,
  value,
  onChange,
}: {
  input: FormulaInput;
  value: string;
  onChange: (value: string) => void;
}) {
  const locale = useContext(LocaleContext);
  const label = t(locale, input.label);
  const hint = input.hint ? t(locale, input.hint) : undefined;
  const unit = input.unit ? t(locale, input.unit) : undefined;
  const placeholder = input.placeholder ? t(locale, input.placeholder) : undefined;
  const inlineUnit = Boolean(unit && unit.length <= 8);
  const control =
    "w-full rounded-md border border-line bg-bg text-base text-ink outline-none transition-colors duration-200";
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">
        {label}
        {!inlineUnit && unit ? <span className="font-normal text-muted"> ({unit})</span> : null}
      </span>
      {input.kind === "select" ? (
        <select className={clsx(control, "h-11 px-3")} value={value} onChange={(event) => onChange(event.target.value)}>
          {input.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {t(locale, option.label)}
            </option>
          ))}
        </select>
      ) : input.kind === "textarea" ? (
        <textarea
          className={clsx(control, "min-h-28 px-3 py-3")}
          value={value}
          placeholder={placeholder}
          spellCheck={false}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <span className="relative">
          <input
            className={clsx(control, "h-11 px-3", inlineUnit && "pr-16")}
            value={value}
            inputMode={input.kind === "number" ? "decimal" : "text"}
            placeholder={placeholder}
            spellCheck={false}
            autoCapitalize="off"
            onChange={(event) => onChange(event.target.value)}
          />
          {inlineUnit ? (
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-sm text-muted">
              {unit}
            </span>
          ) : null}
        </span>
      )}
      {hint ? <span className="text-sm text-muted">{hint}</span> : null}
    </label>
  );
}

export function KaavastoApp() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("kaikki");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({});
  const [copied, setCopied] = useState(false);
  const [locale, setUiLocale] = useState<Locale>("fi");
  setLocale(locale);

  useEffect(() => {
    setFavorites(loadList("kaavasto:favorites"));
    setRecent(loadList("kaavasto:recent"));
    const stored = localStorage.getItem("kaavasto:locale");
    if (stored === "en" || stored === "fi") setUiLocale(stored);
    const id = window.location.hash.replace(/^#/, "");
    if (getFormula(id)) setActiveId(id);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("kaavasto:favorites", JSON.stringify(favorites));
  }, [favorites, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("kaavasto:recent", JSON.stringify(recent));
  }, [recent, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("kaavasto:locale", locale);
    document.documentElement.lang = locale;
  }, [locale, ready]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT");
      if (event.key === "/" && !typing) {
        event.preventDefault();
        document.getElementById("kaavasto-search")?.focus();
      }
      if (event.key === "Escape") {
        if (activeId) {
          setActiveId(null);
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        } else if (!typing) {
          setQuery("");
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId]);

  const visible = useMemo(() => {
    const words = query
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .split(/\s+/)
      .filter(Boolean);
    return FORMULAS.filter((formula) => {
      if (filter === "suosikit" && !favorites.includes(formula.id)) return false;
      if (filter !== "kaikki" && filter !== "suosikit" && formula.category !== filter) return false;
      if (words.length === 0) return true;
      const hay = formulaHaystack(formula);
      return words.every((word) => hay.includes(word));
    });
  }, [query, filter, favorites]);

  const formula = activeId ? getFormula(activeId) : undefined;

  function openFormula(id: string) {
    setActiveId(id);
    setCopied(false);
    setRecent((prev) => [id, ...prev.filter((item) => item !== id)].slice(0, 8));
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${id}`);
    window.scrollTo(0, 0);
  }

  function closeFormula() {
    setActiveId(null);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  function valuesOf(item: Formula): Record<string, string> {
    return drafts[item.id] ?? item.seed;
  }

  function updateField(item: Formula, id: string, value: string) {
    setDrafts((prev) => ({
      ...prev,
      [item.id]: { ...(prev[item.id] ?? item.seed), [id]: value },
    }));
  }

  async function copyResult(item: Formula) {
    const result = item.compute(valuesOf(item));
    if (result.status !== "ok") return;
    const text = [
      t(locale, item.name),
      item.expression,
      ...result.rows.map((line) => `${t(locale, line.label)}: ${t(locale, line.value)}${line.unit ? ` ${t(locale, line.unit)}` : ""}`),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const countLabel =
    visible.length === FORMULAS.length
      ? locale === "fi"
        ? `${FORMULAS.length} kaavaa`
        : `${FORMULAS.length} formulas`
      : `${visible.length} / ${FORMULAS.length}`;

  return (
    <LocaleContext.Provider value={locale}>
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-md bg-ink font-mono text-xl text-paper">ƒ</span>
              <div className="min-w-0">
                <p className="font-mono text-xs tracking-widest text-accent uppercase">{t(locale, "Insinöörin kaavakirja")}</p>
                <h1 className="text-2xl leading-tight font-semibold">Kaavasto</h1>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <div className="flex rounded-md border border-line bg-bg p-0.5" role="group" aria-label={t(locale, "Kieli")}>
                {(["fi", "en"] as const).map((code) => (
                  <button
                    key={code}
                    type="button"
                    aria-pressed={locale === code}
                    onClick={() => setUiLocale(code)}
                    className={clsx(
                      "h-11 rounded px-3 font-mono text-sm",
                      locale === code ? "bg-ink text-paper" : "text-muted",
                    )}
                  >
                    {code.toUpperCase()}
                  </button>
                ))}
              </div>
              <p className="font-mono text-sm text-muted tabular-nums">{countLabel}</p>
            </div>
          </div>
          <label className="relative block">
            <span className="sr-only">{t(locale, "Hae kaavoja")}</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="kaavasto-search"
              className="h-12 w-full rounded-md border border-line bg-bg pr-4 pl-11 text-base text-ink outline-none"
              placeholder={t(locale, "Hae: newton, tsiolkovski, aliverkko, epävarmuus…")}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (activeId) closeFormula();
              }}
            />
          </label>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-8">
        <nav className="hidden w-60 shrink-0 lg:block" aria-label={t(locale, "Aihealueet")}>
          <ul className="sticky top-32 flex flex-col gap-1">
            {FILTERS.map((item) => {
              const count =
                item.id === "kaikki"
                  ? FORMULAS.length
                  : item.id === "suosikit"
                    ? favorites.length
                    : FORMULAS.filter((entry) => entry.category === item.id).length;
              const selected = filter === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setFilter(item.id)}
                    className={clsx(
                      "flex h-11 w-full items-center gap-2 rounded-md px-3 text-left text-sm transition-colors duration-200",
                      selected ? "bg-ink text-paper" : "text-ink hover:bg-paper",
                    )}
                  >
                    <CategoryGlyph id={item.id} />
                    <span className="flex-1">{t(locale, item.label)}</span>
                    <span className={clsx("font-mono text-xs tabular-nums", selected ? "text-ink-soft" : "text-muted")}>{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <main className="min-w-0 flex-1">
          <div className="mb-4 flex gap-2 overflow-x-auto lg:hidden" aria-label={t(locale, "Aihealueet")}>
            {FILTERS.map((item) => {
              const selected = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setFilter(item.id)}
                  className={clsx(
                    "flex h-11 shrink-0 items-center gap-2 rounded-md border px-3 text-sm",
                    selected ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink",
                  )}
                >
                  <CategoryGlyph id={item.id} />
                  {t(locale, item.label)}
                </button>
              );
            })}
          </div>

          {formula ? (
            <Worksheet
              formula={formula}
              favorite={favorites.includes(formula.id)}
              copied={copied}
              onBack={closeFormula}
              onToggleFavorite={() => toggleFavorite(formula.id)}
              onChange={(id, value) => updateField(formula, id, value)}
              onReset={() =>
                setDrafts((prev) => ({
                  ...prev,
                  [formula.id]: { ...formula.seed },
                }))
              }
              onCopy={() => void copyResult(formula)}
              values={valuesOf(formula)}
            />
          ) : (
            <Library
              formulas={visible}
              favorites={favorites}
              recent={recent}
              showRecent={query.trim() === "" && filter === "kaikki"}
              onOpen={openFormula}
              onToggleFavorite={toggleFavorite}
              onClear={() => setQuery("")}
              query={query}
            />
          )}
        </main>
      </div>

      <footer className="mx-auto max-w-6xl px-4 pt-2 pb-10 text-sm text-muted lg:px-8">
        {t(locale, "Laskurit ovat tarkastus- ja opiskelukäyttöön. Kriittinen mitoitus tarkistetaan alkuperäislähteestä. Haku avautuu näppäimellä /.")}
      </footer>
    </div>
    </LocaleContext.Provider>
  );
}

function Library({
  formulas,
  favorites,
  recent,
  showRecent,
  onOpen,
  onToggleFavorite,
  onClear,
  query,
}: {
  formulas: Formula[];
  favorites: string[];
  recent: string[];
  showRecent: boolean;
  onOpen: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onClear: () => void;
  query: string;
}) {
  const locale = useContext(LocaleContext);
  const recentFormulas = recent.map((id) => getFormula(id)).filter((item): item is Formula => Boolean(item));
  if (formulas.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-paper px-6 py-14 text-center">
        <p className="text-lg font-semibold">{t(locale, "Ei kaavoja")}</p>
        <p className="mt-2 text-pretty text-muted">
          {query.trim()
            ? t(locale, "Haulla ei löytynyt mitään.").replace("{q}", query.trim())
            : t(locale, "Suosikeissa ei ole vielä kaavoja. Merkitse tähti kaavan kohdalle.")}
        </p>
        {query.trim() ? (
          <button type="button" onClick={onClear} className="mt-5 h-11 rounded-md bg-accent px-4 text-sm font-medium text-accent-ink">
            {t(locale, "Tyhjennä haku")}
          </button>
        ) : null}
      </div>
    );
  }

  const groups: { key: string; category: string; sub: string; items: Formula[] }[] = [];
  const groupByKey = new Map<string, (typeof groups)[number]>();
  for (const item of formulas) {
    const key = `${item.category}:${item.subcategory}`;
    let group = groupByKey.get(key);
    if (!group) {
      group = {
        key,
        category: t(locale, categoryLabel(item.category)),
        sub: subcategoryLabel(item.subcategory, locale),
        items: [],
      };
      groupByKey.set(key, group);
      groups.push(group);
    }
    group.items.push(item);
  }

  const sections = [];
  if (showRecent && recentFormulas.length > 0) {
    sections.push(
      <section key="recent">
        <h2 className="mb-2 font-mono text-xs tracking-widest text-muted uppercase">{t(locale, "Viimeksi käytetyt")}</h2>
        <div className="flex flex-wrap gap-2">
          {recentFormulas.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpen(item.id)}
              className="h-11 rounded-md border border-line bg-paper px-3 text-sm hover:border-accent"
            >
              {t(locale, item.name)}
            </button>
          ))}
        </div>
      </section>,
    );
  }
  for (const group of groups) {
    sections.push(
      <section key={group.key}>
        <h2 className="mb-3 text-sm font-medium">
          <span className="text-muted">{group.category}</span>
          <span className="px-2 text-accent" aria-hidden="true">
            •
          </span>
          {group.sub}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {group.items.map((item) => {
            const favorite = favorites.includes(item.id);
            const name = t(locale, item.name);
            return (
              <li key={item.id} className="relative rounded-lg border border-line bg-paper shadow-sm">
                <button
                  type="button"
                  aria-label={
                    favorite
                      ? t(locale, "Poista suosikeista: {name}").replace("{name}", name)
                      : t(locale, "Lisää suosikkeihin: {name}").replace("{name}", name)
                  }
                  aria-pressed={favorite}
                  onClick={() => onToggleFavorite(item.id)}
                  className="absolute top-2 right-2 z-10 grid size-11 place-items-center rounded-md"
                >
                  <Star className={favorite ? "size-5 fill-accent text-accent" : "size-5 text-muted"} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => onOpen(item.id)} className="flex w-full flex-col gap-2 p-4 pr-14 text-left">
                  <span className="text-lg leading-snug font-semibold">{name}</span>
                  <span className="font-mono text-sm break-words text-ink">{item.expression}</span>
                  <span className="text-sm text-pretty text-muted">{t(locale, item.blurb)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>,
    );
  }

  return <div className="flex flex-col gap-8">{sections}</div>;
}

function Worksheet({
  formula,
  values,
  favorite,
  copied,
  onBack,
  onToggleFavorite,
  onChange,
  onReset,
  onCopy,
}: {
  formula: Formula;
  values: Record<string, string>;
  favorite: boolean;
  copied: boolean;
  onBack: () => void;
  onToggleFavorite: () => void;
  onChange: (id: string, value: string) => void;
  onReset: () => void;
  onCopy: () => void;
}) {
  const locale = useContext(LocaleContext);
  const fields = formula.fields(values);
  const result = formula.compute(values);
  const reference = Boolean(formula.tables?.length) && fields.length === 0;
  return (
    <article id="kaavasto-tyokalu" className={clsx("mx-auto flex w-full flex-col gap-5", reference ? "max-w-6xl" : "max-w-3xl")}>
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="flex h-11 items-center gap-2 rounded-md px-2 text-sm font-medium">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t(locale, "Kaikki kaavat")}
        </button>
        <button
          type="button"
          aria-pressed={favorite}
          aria-label={favorite ? t(locale, "Poista suosikeista") : t(locale, "Lisää suosikkeihin")}
          onClick={onToggleFavorite}
          className="grid size-11 place-items-center rounded-md border border-line bg-paper"
        >
          <Star className={favorite ? "size-5 fill-accent text-accent" : "size-5 text-muted"} aria-hidden="true" />
        </button>
      </div>

      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs tracking-widest text-accent uppercase">
          {t(locale, categoryLabel(formula.category))}
          <span className="px-2" aria-hidden="true">
            •
          </span>
          {subcategoryLabel(formula.subcategory, locale)}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight">{t(locale, formula.name)}</h2>
        <p className="rounded-md border border-line bg-paper px-4 py-3 font-mono text-sm break-words">{formula.expression}</p>
        <p className="text-pretty text-muted">{t(locale, formula.blurb)}</p>
      </header>

      {fields.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((input) => (
            <FieldControl key={input.id} input={input} value={values[input.id] ?? ""} onChange={(value) => onChange(input.id, value)} />
          ))}
        </div>
      ) : null}

      {fields.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onReset} className="flex h-11 items-center gap-2 rounded-md border border-line bg-paper px-3 text-sm">
            <RotateCcw className="size-4" aria-hidden="true" />
            {t(locale, "Palauta esimerkki")}
          </button>
        </div>
      ) : null}

      {formula.tables?.map((table) => (
        <section key={table.title} className="overflow-hidden rounded-lg border border-line bg-paper">
          <h3 className="border-b border-line px-4 py-3 font-mono text-xs tracking-widest text-accent uppercase">{t(locale, table.title)}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink text-paper">
                <tr>
                  {table.columns.map((column) => (
                    <th key={column} className="px-3 py-3 font-medium whitespace-nowrap">
                      {t(locale, column)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((cells) => (
                  <tr key={cells.join("|")} className="border-b border-line last:border-b-0">
                    {cells.map((cell, index) => (
                      <td
                        key={`${cells[0]}-${index}`}
                        className={clsx("px-3 py-3 align-top", index === 0 ? "font-medium" : "font-mono whitespace-nowrap")}
                      >
                        {t(locale, cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {!reference ? (
        <section aria-live="polite" className="overflow-hidden rounded-lg bg-ink text-paper">
          <div className="flex items-center justify-between gap-3 border-b border-ink-soft px-4 py-3">
            <h3 className="font-mono text-xs tracking-widest text-ink-soft uppercase">{t(locale, "Tulos")}</h3>
            {result.status === "ok" ? (
              <button
                type="button"
                onClick={onCopy}
                className="flex h-11 items-center gap-2 rounded-md border border-ink-soft px-3 text-sm text-paper"
              >
                {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                {copied ? t(locale, "Kopioitu") : t(locale, "Kopioi")}
              </button>
            ) : null}
          </div>
          {result.status === "ok" ? (
            <ul className="px-4">
              {result.rows.map((line) => (
                <li key={line.id} className="flex items-start justify-between gap-4 border-b border-ink-soft py-3 last:border-b-0">
                  <span className="w-2/5 shrink-0 text-sm text-ink-soft">{t(locale, line.label)}</span>
                  <span
                    className={clsx(
                      "min-w-0 text-right font-mono break-all tabular-nums",
                      line.emphasis ? "text-lg font-medium text-paper" : "text-sm text-paper",
                    )}
                  >
                    {t(locale, line.value)}
                    {line.unit ? <span className="text-ink-soft"> {t(locale, line.unit)}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          ) : result.status === "error" ? (
            <p className="px-4 py-5 text-sm text-accent-soft">{t(locale, result.message)}</p>
          ) : (
            <p className="px-4 py-5 text-sm text-ink-soft">{t(locale, "Täytä kentät, niin tulos lasketaan.")}</p>
          )}
        </section>
      ) : null}

      {formula.note ? <p className="text-sm text-pretty text-muted">{t(locale, formula.note)}</p> : null}
    </article>
  );
}
