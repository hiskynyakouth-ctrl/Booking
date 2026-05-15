import en    from "./en.json";
import am    from "./am.json";
import ar    from "./ar.json";
import nuer  from "./nuer.json";
import dinka from "./Dinka.json";

export const languages = { en, am, ar, nuer, dinka };

export const languageNames = {
  en:    "English",
  am:    "አማርኛ (Amharic)",
  ar:    "العربية (Arabic)",
  nuer:  "Nuer",
  dinka: "Dinka",
};

export const t = (lang, key) => languages[lang]?.[key] || languages["en"]?.[key] || key;
