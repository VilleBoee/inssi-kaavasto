import { useContext, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Copy, Play, RotateCcw } from "lucide-react";
import { clsx } from "clsx";
import {
  LANGUAGES,
  getLesson,
  lessonHaystack,
  lessonKey,
  topicLabel,
  tx,
  type Language,
  type Lesson,
} from "@/lib/code";
import { t, type Locale } from "@/lib/i18n";
import { LocaleContext } from "@/components/locale-context";
import { RichText } from "@/components/rich-text";

function fold(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function runJavaScript(code: string, timeoutLabel: string): Promise<string> {
  return new Promise((resolve) => {
    const source = `
      const logs = [];
      function format(value) {
        if (typeof value === "string") return value;
        if (typeof value === "undefined") return "undefined";
        if (typeof value === "number" && Number.isNaN(value)) return "NaN";
        if (value === null) return "null";
        try { return JSON.stringify(value); } catch (error) { return String(value); }
      }
      const console = { log: (...args) => logs.push(args.map(format).join(" ")) };
      const finish = () => postMessage({ text: logs.join("\\n") });
      try {
        const fn = new Function("console", "return (async () => {\\n" + ${JSON.stringify(code)} + "\\n})();");
        Promise.resolve(fn(console)).then(finish).catch((error) => {
          logs.push("Error: " + (error && error.message ? error.message : String(error)));
          finish();
        });
      } catch (error) {
        logs.push("Error: " + (error && error.message ? error.message : String(error)));
        finish();
      }
    `;
    const url = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
    const worker = new Worker(url);
    const timer = window.setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(timeoutLabel);
    }, 1000);
    worker.onmessage = (event: MessageEvent<{ text?: string }>) => {
      window.clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(event.data?.text ?? "");
    };
    worker.onerror = () => {
      window.clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve("Error");
    };
  });
}

