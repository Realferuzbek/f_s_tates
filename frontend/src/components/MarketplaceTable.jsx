import { Link } from 'react-router-dom';
import { ArrowRightIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function MarketplaceTable({ categories }) {
  if (!categories?.length) {
    return null;
  }

  return (
    <section id="marketplace">
      <div className="rounded-[32px] border border-white/80 bg-white/95 p-6 shadow-[0_35px_80px_rgba(15,23,42,0.12)] sm:p-9">
        <header className="border-b border-slate-100 pb-5">
          <h2 className="mt-1 text-3xl font-semibold text-slate-950">Choose a category to start shopping</h2>
          <p className="mt-2 text-base text-slate-600 leading-relaxed">
            Browse independent ateliers by category and jump straight into their curated capsules.
          </p>
        </header>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const { title, subtitle, slug, accentClass, imageUrl, label, meta, tags } = category;
            const metaSegments = (meta || '')
              .split('·')
              .map((segment) => segment.trim())
              .filter(Boolean);
            const [primaryMeta, ...supportingMeta] = metaSegments;
            const primaryTag = tags?.[0];
            const resolvedLabel = label || 'CATEGORY';
            return (
              <Link
                to={`/category/${slug}`}
                key={slug}
                className={`group relative flex min-h-[240px] flex-col overflow-hidden rounded-[30px] border border-white/70 bg-gradient-to-br ${accentClass} px-6 py-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)] ring-1 ring-black/5 transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_35px_70px_rgba(15,23,42,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400`}
                aria-label={`View the ${title} category`}
              >
                <div className="pointer-events-none absolute inset-0">
                  {imageUrl && (
                    <div className="absolute inset-0">
                      <div className="h-full w-full">
                        <img
                          src={imageUrl}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover opacity-70 transition duration-500 ease-out group-hover:scale-105"
                        />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/25 to-white/5" />
                </div>
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.62rem] uppercase tracking-[0.2em] text-slate-900/60">{resolvedLabel}</p>
                      <h3 className="mt-2 text-[1.6rem] font-bold leading-tight text-slate-950">{title}</h3>
                      {subtitle && <p className="mt-1 text-sm text-slate-700/80 line-clamp-1">{subtitle}</p>}
                      {meta && (
                        <p className="mt-2 text-sm text-slate-600">
                          {primaryMeta && <span className="font-semibold text-slate-900">{primaryMeta}</span>}
                          {supportingMeta.length > 0 && (
                            <span className="text-slate-500"> · {supportingMeta.join(' · ')}</span>
                          )}
                        </p>
                      )}
                    </div>
                    <span
                      className="rounded-full border border-white/60 bg-white/50 p-2.5 text-slate-500 shadow-[0_8px_15px_rgba(15,23,42,0.12)] backdrop-blur"
                      aria-hidden="true"
                    >
                      <HeartIcon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-700">
                      {primaryTag && (
                        <span className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[0.7rem] text-slate-900 shadow-sm">
                          {primaryTag}
                        </span>
                      )}
                    </div>
                    <div className="inline-flex min-w-[160px] items-center justify-between gap-2 rounded-full border border-slate-900/10 bg-white/95 px-5 py-1.5 text-sm font-semibold text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.18)] transition group-hover:bg-slate-900 group-hover:text-white">
                      <span>View category</span>
                      <ArrowRightIcon className="h-4 w-4 transition duration-200 group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
