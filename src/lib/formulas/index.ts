import { elektroniikka } from "./elektroniikka";
import { fysiikka } from "./fysiikka";
import { matematiikka } from "./matematiikka";
import { suureet } from "./suureet";
import { tieto } from "./tieto";
import { verkko } from "./verkko";
import { CATEGORIES, normalizeSearch, type CategoryId, type Formula } from "./shared";
import { subcategoryLabel, t } from "../i18n";

export const FORMULAS: Formula[] = [...tieto, ...verkko, ...elektroniikka, ...fysiikka, ...matematiikka, ...suureet];

const byId = new Map(FORMULAS.map((formula) => [formula.id, formula]));

export function getFormula(id: string): Formula | undefined {
  return byId.get(id);
}

export function categoryLabel(id: CategoryId): string {
  return CATEGORIES.find((category) => category.id === id)?.label ?? id;
}

export function formulaHaystack(formula: Formula): string {
  const bits = [
    formula.name,
    formula.blurb,
    formula.expression,
    formula.note ?? "",
    formula.tags.join(" "),
    categoryLabel(formula.category),
    subcategoryLabel(formula.subcategory, "fi"),
    subcategoryLabel(formula.subcategory, "en"),
    ...(formula.tables ?? []).flatMap((table) => [table.title, ...table.columns, ...table.rows.flat()]),
  ];
  const english = bits.map((bit) => t("en", bit)).join(" ");
  return normalizeSearch(`${bits.join(" ")} ${english}`);
}

export { CATEGORIES };
export type { CategoryId, ComputeResult, Formula, FormulaInput, ResultRow } from "./shared";
