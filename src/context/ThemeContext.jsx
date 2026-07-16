import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "gb.theme";
const defaultTheme = "dark";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return defaultTheme;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
    // Rispetta la preferenza di sistema al primo accesso
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((p) => (p === "dark" ? "light" : "dark")),
      isLight: theme === "light",
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
