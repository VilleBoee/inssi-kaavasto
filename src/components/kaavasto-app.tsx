import { useContext, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Atom,
  BookOpen,
  Check,
  Code2,
  Copy,
  Cpu,
  Network,
  RotateCcw,
  Ruler,
  Search,
  Sigma,
  SquarePen,
  Star,
  Sun,
  Moon,
  Zap,
} from "lucide-react";
import { clsx } from "clsx";
import { BiLogoCPlusPlus } from "react-icons/bi";
import { RiJavaLine, RiJavascriptLine } from "react-icons/ri";
import { SiC } from "react-icons/si";
import { TbBrandPython, TbSql } from "react-icons/tb";
import type { IconType } from "react-icons";
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
import { LANGUAGES, TOPICS, getLesson, isTopicId, lessonCount, type TopicId } from "@/lib/code";
import { SUBCATEGORIES, setLocale, subcategoryLabel, t, type Locale } from "@/lib/i18n";
import { LocaleContext } from "@/components/locale-context";
import {
  languageLessonCount,
  ProgrammingLesson,
  ProgrammingLibrary,
  programmingCount,
} from "@/components/ohjelmointi";
import { WorkspacePanel } from "@/components/workspace-panel";
import { createId, emptyFile, loadWorkspaces, saveWorkspaces, type WorkspaceFile } from "@/lib/workspace";

type FilterId = "kaikki" | "suosikit" | CategoryId;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "kaikki", label: "Kaikki" },
  { id: "suosikit", label: "Suosikit" },
  ...CATEGORIES,
];

type SectionId = "kaavasto" | "ohjelmointi";

function pathOf(): string {
  return window.location.pathname + window.location.search;
}

function languageTopics(lang: string, locale: Locale): { id: TopicId; label: string; count: number }[] {
  const language = LANGUAGES.find((item) => item.id === lang);
  if (!language) return [];
  return (Object.keys(TOPICS) as TopicId[])
    .map((id) => ({
      id,
      label: TOPICS[id][locale],
      count: language.lessons.filter((lesson) => lesson.topic === id).length,
    }))
    .filter((item) => item.count > 0);
}

function categorySubs(category: string): { id: string; count: number }[] {
  return SUBCATEGORIES.filter((item) => item.category === category)
    .map((item) => ({
      id: item.id,
      count: FORMULAS.filter((formula) => formula.subcategory === item.id).length,
    }))
    .filter((item) => item.count > 0);
}

function progListHash(lang: string, topic: string | null): string {
  if (!lang || lang === "kaikki") return "#prog";
  return topic ? `#prog/${lang}/${topic}` : `#prog/${lang}`;
}

