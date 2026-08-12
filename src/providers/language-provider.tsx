"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getDictionary,
  getDictionaryLegacy,
  LANGUAGES,
  translateKey,
  translateName,
  type LanguageCode,
} from "@/lib/i18n";
import { crestStore } from "@/lib/data/store";

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  /** Translate UI key, e.g. t("nav.dashboard") — optional {n} / {name} vars */
  t: (key: string, vars?: Record<string, string | number>) => string;
  /** Translate product / business / category / country names */
  tn: (name: string | undefined | null) => string;
  /** Legacy object dictionary for older components */
  dict: ReturnType<typeof getDictionaryLegacy>;
  languages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    // Default language is always English unless user explicitly chose another
    try {
      const stored = crestStore.getData().profile?.settings?.language as LanguageCode | undefined;
      const next =
        stored && LANGUAGES.some((l) => l.code === stored) ? stored : ("en" as LanguageCode);
      setLanguageState(next);
      document.documentElement.lang = next;
      document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
      if (!stored) {
        crestStore.updateSettings({ language: "en" });
      }
    } catch {
      setLanguageState("en");
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
    }
  }, []);

  const setLanguage = useCallback((code: LanguageCode) => {
    setLanguageState(code);
    try {
      crestStore.updateSettings({ language: code });
    } catch {
      // ignore
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = code;
      document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translateKey(key, language, vars),
    [language]
  );
  const tn = useCallback((name: string | undefined | null) => translateName(name, language), [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      tn,
      dict: getDictionaryLegacy(language),
      languages: LANGUAGES,
    }),
    [language, setLanguage, t, tn]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      language: "en" as LanguageCode,
      setLanguage: () => undefined,
      t: (key: string) => translateKey(key, "en"),
      tn: (name: string | undefined | null) => name ?? "",
      dict: getDictionaryLegacy("en"),
      languages: LANGUAGES,
    };
  }
  return ctx;
}

// silence unused if tree-shaken
void getDictionary;
