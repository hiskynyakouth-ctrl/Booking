import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { languageNames } from "../../i18n";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <select
      value={lang}
      onChange={e => setLang(e.target.value)}
      style={{
        background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
        borderRadius: 8,
        padding: "0.35rem 0.75rem",
        color: dark ? "#fff" : "#111",
        fontSize: "0.78rem",
        cursor: "pointer",
        outline: "none",
        fontFamily: "inherit",
      }}
    >
      {Object.entries(languageNames).map(([code, name]) => (
        <option key={code} value={code} style={{ background: dark ? "#1a1a2e" : "#fff" }}>
          {name}
        </option>
      ))}
    </select>
  );
}
