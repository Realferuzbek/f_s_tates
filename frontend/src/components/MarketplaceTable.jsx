import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

export default function MarketplaceTable({ categories }) {
  if (!categories?.length) {
    return null;
  }

  return (
    <section className="hidden lg:block">
      <div className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_35px_80px_rgba(15,23,42,0.12)]">
        <header className="border-b border-slate-100 pb-6">
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Laptop marketplace</p>
          <h2 className="mt-1 text-3xl font-semibold text-slate-900">Select a general table to open its world</h2>
          <p className="mt-2 text-sm text-slate-600">
            Tap one of the desktop tables to jump into its category landing page. You can keep refining with the filters
            that sit beneath the table grid.
          </p>
          {/* TODO: add the stacked mobile treatment once the laptop layout is approved */}
        </header>
        <div className="mt-6 grid auto-rows-[200px] grid-cols-4 gap-5">
          {categories.map((category, index) => {
            const { title, subtitle, slug, accentClass, Icon, imageUrl } = category;
            const isFeatured = index === 0;
            return (
              <Link
                to={`/category/${slug}`}
                key={slug}
                className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br ${accentClass} p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_65px_rgba(15,23,42,0.18)] ${
                  isFeatured ? 'col-span-2 row-span-2 p-8' : ''
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
                aria-label={`Browse the ${title} table`}
              >
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                  {imageUrl && (
                    <div
                      className={`pointer-events-none absolute ${isFeatured ? 'bottom-6 right-6 h-[78%] w-[65%]' : 'bottom-4 right-4 h-[65%] w-[68%]'}`}
                    >
                      <div className="h-full w-full overflow-hidden rounded-[32px] shadow-[0_30px_55px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5">
                        <img src={imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/85 via-white/15 to-slate-900/5" />
                </div>
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Market table</p>
                    <h3 className={`${isFeatured ? 'text-3xl' : 'text-xl'} font-semibold text-slate-900`}>{title}</h3>
                    {subtitle && <p className="max-w-sm text-sm text-slate-600">{subtitle}</p>}
                  </div>
                  {Icon && (
                    <span className="rounded-2xl border border-white/60 bg-white/70 p-3 text-slate-500 shadow-inner">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                  )}
                </div>
                <div className="relative z-10 mt-8 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
                  <span>Shop this table</span>
                  <ArrowUpRightIcon className="h-5 w-5 text-primary-500 transition group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
