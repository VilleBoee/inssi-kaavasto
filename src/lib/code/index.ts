import type { Locale } from "@/lib/i18n";
import { c } from "./c";
import { cpp } from "./cpp";
import { java } from "./java";
import { javascript } from "./javascript";
import { python } from "./python";
import { sql } from "./sql";
import { TOPICS, type Copy, type Language, type Lesson, type TopicId } from "./types";

export type { Copy, Language, Lesson, TopicId } from "./types";
export { TOPICS };

export const LANGUAGES: Language[] = [javascript, python, cpp, java, c, sql];

const BY_ID = new Map(LANGUAGES.map((language) => [language.id, language]));

export function getLanguage(id: string): Language | undefined {
  return BY_ID.get(id);
}

export function lessonKey(languageId: string, lessonId: string): string {
  return `${languageId}/${lessonId}`;
}

export function getLesson(key: string): { language: Language; lesson: Lesson } | undefined {
  const slash = key.indexOf("/");
  if (slash <= 0) return undefined;
  const language = getLanguage(key.slice(0, slash));
  const lesson = language?.lessons.find((item) => item.id === key.slice(slash + 1));
  if (!language || !lesson) return undefined;
  return { language, lesson };
}

export function isTopicId(value: string): value is TopicId {
  return Object.prototype.hasOwnProperty.call(TOPICS, value);
}

export function topicLabel(topic: Lesson["topic"], locale: Locale): string {
  return TOPICS[topic][locale];
}

export function tx(locale: Locale, copy: Copy): string {
  return copy[locale];
}

function fold(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function lessonHaystack(language: Language, lesson: Lesson): string {
  return fold(
    [
      language.name,
      language.short,
      lesson.title.fi,
      lesson.title.en,
      lesson.blurb.fi,
      lesson.blurb.en,
      TOPICS[lesson.topic].fi,
      TOPICS[lesson.topic].en,
      ...lesson.points.flatMap((point) => [point.fi, point.en]),
      lesson.note?.fi ?? "",
      lesson.note?.en ?? "",
      lesson.theory?.fi ?? "",
      lesson.theory?.en ?? "",
      lesson.code,
      lesson.tags.join(" "),
    ].join(" "),
  );
}

export function lessonCount(): number {
  return LANGUAGES.reduce((sum, language) => sum + language.lessons.length, 0);
}
