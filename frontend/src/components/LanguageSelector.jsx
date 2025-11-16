import { useState } from 'react';

const languages = [
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'ru', flag: '🇷🇺', label: 'Russian' },
  { code: 'uz', flag: '🇺🇿', label: 'Uzbek' }
];

export default function LanguageSelector({ onChange }) {
  const [activeLang, setActiveLang] = useState(languages[0].code);

  const handleSelect = (code) => {
    setActiveLang(code);
    if (typeof onChange === 'function') {
      onChange(code);
    }
  };

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 px-1.5 py-1 shadow-inner shadow-white/70 ring-1 ring-black/5">
      {languages.map((language) => {
        const isActive = activeLang === language.code;
        return (
          <button
            key={language.code}
            type="button"
            onClick={() => handleSelect(language.code)}
            aria-pressed={isActive}
            aria-label={`Switch to ${language.label}`}
            title={language.label}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-xl transition ${
              isActive ? 'bg-slate-900 text-white shadow-md shadow-slate-900/30' : 'bg-white text-base'
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2`}
          >
            <span role="img" aria-hidden="false">
              {language.flag}
            </span>
          </button>
        );
      })}
    </div>
  );
}