export function ProgrammingLibrary({
  query,
  langId,
  topicId,
  onOpen,
}: {
  query: string;
  langId: string;
  topicId: string | null;
  onOpen: (key: string) => void;
}) {
  const locale = useContext(LocaleContext);
  const words = useMemo(
    () => fold(query.trim()).split(/\s+/).filter(Boolean),
    [query],
  );

  const groups = useMemo(() => {
    const rows: { key: string; language: Language; topic: string; items: Lesson[] }[] = [];
    const index = new Map<string, (typeof rows)[number]>();
    for (const language of LANGUAGES) {
      if (langId !== "kaikki" && language.id !== langId) continue;
      for (const lesson of language.lessons) {
        if (words.length > 0 && !words.every((word) => lessonHaystack(language, lesson).includes(word))) continue;
        if (topicId && lesson.topic !== topicId) continue;
        const key = `${language.id}:${lesson.topic}`;
        let group = index.get(key);
        if (!group) {
          group = { key, language, topic: topicLabel(lesson.topic, locale), items: [] };
          index.set(key, group);
          rows.push(group);
        }
        group.items.push(lesson);
      }
    }
    return rows;
  }, [langId, locale, topicId, words]);

  if (groups.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-paper px-6 py-14 text-center">
        <p className="text-lg font-semibold">{t(locale, "Ei esimerkkejä")}</p>
        <p className="mt-2 text-pretty text-muted">{t(locale, "Haulla ei löytynyt esimerkkejä.")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <section key={group.key}>
          <h2 className="mb-3 text-sm font-medium">
            <span className="text-muted">{group.language.name}</span>
            <span className="px-2 text-accent" aria-hidden="true">
              •
            </span>
            {group.topic}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {group.items.map((lesson) => (
              <li key={lesson.id}>
                <button
                  type="button"
                  onClick={() => onOpen(lessonKey(group.language.id, lesson.id))}
                  className="flex h-full w-full flex-col gap-2 rounded-lg border border-line bg-paper p-4 text-left shadow-sm"
                >
                  <span className="font-mono text-xs tracking-widest text-accent uppercase">{lesson.file}</span>
                  <span className="text-lg leading-snug font-semibold">{tx(locale, lesson.title)}</span>
                  <span className="text-sm text-pretty text-muted">{tx(locale, lesson.blurb)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function ProgrammingLesson({
  lessonKey: key,
  onBack,
  onOpen,
}: {
  lessonKey: string;
  onBack: () => void;
  onOpen: (key: string) => void;
}) {
  const locale = useContext(LocaleContext);
  const found = getLesson(key);
  const [draft, setDraft] = useState(found?.lesson.code ?? "");
  const [output, setOutput] = useState(found?.lesson.output ?? "");
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const next = getLesson(key);
    setDraft(next?.lesson.code ?? "");
    setOutput(next?.lesson.output ?? "");
    setCopied(false);
    setRunning(false);
  }, [key]);

  if (!found) {
    return (
      <div className="rounded-lg border border-line bg-paper px-6 py-14 text-center">
        <p className="text-lg font-semibold">{t(locale, "Ei esimerkkejä")}</p>
        <button type="button" onClick={onBack} className="mt-5 h-11 rounded-md bg-accent px-4 text-sm font-medium text-accent-ink">
          {t(locale, "Kaikki esimerkit")}
        </button>
      </div>
    );
  }

  const { language, lesson } = found;
  const index = language.lessons.findIndex((item) => item.id === lesson.id);
  const previous = index > 0 ? language.lessons[index - 1] : undefined;
  const next = index >= 0 && index < language.lessons.length - 1 ? language.lessons[index + 1] : undefined;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  async function run() {
    setRunning(true);
    const text = await runJavaScript(draft, t(locale, "Ajo keskeytettiin sekunnin jälkeen."));
    setOutput(text);
    setRunning(false);
  }

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      <button type="button" onClick={onBack} className="flex h-11 items-center gap-2 self-start rounded-md px-2 text-sm font-medium">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {language.name}
      </button>

      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs tracking-widest text-accent uppercase">
          {language.name}
          <span className="px-2" aria-hidden="true">
            •
          </span>
          {topicLabel(lesson.topic, locale)}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight">{tx(locale, lesson.title)}</h2>
        <p className="text-pretty text-muted">{tx(locale, lesson.blurb)}</p>
      </header>

      {lesson.theory ? (
        <section className="rounded-lg border border-line bg-paper px-4 py-4">
          <h3 className="mb-3 font-mono text-xs tracking-widest text-accent uppercase">{t(locale, "Teoria")}</h3>
          <RichText text={tx(locale, lesson.theory)} />
        </section>
      ) : null}

      <section className="rounded-lg border border-line bg-paper px-4 py-3">
        <h3 className="mb-2 font-mono text-xs tracking-widest text-muted uppercase">{t(locale, "Pidä mielessä")}</h3>
        <ul className="flex flex-col gap-2 text-sm">
          {lesson.points.map((point) => (
            <li key={point.fi} className="text-pretty">
              <RichText text={tx(locale, point)} className="text-sm" />
            </li>
          ))}
        </ul>
      </section>

      <section className="code-surface overflow-hidden rounded-lg">
        <div className="code-line flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <h3 className="code-muted font-mono text-xs tracking-widest uppercase">{lesson.file}</h3>
          <div className="flex flex-wrap gap-2">
            {language.runnable ? (
              <button
                type="button"
                onClick={() => void run()}
                disabled={running}
                className="flex h-11 items-center gap-2 rounded-md bg-accent px-3 text-sm font-medium text-accent-ink disabled:opacity-60"
              >
                <Play className="size-4" aria-hidden="true" />
                {running ? t(locale, "Ajetaan") : t(locale, "Suorita")}
              </button>
            ) : null}
            {language.runnable ? (
              <button
                type="button"
                onClick={() => {
                  setDraft(lesson.code);
                  setOutput(lesson.output ?? "");
                }}
                className="code-line flex h-11 items-center gap-2 rounded-md border px-3 text-sm"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                {t(locale, "Palauta esimerkki")}
              </button>
            ) : null}
            <button type="button" onClick={() => void copyCode()} className="code-line flex h-11 items-center gap-2 rounded-md border px-3 text-sm">
              {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
              {copied ? t(locale, "Kopioitu") : t(locale, "Kopioi")}
            </button>
          </div>
        </div>
        {language.runnable ? (
          <textarea
            value={draft}
            spellCheck={false}
            aria-label={tx(locale, lesson.title)}
            onChange={(event) => setDraft(event.target.value)}
            className="code-surface min-h-64 w-full resize-y px-4 py-4 font-mono text-sm leading-relaxed outline-none"
          />
        ) : (
          <pre className="overflow-x-auto px-4 py-4 font-mono text-sm leading-relaxed">
            <code>{lesson.code}</code>
          </pre>
        )}
      </section>

      {language.runnable || lesson.output ? (
        <section className="overflow-hidden rounded-lg border border-line bg-paper">
          <h3 className="border-b border-line px-4 py-3 font-mono text-xs tracking-widest text-accent uppercase">
            {language.runnable ? t(locale, "Tuloste") : t(locale, "Odotettu tuloste")}
          </h3>
          <pre className="overflow-x-auto px-4 py-4 font-mono text-sm leading-relaxed">
            <code>{output || t(locale, "Ei tulostetta")}</code>
          </pre>
        </section>
      ) : null}

      <p className="font-mono text-sm text-pretty text-muted">{tx(locale, language.run)}</p>
      {lesson.note ? <RichText text={tx(locale, lesson.note)} className="text-sm text-muted" /> : null}

      <div className="flex flex-wrap justify-between gap-2">
        {previous ? (
          <button
            type="button"
            onClick={() => onOpen(lessonKey(language.id, previous.id))}
            className="h-11 rounded-md border border-line bg-paper px-3 text-sm"
          >
            {tx(locale, previous.title)}
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button
            type="button"
            onClick={() => onOpen(lessonKey(language.id, next.id))}
            className="h-11 rounded-md bg-ink px-3 text-sm text-paper"
          >
            {tx(locale, next.title)}
          </button>
        ) : null}
      </div>
    </article>
  );
}

export function programmingCount(langId: string, query: string, topicId?: string | null): number {
  const words = fold(query.trim()).split(/\s+/).filter(Boolean);
  let count = 0;
  for (const language of LANGUAGES) {
    if (langId !== "kaikki" && language.id !== langId) continue;
    for (const lesson of language.lessons) {
      if (topicId && lesson.topic !== topicId) continue;
      if (words.length === 0 || words.every((word) => lessonHaystack(language, lesson).includes(word))) count += 1;
    }
  }
  return count;
}

export function languageLessonCount(languageId: string): number {
  return LANGUAGES.find((language) => language.id === languageId)?.lessons.length ?? 0;
}
