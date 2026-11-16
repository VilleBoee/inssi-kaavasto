export type Copy = { fi: string; en: string };

export type TopicId =
  | "perusteet"
  | "ohjaus"
  | "tieto"
  | "rakenne"
  | "asettelu"
  | "selain"
  | "komponentit"
  | "hookit"
  | "kysely"
  | "skeema";

export const TOPICS: Record<TopicId, Copy> = {
  perusteet: { fi: "Perusteet", en: "Basics" },
  ohjaus: { fi: "Ohjaus", en: "Control flow" },
  tieto: { fi: "Tieto", en: "Data" },
  rakenne: { fi: "Rakenne", en: "Structure" },
  asettelu: { fi: "Asettelu", en: "Layout" },
  selain: { fi: "Selain", en: "Browser" },
  komponentit: { fi: "Komponentit", en: "Components" },
  hookit: { fi: "Hookit", en: "Hooks" },
  kysely: { fi: "Kyselyt", en: "Queries" },
  skeema: { fi: "Skeema", en: "Schema" },
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
  /** Longer reading. Paragraphs separated by a blank line. Markup: **bold**, *italic*, §code§, [[term]], [[label|formula-id]] and a paragraph starting with ">> ". */
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
