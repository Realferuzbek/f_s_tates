import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
  ArrowsUpDownIcon,
  HeartIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const statFilters = [
  { id: 'live', label: 'Ateliers currently live', value: '36' },
  { id: 'ready72', label: 'Ready in under 72h', value: '< 72h' },
  { id: 'fittings', label: 'Private fitting slots today', value: '12' }
];

const quickFilters = [
  { id: 'ready72', label: 'Ready in < 72h' },
  { id: 'worldwide', label: 'Worldwide delivery' },
  { id: 'sustainable', label: 'Sustainable focus' }
];

export default function MarketplaceTable({ categories }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeQuickFilters, setActiveQuickFilters] = useState([]);
  const [activeStatFilters, setActiveStatFilters] = useState([]);

  if (!categories?.length) {
    return null;
  }

  const toggleFilter = (id, updater) => {
    updater((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const combinedFilters = [...new Set([...activeQuickFilters, ...activeStatFilters])];

  const filteredCategories = categories.filter((category) => {
    const haystack = [category.title, category.subtitle, category.meta, ...(category.tags || [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const matchesSearch = !normalizedSearch || haystack.includes(normalizedSearch);
    const categoryFilters = category.filters || [];
    const matchesFilters = combinedFilters.length === 0 || combinedFilters.every((filterId) => categoryFilters.includes(filterId));
    return matchesSearch && matchesFilters;
  });

  return (
    <section id="marketplace">
      <div className="rounded-[36px] border border-white/80 bg-white/90 p-6 shadow-[0_35px_80px_rgba(15,23,42,0.12)] sm:p-8">
        <header className="border-b border-slate-100 pb-6">
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Marketplace</p>
          <h2 className="mt-1 text-3xl font-semibold text-slate-900">Choose a category to start shopping</h2>
          <p className="mt-2 text-base text-slate-600">
            Browse independent ateliers by category, delivery speed, and fitting options. Toggle filters to narrow the grid
            in real time.
          </p>
          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex-1">
              <label htmlFor="marketplace-search" className="sr-only">
                Search pieces, designers, or categories
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="marketplace-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search pieces, designers, or categories…"
                  className="w-full rounded-full border border-slate-200/70 bg-white px-12 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
                Filter
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
              >
                <ArrowsUpDownIcon className="h-5 w-5" aria-hidden="true" />
                Sort
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {quickFilters.map((filter) => {
              const isActive = activeQuickFilters.includes(filter.id);
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => toggleFilter(filter.id, setActiveQuickFilters)}
                  aria-pressed={isActive}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 ${
                    isActive ? 'border-slate-900 bg-slate-900 text-white shadow' : 'border-slate-200/70 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
          <div
            className="mt-5 grid gap-4 text-sm text-slate-600 md:grid-cols-3"
            role="group"
            aria-label="Marketplace stats filters"
          >
            {statFilters.map((stat) => {
              const isActive = activeStatFilters.includes(stat.id);
              return (
                <button
                  key={stat.id}
                  type="button"
                  onClick={() => toggleFilter(stat.id, setActiveStatFilters)}
                  aria-pressed={isActive}
                  className={`rounded-2xl border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 ${
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                      : 'border-white/80 bg-white/70 text-slate-600 shadow-sm'
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-[0.35em]">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                </button>
              );
            })}
          </div>
        </header>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCategories.map((category) => {
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
                          className={`h-full w-full object-cover opacity-70 transition duration-500 ease-out group-hover:scale-105`}
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
        {filteredCategories.length === 0 && (
          <p className="mt-6 rounded-2xl border border-dashed border-slate-200/80 bg-white/80 px-4 py-6 text-center text-sm text-slate-500">
            Nothing matches those filters yet. Reset to view the full marketplace.
          </p>
        )}
      </div>
    </section>
  );
}
