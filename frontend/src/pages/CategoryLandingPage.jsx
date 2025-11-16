import { Link, useParams } from 'react-router-dom';
import BrandIcon from '../components/BrandIcon.jsx';
import { getCategoryBySlug } from '../data/marketplaceCategories.js';

export default function CategoryLandingPage() {
  const { slug } = useParams();
  const category = getCategoryBySlug(slug);

  if (!category) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Unknown table</p>
        <h1 className="text-3xl font-semibold text-slate-900">We&apos;ll unveil that capsule shortly.</h1>
        <Link to="/" className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white">
          Back to marketplace
        </Link>
      </div>
    );
  }

  const gradientClass = `bg-gradient-to-br ${category.accentClass}`;
  const Icon = category.Icon;

  return (
    <div className="flex flex-col gap-10">
      <section className={`rounded-[40px] border border-white/50 ${gradientClass} px-8 py-12 shadow-xl shadow-primary-900/5 sm:px-12`}>
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-slate-500">
          <BrandIcon size={20} />
          <span>F•S tables</span>
        </div>
        <div className="mt-6 flex flex-wrap items-start gap-6">
          <div className="space-y-4 text-slate-900">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{category.title}</p>
            <h1 className="text-4xl font-semibold leading-tight">Full marketplace for this focus is coming soon.</h1>
            {category.subtitle && <p className="text-base text-slate-600">{category.subtitle}</p>}
          </div>
          {Icon && (
            <span className="rounded-3xl border border-white/60 bg-white/80 p-4 text-slate-500">
              <Icon className="h-10 w-10" aria-hidden="true" />
            </span>
          )}
        </div>
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link
            to="/"
            className="rounded-full border border-slate-900 px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-900 transition hover:bg-slate-900 hover:text-white"
          >
            Return to marketplace
          </Link>
          <button
            type="button"
            className="rounded-full border border-transparent bg-slate-900 px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white"
          >
            Notify me
          </button>
        </div>
      </section>
      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white/80 p-8 md:grid-cols-2">
        <article className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">What to expect</p>
          <p className="text-sm text-slate-600">
            Think of this table as a concierge shortlist. We&apos;re curating limited runs, atelier features, and dimensional
            product detail for {category.title.toLowerCase()}. Filters on the main marketplace will sync here soon.
          </p>
        </article>
        <article className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Timeline</p>
          <p className="text-sm text-slate-600">
            Our buyers are finalising inventory and visuals. Expect the first public view by the next season drop. Until
            then, feel free to DM concierge or return to the global collection.
          </p>
        </article>
      </section>
    </div>
  );
}