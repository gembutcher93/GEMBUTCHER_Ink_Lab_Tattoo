import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { translations, defaultLang } from "@/lib/i18n";

const LangContext = createContext(null);

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return defaultLang;
    return localStorage.getItem("gb.lang") || defaultLang;
  });

  useEffect(() => {
    localStorage.setItem("gb.lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: translations[lang] || translations[defaultLang],
    }),
    [lang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
};
