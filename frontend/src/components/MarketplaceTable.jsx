import { Link } from 'react-router-dom';
import { ArrowRightIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function MarketplaceTable({ categories }) {
  if (!categories?.length) {
    return null;
  }

  return (
    <section id="marketplace">
      <div className="rounded-[36px] border border-white/80 bg-white/90 p-6 shadow-[0_35px_80px_rgba(15,23,42,0.12)] sm:p-8">
        <header className="border-b border-slate-100 pb-6">
          <h2 className="mt-1 text-3xl font-semibold text-slate-900">Choose a category to start shopping</h2>
          <p className="mt-2 text-base text-slate-600">
            Browse independent ateliers by category and jump straight into their curated capsules.
          </p>
        </header>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const { title, subtitle, slug, accentClass, imageUrl, label, meta, tags } = category;
            const resolvedLabel = label || 'CATEGORY';
            return (
              <Link
                to={`/category/${slug}`}
                key={slug}
                className={`group relative flex min-h-[260px] flex-col overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br ${accentClass} p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_35px_70px_rgba(15,23,42,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400`}
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
                  <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/40 to-slate-900/25" />
                </div>
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">{resolvedLabel}</p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h3>
                      {subtitle && <p className="mt-1 text-base text-slate-700">{subtitle}</p>}
                      {meta && <p className="mt-2 text-sm font-medium text-slate-800/80">{meta}</p>}
                    </div>
                    <span className="rounded-full border border-white/70 bg-white/80 p-2 text-slate-400 shadow-inner" aria-hidden="true">
                      <HeartIcon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-700">
                      {(tags || []).map((tag) => (
                        <span key={tag} className="rounded-full bg-white/80 px-3 py-1 text-slate-800 shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-slate-900 transition group-hover:bg-slate-900 group-hover:text-white">
                      <span>View category</span>
                      <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
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
