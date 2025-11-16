import { Link } from 'react-router-dom';
import { ArrowRightIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function MarketplaceTable({ categories }) {
  if (!categories?.length) {
    return null;
  }

  return (
    <section id="marketplace">
      <div className="rounded-[28px] border border-white/80 bg-white/95 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.1)] sm:p-10">
        <header className="border-b border-slate-100 pb-6">
          <h2 className="text-[1.9rem] font-semibold leading-[1.3] text-slate-950 sm:text-[2rem]">
            Choose a category to start shopping
          </h2>
          <p className="mt-3 max-w-2xl text-[0.95rem] leading-[1.5] text-[#6E7585]">
            Browse independent ateliers by category and jump straight into their curated capsules.
          </p>
        </header>
        <div className="mt-9 grid gap-x-8 gap-y-9 sm:grid-cols-2 xl:mx-auto xl:max-w-6xl xl:grid-cols-3 xl:gap-x-10">
          {categories.map((category) => {
            const { title, subtitle, slug, accentClass, imageUrl, label, meta, tags } = category;
            const safeTags = (tags || []).slice(0, 3);
            const metaSegments = (meta || '')
              .split('·')
              .map((segment) => segment.trim())
              .filter(Boolean);
            const [primaryMeta, ...supportingMeta] = metaSegments;
            const resolvedLabel = label || 'CATEGORY';
            return (
              <Link
                to={`/category/${slug}`}
                key={slug}
                className={`group relative flex min-h-[260px] flex-col overflow-hidden rounded-[24px] border border-white/70 bg-gradient-to-br ${accentClass} px-6 py-6 text-left shadow-[0_22px_55px_rgba(15,23,42,0.1)] ring-1 ring-black/5 transition duration-500 hover:-translate-y-1 hover:shadow-[0_40px_75px_rgba(15,23,42,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400`}
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
                          className="h-full w-full object-cover object-[center_35%] opacity-70 transition duration-500 ease-out group-hover:scale-105"
                        />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/55 to-white/5" />
                </div>
                <div
                  className="pointer-events-none absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/85 text-slate-500 shadow-[0_12px_28px_rgba(15,23,42,0.12)] backdrop-blur"
                  aria-hidden="true"
                >
                  <HeartIcon className="h-5 w-5" />
                </div>
                <div className="relative z-10 flex h-full flex-col">
                  <div className="pr-10">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#9AA2B2]">{resolvedLabel}</p>
                    <h3 className="mt-2 text-[1.35rem] font-semibold leading-snug text-[#141824]">{title}</h3>
                    {subtitle && (
                      <p className="mt-1.5 text-[0.92rem] leading-snug text-[#6E7585] line-clamp-2">{subtitle}</p>
                    )}
                  </div>
                  <div className="mt-auto pt-6">
                    {meta && (
                      <p className="text-[0.95rem] font-medium text-[#525A6B]">
                        {primaryMeta && <span className="text-[#141824]">{primaryMeta}</span>}
                        {supportingMeta.length > 0 && (
                          <span className="text-[#7A8194]"> · {supportingMeta.join(' · ')}</span>
                        )}
                      </p>
                    )}
                    {safeTags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {safeTags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full border border-[#E0E4EE] bg-white/85 px-3 py-1 text-[0.78rem] font-medium text-[#6E7585]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#E0E4EE] bg-white/95 px-5 text-sm font-semibold text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.1)] transition duration-200 group-hover:border-slate-900/40 group-hover:text-slate-900">
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
