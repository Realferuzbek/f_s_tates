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
    <div className="flex items-center gap-2 rounded-full border border-[#E0E4EE] bg-white/95 px-2.5 py-1.5">
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
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-[0.6rem] font-semibold uppercase tracking-[0.14em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-1 ${
                isActive
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-[#E0E4EE] bg-white text-slate-500 hover:border-[#c7cfde] hover:text-slate-700'
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
