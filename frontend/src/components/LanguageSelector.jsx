import { useEffect } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import FlagIcon from './flags/FlagIcon.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Russian' },
  { code: 'uz', label: 'Uzbek' }
];

export default function LanguageSelector({ onChange }) {
  const { language: activeLanguage, setLanguage, t } = useLanguage();

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(activeLanguage);
    }
  }, [activeLanguage, onChange]);

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/95 px-2 py-1 shadow-[0_10px_25px_rgba(15,23,42,0.08)] backdrop-blur">
      <GlobeAltIcon className="h-4 w-4 text-slate-500" aria-hidden="true" />
      <div className="flex items-center gap-1.5">
        {languages.map((language) => {
          const isActive = activeLanguage === language.code;
          return (
            <button
              key={language.code}
              type="button"
              onClick={() => setLanguage(language.code)}
              aria-pressed={isActive}
              aria-label={t('Switch to {{language}}', { language: language.label })}
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
