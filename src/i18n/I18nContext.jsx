import React, { createContext, useState, useContext, useMemo } from "react";
import ru from "./ru";
import kk from "./kk";
import en from "./en";

const dictionaries = { ru, kk, en };

const I18nContext = createContext({
  lang: "ru",
  setLang: () => {},
  t: (key, vars) => key,
});

export const I18nProvider = ({ children, defaultLang = "ru" }) => {
  const [lang, setLang] = useState(defaultLang);

  const t = useMemo(() => (keyPath, vars = {}) => {
    const keys = keyPath.split(".");
    // пробуем сначала нужный язык
    let val = dictionaries[lang];
    for (const k of keys) {
      if (val && val[k] !== undefined) {
        val = val[k];
      } else {
        val = undefined;
        break;
      }
    }
    // если нет перевода — fallback на русский
    if (val === undefined) {
      val = dictionaries["ru"];
      for (const k of keys) {
        val = val?.[k];
        if (val === undefined) break;
      }
    }
    // если всё ещё нет — просто вернём ключ
    if (val === undefined) {
      console.warn(`Missing translation key "${keyPath}" for lang "${lang}" and fallback "ru"`);
      return keyPath;
    }
    // если это не строка (объект/массив) — возвращаем как есть
    if (typeof val !== "string") {
      return val;
    }
    // иначе подставляем {vars}
    return val.replace(/\{(\w+)\}/g, (_, name) =>
      vars[name] !== undefined ? vars[name] : `{${name}}`
    );
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