function readLocation(): {
  section: SectionId;
  formulaId: string | null;
  lang: string;
  topic: string | null;
  lesson: string | null;
} {
  const raw = window.location.hash.replace(/^#/, "");
  if (raw === "prog" || raw.startsWith("prog/")) {
    const rest = raw.startsWith("prog/") ? raw.slice("prog/".length) : "";
    const [lang, lessonId] = rest.split("/");
    const languageOk = Boolean(lang && LANGUAGES.some((item) => item.id === lang));
    const topic = languageOk && lessonId && isTopicId(lessonId) ? lessonId : null;
    const key = languageOk && lessonId && !topic ? `${lang}/${lessonId}` : null;
    return {
      section: "ohjelmointi",
      formulaId: null,
      lang: languageOk ? lang : "kaikki",
      topic,
      lesson: key && getLesson(key) ? key : null,
    };
  }
  return {
    section: "kaavasto",
    formulaId: getFormula(raw) ? raw : null,
    lang: "kaikki",
    topic: null,
    lesson: null,
  };
}

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

function LanguageGlyph({ id }: { id: string }) {
  const icons: Record<string, IconType> = {
    js: RiJavascriptLine,
    python: TbBrandPython,
    cpp: BiLogoCPlusPlus,
    java: RiJavaLine,
    c: SiC,
    sql: TbSql,
  };
  const Icon = icons[id];
  if (!Icon) return <BookOpen className="size-4 shrink-0" aria-hidden="true" />;
  return <Icon className="size-4 shrink-0" aria-hidden="true" />;
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
  const initial = typeof window === "undefined" ? null : readLocation();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("kaikki");
  const [section, setSection] = useState<SectionId>(initial?.section ?? "kaavasto");
  const [progLang, setProgLang] = useState(initial?.lang ?? "kaikki");
  const [progTopic, setProgTopic] = useState<string | null>(initial?.topic ?? null);
  const [progLesson, setProgLesson] = useState<string | null>(initial?.lesson ?? null);
  const [subFilter, setSubFilter] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(initial?.formulaId ?? null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({});
  const [copied, setCopied] = useState(false);
  const [locale, setUiLocale] = useState<Locale>("fi");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("kaavasto:theme");
    const next = stored === "dark" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", next === "dark");
    return next;
  });
  const [wsFile, setWsFile] = useState<WorkspaceFile>(() => loadWorkspaces());
  const [wsOpen, setWsOpen] = useState(false);
  const [catalogHidden, setCatalogHidden] = useState(false);
  const [clearAsk, setClearAsk] = useState(false);
  const [wsReady, setWsReady] = useState(false);
  setLocale(locale);

  useEffect(() => {
    setFavorites(loadList("kaavasto:favorites"));
    setRecent(loadList("kaavasto:recent"));
    const stored = localStorage.getItem("kaavasto:locale");
    if (stored === "en" || stored === "fi") setUiLocale(stored);
    const loc = readLocation();
    setSection(loc.section);
    setProgLang(loc.lang);
    setProgTopic(loc.topic);
    setProgLesson(loc.lesson);
    setActiveId(loc.formulaId);
    setReady(true);
    setWsFile(loadWorkspaces());
    setWsReady(true);
    function onHash() {
      const next = readLocation();
      setSection(next.section);
      setProgLang(next.lang);
      setProgTopic(next.topic);
      setProgLesson(next.lesson);
      setActiveId(next.formulaId);
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
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
    if (!wsReady) return;
    saveWorkspaces(wsFile);
  }, [wsFile, wsReady]);

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
          window.history.replaceState(null, "", pathOf());
        } else if (progLesson) {
          setProgLesson(null);
          window.history.replaceState(null, "", `${pathOf()}${progListHash(progLang, progTopic)}`);
        } else if (!typing) {
          setQuery("");
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, progLesson, progLang, progTopic]);

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
      if (subFilter && formula.subcategory !== subFilter) return false;
      if (words.length === 0) return true;
      const hay = formulaHaystack(formula);
      return words.every((word) => hay.includes(word));
    });
  }, [query, filter, subFilter, favorites]);

  const formula = activeId ? getFormula(activeId) : undefined;

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("kaavasto:locale", locale);
    document.documentElement.lang = locale;
  }, [locale, ready]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (!ready) return;
    localStorage.setItem("kaavasto:theme", theme);
  }, [theme, ready]);

  function clearStorage() {
    localStorage.clear();
    setFavorites([]);
    setRecent([]);
    setDrafts({});
    setUiLocale("fi");
    setTheme("light");
    setWsFile(emptyFile());
  }

  function addWorkspaceBlock(block: WorkspaceFile["workspaces"][number]["blocks"][number]) {
    setWsFile((current) => ({
      ...current,
      workspaces: current.workspaces.map((item) => (item.id === current.activeId ? { ...item, blocks: [...item.blocks, block] } : item)),
    }));
    if (window.matchMedia("(min-width: 1024px)").matches) setWsOpen(true);
    window.setTimeout(() => document.getElementById(`ws-block-${block.id}`)?.scrollIntoView({ block: "nearest" }), 40);
  }

  function addFormulaToWorkspace(id: string) {
    const picked = getFormula(id);
    if (!picked) return;
    const values = { ...picked.seed };
    for (const field of picked.fields(values)) {
      if (field.kind !== "select") values[field.id] = "";
    }
    addWorkspaceBlock({ id: createId(), kind: "formula", formulaId: id, values, exports: [] });
  }

  function openFormulaWith(id: string, values: Record<string, string> | null) {
    if (!getFormula(id)) return;
    if (values) setDrafts((prev) => ({ ...prev, [id]: { ...values } }));
    setSection("kaavasto");
    setActiveId(id);
    setCopied(false);
    setRecent((prev) => [id, ...prev.filter((item) => item !== id)].slice(0, 8));
    window.history.replaceState(null, "", `${pathOf()}#${id}`);
    if (window.matchMedia("(max-width: 1023px)").matches) setWsOpen(false);
    window.scrollTo(0, 0);
  }

  function openFormula(id: string) {
    openFormulaWith(id, null);
  }

  function closeFormula() {
    setActiveId(null);
    window.history.replaceState(null, "", pathOf());
  }

  function showSection(next: SectionId) {
    setSection(next);
    setQuery("");
    if (next === "kaavasto") {
      setActiveId(null);
      window.history.replaceState(null, "", pathOf());
    } else {
      setProgLang("kaikki");
      setProgTopic(null);
      setProgLesson(null);
      window.history.replaceState(null, "", `${pathOf()}#prog`);
    }
    window.scrollTo(0, 0);
  }

  function selectFilter(id: FilterId) {
    setFilter(id);
    setSubFilter(null);
  }

  function selectSubFilter(id: string) {
    setSubFilter((current) => (current === id ? null : id));
  }

  function selectProgLang(id: string) {
    setProgLang(id);
    setProgTopic(null);
    setProgLesson(null);
    window.history.replaceState(null, "", `${pathOf()}${progListHash(id, null)}`);
  }

  function selectProgTopic(id: string) {
    const next = progTopic === id ? null : id;
    setProgTopic(next);
    setProgLesson(null);
    window.history.replaceState(null, "", `${pathOf()}${progListHash(progLang, next)}`);
    window.scrollTo(0, 0);
  }

  function openLesson(key: string) {
    if (!getLesson(key)) return;
    const lang = key.slice(0, key.indexOf("/"));
    setSection("ohjelmointi");
    setProgLang(lang);
    setProgLesson(key);
    window.history.replaceState(null, "", `${pathOf()}#prog/${key}`);
    window.scrollTo(0, 0);
  }

  function closeLesson() {
    setProgLesson(null);
    window.history.replaceState(null, "", `${pathOf()}${progListHash(progLang, progTopic)}`);
    window.scrollTo(0, 0);
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

  const programming = section === "ohjelmointi";
  const showWorkspace = wsOpen && !programming;
  const hideCatalog = showWorkspace && catalogHidden;
  const progVisible = programmingCount(progLang, query, progTopic);
  const countLabel = programming
    ? progVisible === lessonCount()
      ? locale === "fi"
        ? `${lessonCount()} esimerkkiä`
        : `${lessonCount()} examples`
      : `${progVisible} / ${lessonCount()}`
    : visible.length === FORMULAS.length
      ? locale === "fi"
        ? `${FORMULAS.length} kaavaa`
        : `${FORMULAS.length} formulas`
      : `${visible.length} / ${FORMULAS.length}`;

  return (
    <LocaleContext.Provider value={locale}>
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-paper">
        <div className={clsx("mx-auto flex flex-col gap-4 px-4 py-4 lg:px-8", showWorkspace ? "max-w-screen-2xl" : "max-w-6xl")}>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-md bg-ink font-mono text-xl text-paper">ƒ</span>
              <div className="min-w-0">
                <p className="font-mono text-xs tracking-widest text-accent uppercase">
                  {programming ? t(locale, "Ohjelmoinnin esimerkit") : t(locale, "Insinöörin kaavakirja")}
                </p>
                <h1 className="flex flex-wrap items-baseline gap-x-2 text-2xl leading-tight font-semibold">
                  Kaavasto
                  <UpdatedStamp locale={locale} />
                </h1>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-3">
              <p className="font-mono text-sm text-muted tabular-nums">{countLabel}</p>
              {programming ? null : (
              <button
                type="button"
                aria-pressed={wsOpen}
                onClick={() => setWsOpen((open) => !open)}
                className={clsx(
                  "flex h-11 items-center gap-2 rounded-md border px-3 text-sm font-medium",
                  wsOpen ? "border-ink bg-ink text-paper" : "border-line bg-bg text-ink",
                )}
              >
                <SquarePen className="size-4" aria-hidden="true" />
                {t(locale, "Oma työtila")}
              </button>
              )}
              <button
                type="button"
                onClick={() => setClearAsk(true)}
                className="flex h-11 items-center rounded-md border border-line bg-bg px-3 text-sm font-medium text-ink"
              >
                {t(locale, "Tyhjennä tallennus")}
              </button>
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
              <div className="flex rounded-md border border-line bg-bg p-0.5" role="group" aria-label={t(locale, "Teema")}>
                <button
                  type="button"
                  aria-pressed={theme === "light"}
                  aria-label={t(locale, "Vaalea")}
                  onClick={() => setTheme("light")}
                  className={clsx("grid h-11 w-11 place-items-center rounded", theme === "light" ? "bg-ink text-paper" : "text-muted")}
                >
                  <Sun className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-pressed={theme === "dark"}
                  aria-label={t(locale, "Tumma")}
                  onClick={() => setTheme("dark")}
                  className={clsx("grid h-11 w-11 place-items-center rounded", theme === "dark" ? "bg-ink text-paper" : "text-muted")}
                >
                  <Moon className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2" role="tablist" aria-label={t(locale, "Osio")}>
            <button
              type="button"
              role="tab"
              aria-selected={!programming}
              onClick={() => showSection("kaavasto")}
              className={clsx(
                "flex h-11 items-center justify-center gap-2 rounded-md border text-sm font-medium",
                !programming ? "border-ink bg-ink text-paper" : "border-line bg-bg text-ink",
              )}
            >
              <BookOpen className="size-4" aria-hidden="true" />
              {t(locale, "Kaavasto")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={programming}
              onClick={() => showSection("ohjelmointi")}
              className={clsx(
                "flex h-11 items-center justify-center gap-2 rounded-md border text-sm font-medium",
                programming ? "border-ink bg-ink text-paper" : "border-line bg-bg text-ink",
              )}
            >
              <Code2 className="size-4" aria-hidden="true" />
              {t(locale, "Ohjelmointi")}
            </button>
          </div>
          <label className="relative block">
            <span className="sr-only">{programming ? t(locale, "Hae esimerkkejä") : t(locale, "Hae kaavoja")}</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="kaavasto-search"
              className="h-12 w-full rounded-md border border-line bg-bg pr-4 pl-11 text-base text-ink outline-none"
              placeholder={
                programming
                  ? t(locale, "Hae: silmukka, lista, osoitin…")
                  : t(locale, "Hae: newton, tsiolkovski, aliverkko, epävarmuus…")
              }
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (activeId) closeFormula();
                if (progLesson) {
                  setProgLesson(null);
                  window.history.replaceState(
                    null,
                    "",
                    `${pathOf()}${progListHash(progLang, progTopic)}`,
                  );
                }
              }}
            />
          </label>
        </div>
      </header>
      {clearAsk ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 px-4" role="dialog" aria-modal="true" aria-labelledby="clear-storage-title">
          <div className="w-full max-w-sm rounded-lg border border-line bg-paper p-5 shadow-sm">
            <h2 id="clear-storage-title" className="text-lg font-semibold">{t(locale, "Haluatko poistaa tallennetut tiedot?")}</h2>
            <p className="mt-2 text-sm text-pretty text-muted">{t(locale, "Suosikit, kieli ja työtilat poistuvat tästä selaimesta.")}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setClearAsk(false)} className="h-11 rounded-md border border-line bg-bg px-3 text-sm">
                {t(locale, "Peruuta")}
              </button>
              <button
                type="button"
                onClick={() => {
                  clearStorage();
                  setClearAsk(false);
                }}
                className="h-11 rounded-md bg-ink px-3 text-sm font-medium text-paper"
              >
                {t(locale, "Poista")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className={clsx("mx-auto flex flex-col gap-6 px-4 py-6 lg:flex-row lg:px-8", showWorkspace ? "max-w-screen-2xl" : "max-w-6xl")}>
        <nav className={clsx("hidden w-60 shrink-0 lg:block", hideCatalog && "lg:hidden")} aria-label={programming ? t(locale, "Kielet") : t(locale, "Aihealueet")}>
          <ul className="sticky top-60 flex max-h-[calc(100dvh-16rem)] flex-col gap-1 overflow-y-auto">
            {programming
              ? [{ id: "kaikki", label: "Kaikki", short: "", count: lessonCount() }, ...LANGUAGES.map((language) => ({
                  id: language.id,
                  label: language.name,
                  short: language.short,
                  count: languageLessonCount(language.id),
                }))].map((item) => {
                  const selected = progLang === item.id;
                  const topics = selected && item.id !== "kaikki" ? languageTopics(item.id, locale) : [];
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        aria-pressed={selected}
                        onClick={() => selectProgLang(item.id)}
                        className={clsx(
                          "flex h-11 w-full items-center gap-2 rounded-md px-3 text-left text-sm transition-colors duration-200",
                          selected ? "bg-ink text-paper" : "text-ink hover:bg-paper",
                        )}
                      >
                        {item.id === "kaikki" ? (
                          <BookOpen className={clsx("size-4 shrink-0", selected ? "text-ink-soft" : "text-muted")} aria-hidden="true" />
                        ) : (
                          <LanguageGlyph id={item.id} />
                        )}
                        <span className="flex-1">{item.id === "kaikki" ? t(locale, item.label) : item.label}</span>
                        <span className={clsx("font-mono text-xs tabular-nums", selected ? "text-ink-soft" : "text-muted")}>{item.count}</span>
                      </button>
                      {topics.length > 0 ? (
                        <ul className="mt-1 mb-2 ml-5 flex flex-col gap-0.5 border-l border-line pl-2">
                          {topics.map((topic) => {
                            const topicOn = progTopic === topic.id;
                            return (
                              <li key={topic.id}>
                                <button
                                  type="button"
                                  aria-pressed={topicOn}
                                  onClick={() => selectProgTopic(topic.id)}
                                  className={clsx(
                                    "flex h-10 w-full items-center gap-2 rounded-md px-2 text-left text-sm",
                                    topicOn ? "bg-accent-soft font-medium text-ink" : "text-muted hover:bg-paper hover:text-ink",
                                  )}
                                >
                                  <span className="flex-1">{topic.label}</span>
                                  <span className="font-mono text-xs tabular-nums">{topic.count}</span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </li>
                  );
                })
              : FILTERS.map((item) => {
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
                        onClick={() => selectFilter(item.id)}
                        className={clsx(
                          "flex h-11 w-full items-center gap-2 rounded-md px-3 text-left text-sm transition-colors duration-200",
                          selected ? "bg-ink text-paper" : "text-ink hover:bg-paper",
                        )}
                      >
                        <CategoryGlyph id={item.id} />
                        <span className="flex-1">{t(locale, item.label)}</span>
                        <span className={clsx("font-mono text-xs tabular-nums", selected ? "text-ink-soft" : "text-muted")}>{count}</span>
                      </button>
                      {selected && item.id !== "kaikki" && item.id !== "suosikit" ? (
                        <ul className="mt-1 mb-2 ml-5 flex flex-col gap-0.5 border-l border-line pl-2">
                          {categorySubs(item.id).map((sub) => {
                            const subOn = subFilter === sub.id;
                            return (
                              <li key={sub.id}>
                                <button
                                  type="button"
                                  aria-pressed={subOn}
                                  onClick={() => selectSubFilter(sub.id)}
                                  className={clsx(
                                    "flex h-10 w-full items-center gap-2 rounded-md px-2 text-left text-sm",
                                    subOn ? "bg-accent-soft font-medium text-ink" : "text-muted hover:bg-paper hover:text-ink",
                                  )}
                                >
                                  <span className="flex-1">{subcategoryLabel(sub.id, locale)}</span>
                                  <span className="font-mono text-xs tabular-nums">{sub.count}</span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
          </ul>
        </nav>

        <main className={clsx("min-w-0 flex-1", showWorkspace && "hidden w-full lg:block lg:w-96 lg:flex-none", hideCatalog && "lg:hidden")}>
          <div className="mb-4 flex flex-col gap-2 lg:hidden">
            <div className="flex gap-2 overflow-x-auto" aria-label={programming ? t(locale, "Kielet") : t(locale, "Aihealueet")}>
              {programming
                ? [{ id: "kaikki", label: "Kaikki" }, ...LANGUAGES.map((language) => ({ id: language.id, label: language.name }))].map((item) => {
                    const selected = progLang === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => selectProgLang(item.id)}
                        className={clsx(
                          "flex h-11 shrink-0 items-center gap-2 rounded-md border px-3 text-sm",
                          selected ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink",
                        )}
                      >
                        {item.id === "kaikki" ? t(locale, item.label) : (
                          <>
                            <LanguageGlyph id={item.id} />
                            {item.label}
                          </>
                        )}
                      </button>
                    );
                  })
                : FILTERS.map((item) => {
                    const selected = filter === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => selectFilter(item.id)}
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
            {programming && progLang !== "kaikki" ? (
              <div className="flex gap-2 overflow-x-auto" aria-label={t(locale, "Osio")}>
                {languageTopics(progLang, locale).map((topic) => {
                  const topicOn = progTopic === topic.id;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      aria-pressed={topicOn}
                      onClick={() => selectProgTopic(topic.id)}
                      className={clsx(
                        "flex h-11 shrink-0 items-center gap-2 rounded-md border px-3 text-sm",
                        topicOn ? "border-accent bg-accent-soft text-ink" : "border-line bg-paper text-ink",
                      )}
                    >
                      {topic.label}
                      <span className="font-mono text-xs text-muted tabular-nums">{topic.count}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
            {!programming && filter !== "kaikki" && filter !== "suosikit" ? (
              <div className="flex gap-2 overflow-x-auto" aria-label={t(locale, "Osio")}>
                {categorySubs(filter).map((sub) => {
                  const subOn = subFilter === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      aria-pressed={subOn}
                      onClick={() => selectSubFilter(sub.id)}
                      className={clsx(
                        "flex h-11 shrink-0 items-center gap-2 rounded-md border px-3 text-sm",
                        subOn ? "border-accent bg-accent-soft text-ink" : "border-line bg-paper text-ink",
                      )}
                    >
                      {subcategoryLabel(sub.id, locale)}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {programming ? (
            progLesson ? (
              <ProgrammingLesson lessonKey={progLesson} onBack={closeLesson} onOpen={openLesson} />
            ) : (
              <ProgrammingLibrary query={query} langId={progLang} topicId={progTopic} onOpen={openLesson} />
            )
          ) : formula ? (
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
              onAddReference={() =>
                addWorkspaceBlock({ id: createId(), kind: "reference", formulaId: formula.id })
              }
              onSaveCalculation={() =>
                addWorkspaceBlock({
                  id: createId(),
                  kind: "formula",
                  formulaId: formula.id,
                  values: { ...valuesOf(formula) },
                  exports: [],
                })
              }
              values={valuesOf(formula)}
            />
          ) : (
            <Library
              formulas={visible}
              favorites={favorites}
              recent={recent}
              showRecent={query.trim() === "" && filter === "kaikki"}
              onOpen={(id) => (wsOpen ? addFormulaToWorkspace(id) : openFormula(id))}
              onToggleFavorite={toggleFavorite}
              onClear={() => setQuery("")}
              query={query}
              compact={wsOpen}
            />
          )}
        </main>
        {showWorkspace ? (
          <WorkspacePanel
            file={wsFile}
            onFile={setWsFile}
            onClose={() => setWsOpen(false)}
            onOpenFormula={openFormulaWith}
            catalogHidden={hideCatalog}
            onToggleCatalog={() => setCatalogHidden((hidden) => !hidden)}
          />
        ) : null}
      </div>

      <footer className={clsx("mx-auto mt-auto w-full px-4 pt-6 pb-14 text-sm text-muted lg:px-8", showWorkspace ? "max-w-screen-2xl" : "max-w-6xl")}>
        {programming
          ? t(locale, "Esimerkit ovat tiiviitä muistilistoja. Kielen oma dokumentaatio on virallinen lähde. Haku avautuu näppäimellä /.")
          : t(locale, "Laskurit ovat tarkastus- ja opiskelukäyttöön. Kriittinen mitoitus tarkistetaan alkuperäislähteestä. Haku avautuu näppäimellä /.")}
      </footer>
      <UpdateLog locale={locale} />
    </div>
    </LocaleContext.Provider>
  );
}

const UPDATES: { fi: string; en: string }[] = [
  { fi: "Yhtälö näyttää välivaiheet.", en: "Equations show the working." },
  { fi: "Otsikon vieressä näkyy, milloin sivua on muokattu.", en: "The title shows when the page was updated." },
  { fi: "Tumma teema. Ohjelmoinnin koodi pysyy tummana.", en: "Dark theme. Programming code stays dark." },
  { fi: "Tallennuksen voi tyhjentää yläpalkista.", en: "Saved data can be cleared from the header." },
  { fi: "Työtilan voi viedä ja tuoda.", en: "A workspace can be exported and imported." },
  { fi: "Oma työtila laskuille, muistiinpanoille ja kaavoille.", en: "A workspace for calculations, notes and formulas." },
];

function UpdateLog({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const title = locale === "fi" ? "Päivitykset" : "Updates";
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <div className="fixed bottom-3 left-3 z-30">
      {open ? (
        <section className="mb-2 w-72 max-w-[calc(100vw-1.5rem)] rounded-lg border border-line bg-paper p-3 text-xs leading-relaxed text-muted shadow-sm" aria-label={title}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-mono text-[10px] tracking-widest uppercase">{title}</h2>
            <button type="button" onClick={() => setOpen(false)} className="grid size-7 place-items-center rounded-md text-sm" aria-label={locale === "fi" ? "Sulje" : "Close"}>
              ×
            </button>
          </div>
          <ol className="mt-2 flex max-h-60 flex-col gap-1 overflow-y-auto">
            {UPDATES.map((item) => (
              <li key={item.fi}>{locale === "en" ? item.en : item.fi}</li>
            ))}
          </ol>
        </section>
      ) : null}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="h-8 rounded-md border border-line bg-paper px-2 font-mono text-[10px] tracking-widest text-muted uppercase"
      >
        {title}
      </button>
    </div>
  );
}

function UpdatedStamp({ locale }: { locale: Locale }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);
  return <span className="text-xs font-normal text-muted">{updatedAgo(locale, __APP_UPDATED__, now)}</span>;
}

function updatedAgo(locale: Locale, iso: string, now: number): string {
  const then = Date.parse(iso);
  const minutes = Number.isFinite(then) ? Math.max(0, Math.floor((now - then) / 60000)) : 0;
  if (locale === "en") {
    if (minutes < 1) return "Updated just now";
    if (minutes < 60) return `Updated ${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours === 1 ? "Updated 1 hour ago" : `Updated ${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return days === 1 ? "Updated 1 day ago" : `Updated ${days} days ago`;
    const months = Math.floor(days / 30);
    return months === 1 ? "Updated 1 month ago" : `Updated ${months} months ago`;
  }
  if (minutes < 1) return "Muokattu juuri nyt";
  if (minutes < 60) return `Muokattu ${minutes} min sitten`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Muokattu ${hours} h sitten`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `Muokattu ${days} pv sitten`;
  const months = Math.floor(days / 30);
  return `Muokattu ${months} kk sitten`;
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
  compact,
}: {
  formulas: Formula[];
  favorites: string[];
  recent: string[];
  showRecent: boolean;
  onOpen: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onClear: () => void;
  query: string;
  compact?: boolean;
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
        <ul className={clsx("grid gap-3", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
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
  onAddReference,
  onSaveCalculation,
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
  onAddReference: () => void;
  onSaveCalculation: () => void;
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
        <button type="button" onClick={onAddReference} className="h-11 self-start rounded-md border border-line bg-paper px-3 text-sm">
          {t(locale, "Lisää omaan työtilaan")}
        </button>
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
              <div className="flex flex-wrap justify-end gap-2">
                <button type="button" onClick={onSaveCalculation} className="flex h-11 items-center gap-2 rounded-md bg-accent px-3 text-sm font-medium text-accent-ink">
                  {t(locale, "Tallenna työtilaan")}
                </button>
                <button
                  type="button"
                  onClick={onCopy}
                  className="flex h-11 items-center gap-2 rounded-md border border-ink-soft px-3 text-sm text-paper"
                >
                  {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                  {copied ? t(locale, "Kopioitu") : t(locale, "Kopioi")}
                </button>
              </div>
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
