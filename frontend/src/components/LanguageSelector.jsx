import { useEffect, useState } from 'react';
import FlagIcon from './flags/FlagIcon.jsx';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Russian' },
  { code: 'uz', label: 'Uzbek' }
];

const STORAGE_KEY = 'fs-language';

const getInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return languages[0].code;
  }
  return window.localStorage.getItem(STORAGE_KEY) || languages[0].code;
};

export default function LanguageSelector({ onChange }) {
  const [activeLang, setActiveLang] = useState(getInitialLanguage);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = activeLang;
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, activeLang);
    }
    if (typeof onChange === 'function') {
      onChange(activeLang);
    }
  }, [activeLang, onChange]);

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/90 px-1.5 py-1 shadow-inner shadow-white/70 ring-1 ring-black/5">
      {languages.map((language) => {
        const isActive = activeLang === language.code;
        return (
          <button
            key={language.code}
            type="button"
            onClick={() => setActiveLang(language.code)}
            aria-pressed={isActive}
            aria-label={`Switch to ${language.label}`}
            title={language.label}
            className={`group flex h-10 w-10 items-center justify-center rounded-full transition ${
              isActive ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/30' : 'bg-white'
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2`}
          >
            <FlagIcon code={language.code} active={isActive} />
          </button>
        );
      })}
    </div>
  );
}
