import { useEffect, useState } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
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
    <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/95 px-2 py-1 shadow-[0_10px_25px_rgba(15,23,42,0.08)] backdrop-blur">
      <GlobeAltIcon className="h-4 w-4 text-slate-500" aria-hidden="true" />
      <div className="flex items-center gap-1.5">
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
              className={`group flex h-8 w-8 items-center justify-center rounded-full border text-[0.65rem] font-semibold uppercase tracking-[0.12em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-1 ${
                isActive
                  ? 'border-slate-900 bg-slate-900 text-white shadow-[0_10px_25px_rgba(15,23,42,0.25)]'
                  : 'border-slate-200/80 bg-white/70 text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              <FlagIcon code={language.code} active={isActive} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
