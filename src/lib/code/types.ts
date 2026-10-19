export type Copy = { fi: string; en: string };

export type TopicId = "perusteet" | "ohjaus" | "tieto" | "rakenne";

export const TOPICS: Record<TopicId, Copy> = {
  perusteet: { fi: "Perusteet", en: "Basics" },
  ohjaus: { fi: "Ohjaus", en: "Control flow" },
  tieto: { fi: "Tieto", en: "Data" },
  rakenne: { fi: "Rakenne", en: "Structure" },
};

export type Lesson = {
  id: string;
  topic: TopicId;
  title: Copy;
  blurb: Copy;
  points: Copy[];
  file: string;
  code: string;
  output?: string;
  note?: Copy;
  /** Longer reading. Paragraphs separated by a blank line. Markup: **bold**, *italic*, `code`, [[term]], and a paragraph starting with ">> ". */
  theory?: Copy;
  tags: string[];
};

export type Language = {
  id: string;
  name: string;
  short: string;
  blurb: Copy;
  run: Copy;
  /** Browser can execute the sample. Only JavaScript. */
  runnable: boolean;
  lessons: Lesson[];
};
