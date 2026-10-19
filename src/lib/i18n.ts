import { EN } from "./en";

export type Locale = "fi" | "en";

export const LOCALES: Locale[] = ["fi", "en"];

export const SUBCATEGORIES: { id: string; category: string; fi: string; en: string }[] = [
  { id: "luvut", category: "tieto", fi: "Lukujärjestelmät", en: "Number bases" },
  { id: "suoritus", category: "tieto", fi: "Suorituskyky", en: "Performance" },
  { id: "informaatio", category: "tieto", fi: "Informaatio", en: "Information" },
  { id: "osoitteet", category: "verkko", fi: "Osoitteet", en: "Addressing" },
  { id: "siirto", category: "verkko", fi: "Siirto", en: "Transmission" },
  { id: "palvelu", category: "verkko", fi: "Palvelu", en: "Service" },
  { id: "piirit", category: "elektroniikka", fi: "Piirit", en: "Circuits" },
  { id: "signaalit", category: "elektroniikka", fi: "Signaalit", en: "Signals" },
  { id: "desibeli", category: "elektroniikka", fi: "Desibelit", en: "Decibels" },
  { id: "newton", category: "fysiikka", fi: "Newton", en: "Newton" },
  { id: "energia", category: "fysiikka", fi: "Työ ja energia", en: "Work and energy" },
  { id: "vektorit", category: "fysiikka", fi: "Vektorit", en: "Vectors" },
  { id: "mittaus", category: "fysiikka", fi: "Mittaukset", en: "Measurement" },
  { id: "liikemaara", category: "fysiikka", fi: "Liikemäärä", en: "Momentum" },
  { id: "pyoriminen", category: "fysiikka", fi: "Pyöriminen", en: "Rotation" },
  { id: "lampo", category: "fysiikka", fi: "Lämpöoppi", en: "Heat" },
  { id: "kentat", category: "fysiikka", fi: "Kentät", en: "Fields" },
  { id: "raketti", category: "fysiikka", fi: "Raketti", en: "Rocket" },
  { id: "algebra", category: "matematiikka", fi: "Algebra", en: "Algebra" },
  { id: "geometria", category: "matematiikka", fi: "Geometria", en: "Geometry" },
  { id: "todennakoisyys", category: "matematiikka", fi: "Todennäköisyys", en: "Probability" },
  { id: "kappaleet", category: "suureet", fi: "Kappaleet", en: "Shapes" },
  { id: "liike", category: "suureet", fi: "Liike ja lämpö", en: "Motion and temperature" },
  { id: "yksikot", category: "suureet", fi: "Yksiköt", en: "Units" },
];

const SUB_BY_ID = new Map(SUBCATEGORIES.map((item) => [item.id, item]));

export function subcategoryLabel(id: string, locale: Locale): string {
  const item = SUB_BY_ID.get(id);
  if (!item) return id;
  return item[locale];
}

let activeLocale: Locale = "fi";

export function setLocale(locale: Locale) {
  activeLocale = locale;
}

export function getLocale(): Locale {
  return activeLocale;
}

const PATTERNS: { re: RegExp; en: (match: RegExpMatchArray) => string }[] = [
  { re: /^"(.+)" ei ole luku\.$/, en: (m) => `"${m[1]}" is not a number.` },
  { re: /^Jonossa on (\d+) bittiä, leveys on (\d+)\.$/, en: (m) => `The string has ${m[1]} bits; the width is ${m[2]}.` },
  { re: /^Luku ei mahdu (\d+) bittiin \((.+)\)\.$/, en: (m) => `The value does not fit in ${m[1]} bits (${m[2]}).` },
  { re: /^Tämä RAID-taso tarvitsee vähintään (\d+) levyä\.$/, en: (m) => `This RAID level needs at least ${m[1]} drives.` },
  { re: /^Merkki "(.+)" ei kuulu kantalukuun (\d+)\.$/, en: (m) => `Character "${m[1]}" is not a digit in base ${m[2]}.` },
  { re: /^(\d+) levy$/, en: (m) => (m[1] === "1" ? "1 drive" : `${m[1]} drives`) },
  { re: /^(\d+) levyä$/, en: (m) => `${m[1]} drives` },
  { re: /^(\d+) bittiä$/, en: (m) => `${m[1]} bits` },
  { re: /^Pituudet eroavat \((\d+) ja (\d+)\)\.$/, en: (m) => `Lengths differ (${m[1]} and ${m[2]}).` },
  { re: /^Tuloksena \((.+)\)$/, en: (m) => `Result (${EN[m[1]] ?? m[1]})` },
];

export function t(locale: Locale, text: string): string {
  if (!text || locale === "fi") return text;
  const direct = EN[text];
  if (direct) return direct;
  for (const pattern of PATTERNS) {
    const match = text.match(pattern.re);
    if (match) return pattern.en(match);
  }
  return text;
}
