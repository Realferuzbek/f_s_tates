import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function AccessibilityWidget() {
  const { t } = useLanguage();
  return (
    <button
      type="button"
      className="fixed bottom-8 left-8 z-40 inline-flex items-center gap-2 rounded-[20px] border border-white/70 bg-white/95 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_18px_35px_rgba(15,23,42,0.18)] transition hover:shadow-[0_20px_40px_rgba(15,23,42,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
      aria-label={t('Open accessibility preferences')}
    >
      <AdjustmentsHorizontalIcon className="h-4 w-4 text-primary-600" aria-hidden="true" />
      <span>{t('Accessibility')}</span>
    </button>
  );
}
