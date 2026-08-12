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
import { crestStore } from "@/lib/data/store";

export type ThemeMode = "dark" | "light";

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_KEY = "crest_os_theme";

function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    let next: ThemeMode = "dark";
    try {
      const stored = localStorage.getItem(THEME_KEY) as ThemeMode | null;
      const profileTheme = crestStore.getData().profile?.settings?.theme as ThemeMode | undefined;
      if (stored === "light" || stored === "dark") next = stored;
      else if (profileTheme === "light" || profileTheme === "dark") next = profileTheme;
    } catch {
      // keep dark
    }
    setThemeState(next);
    applyTheme(next);
  }, []);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
      crestStore.updateSettings({ theme: next });
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: "dark" as ThemeMode,
      setTheme: () => undefined,
      toggleTheme: () => undefined,
    };
  }
  return ctx;
}
