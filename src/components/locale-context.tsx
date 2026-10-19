import { createContext } from "react";
import type { Locale } from "@/lib/i18n";

export const LocaleContext = createContext<Locale>("fi");
