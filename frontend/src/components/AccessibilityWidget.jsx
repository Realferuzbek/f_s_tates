import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function AccessibilityWidget() {
  return (
    <button
      type="button"
      className="fixed bottom-8 left-8 z-40 inline-flex h-8 items-center gap-2 rounded-full border border-[#E0E4EE] bg-white/95 px-3.5 text-[0.8rem] font-semibold text-slate-700 shadow-[0_10px_25px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(15,23,42,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      aria-label="Open accessibility preferences"
    >
      <AdjustmentsHorizontalIcon className="h-4 w-4 text-primary-600" aria-hidden="true" />
      <span>Accessibility</span>
    </button>
  );
}
