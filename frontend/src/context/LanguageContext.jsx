import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, translations } from '../data/translations.js';

const LanguageContext = createContext({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: (key) => key
});

const getInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }
  return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE;
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language]);

  const value = useMemo(() => {
    const translate = (key, replacements) => {
      if (!key) {
        return '';
      }
      const dictionary = translations[language] || {};
      const fallbackDictionary = translations[DEFAULT_LANGUAGE] || {};
      const template = (dictionary[key] ?? fallbackDictionary[key] ?? key).toString();
      if (!replacements) {
        return template;
      }
      return template.replace(/\{\{(.*?)\}\}/g, (_, token) => {
        const trimmed = token.trim();
        return replacements[trimmed] ?? '';
      });
    };

    return {
      language,
      setLanguage,
      t: translate
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
