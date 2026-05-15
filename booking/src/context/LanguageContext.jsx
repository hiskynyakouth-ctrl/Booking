import { createContext, useContext, useState, useEffect } from "react";
import { languages } from "../i18n";

export const LanguageContext = createContext(null);

const RTL_LANGS = ["ar"];

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("lang") || "en"; } catch { return "en"; }
  });

  const changeLang = (l) => {
    setLang(l);
    try { localStorage.setItem("lang", l); } catch {}
  };

  // Apply RTL direction and lang attribute to <html>
  useEffect(() => {
    const isRTL = RTL_LANGS.includes(lang);
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
  }, [lang]);

  const t = (key) => languages[lang]?.[key] ?? languages["en"]?.[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t, isRTL: RTL_LANGS.includes(lang) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within <LanguageProvider>");
  return ctx;
};
