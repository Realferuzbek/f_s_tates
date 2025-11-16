import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

export default function CategoryCard({ category }) {
  const { title, subtitle, slug, accentClass, Icon } = category;

  return (
    <Link
      to={`/category/${slug}`}
      className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      aria-label={`Explore ${title}`}
    >
      <article
        className={`flex h-full flex-col justify-between rounded-[28px] border border-white/60 bg-gradient-to-br ${accentClass} p-6 shadow-[0_20px_45px_rgba(15,23,42,0.05)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_25px_50px_rgba(15,23,42,0.12)]`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Limited release</p>
            <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
            {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
          </div>
          {Icon && (
            <span className="rounded-2xl border border-white/60 bg-white/70 p-3 text-slate-500 shadow-inner">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
          )}
        </div>
        <div className="mt-8 flex items-center justify-between text-sm font-semibold text-slate-800">
          <span className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-slate-500">
            View table
          </span>
          <ArrowUpRightIcon className="h-5 w-5 text-primary-500 transition group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
        </div>
      </article>
    </Link>
  );
}