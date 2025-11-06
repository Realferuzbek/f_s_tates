import { useEffect, useMemo, useState } from 'react';
import apiClient from '../utils/apiClient.js';
import { COLOR_LIBRARY, getColorSwatchClass } from '../utils/palette.js';

const initialFilters = {
  query: '',
  categoryId: 'all',
  audience: 'all',
  priceMin: '',
  priceMax: '',
  brand: '',
  sort: 'relevance',
  colors: [],
  sizes: [],
  badges: []
};

const SIZE_OPTIONS = [
  'xs',
  's',
  'm',
  'l',
  'xl',
  'xxl',
  '28',
  '30',
  '32',
  '34',
  '36',
  '38',
  '40',
  '42',
  '44',
  '2',
  '4',
  '6',
  '8',
  '10'
];

const BADGE_OPTIONS = [
  { value: 'statement', label: 'Statement' },
  { value: 'capsule', label: 'Capsule' },
  { value: 'bestseller', label: 'Bestseller' },
  { value: 'sustainable', label: 'Sustainable' },
  { value: 'editorial', label: 'Editorial' },
  { value: 'resort', label: 'Resort' },
  { value: 'runway', label: 'Runway' }
];

const audiences = [
  { value: 'all', label: 'All' },
  { value: 'women', label: 'Women' },
  { value: 'men', label: 'Men' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'kids', label: 'Kids' }
];

export default function SearchFilters({ onChange }) {
  const [filters, setFilters] = useState(initialFilters);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    apiClient
      .get('/products/categories')
      .then((response) => setCategories(response.data.categories))
      .catch((error) => console.error('Failed to load categories', error));
  }, []);

  useEffect(() => {
    onChange(filters);
  }, [filters, onChange]);

  const toggleArrayValue = (field, value) => {
    setFilters((prev) => {
      const current = prev[field];
      const exists = current.includes(value);
      return {
        ...prev,
        [field]: exists ? current.filter((item) => item !== value) : [...current, value]
      };
    });
  };

  const update = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => setFilters(initialFilters);

  const activeFiltersCount = useMemo(
    () =>
      ['colors', 'sizes', 'badges'].reduce((count, key) => count + (filters[key].length > 0 ? 1 : 0), 0) +
      (filters.audience !== 'all' ? 1 : 0) +
      (filters.categoryId !== 'all' ? 1 : 0) +
      (filters.brand ? 1 : 0) +
      (filters.priceMin ? 1 : 0) +
      (filters.priceMax ? 1 : 0),
    [filters]
  );

  return (
    <form
      className="grid gap-6 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="grid gap-1.5">
        <label htmlFor="query" className="text-sm font-medium text-slate-700">
          Search the collection
        </label>
        <input
          id="query"
          name="query"
          type="search"
          value={filters.query}
          onChange={(event) => update('query', event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          placeholder='Try "silk dress" or "linen shirt"'
        />
      </div>

      <div className="grid gap-1.5">
        <span className="text-sm font-medium text-slate-700">Audience</span>
        <div className="flex flex-wrap gap-2">
          {audiences.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => update('audience', option.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                filters.audience === option.value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'border border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

  <div className="grid gap-1.5">
        <label htmlFor="category" className="text-sm font-medium text-slate-700">
          Category
        </label>
        <select
          id="category"
          value={filters.categoryId}
          onChange={(event) => update('categoryId', event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="brand" className="text-sm font-medium text-slate-700">
          Brand
        </label>
        <input
          id="brand"
          type="text"
          value={filters.brand}
          onChange={(event) => update('brand', event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          placeholder="Search by brand"
        />
      </div>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-slate-700">Price range</legend>
        <div className="grid grid-cols-2 gap-2">
          <label className="grid gap-1 text-xs">
            <span className="font-medium text-slate-500">Min ($)</span>
            <input
              type="number"
              min="0"
              value={filters.priceMin}
              onChange={(event) => update('priceMin', event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>
          <label className="grid gap-1 text-xs">
            <span className="font-medium text-slate-500">Max ($)</span>
            <input
              type="number"
              min="0"
              value={filters.priceMax}
              onChange={(event) => update('priceMax', event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-slate-700">Colour palette</legend>
        <div className="flex flex-wrap gap-2">
          {COLOR_LIBRARY.map((option) => {
            const selected = filters.colors.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleArrayValue('colors', option.value)}
                className={`group flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                  selected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full ${getColorSwatchClass(
                    option.value
                  )} ring-1 ring-inset ring-black/5 group-hover:ring-primary-300`}
                  aria-hidden="true"
                />
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-slate-700">Sizes</legend>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((size) => {
            const selected = filters.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleArrayValue('sizes', size)}
                className={`min-w-[2.5rem] rounded-md border px-2 py-1 text-xs font-semibold uppercase transition ${
                  selected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-slate-700">Highlights</legend>
        <div className="flex flex-wrap gap-2">
          {BADGE_OPTIONS.map((badge) => {
            const selected = filters.badges.includes(badge.value);
            return (
              <button
                key={badge.value}
                type="button"
                onClick={() => toggleArrayValue('badges', badge.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  selected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'border border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                {badge.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-1.5">
        <label htmlFor="sort" className="text-sm font-medium text-slate-700">
          Sort by
        </label>
        <select
          id="sort"
          value={filters.sort}
          onChange={(event) => update('sort', event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        >
          <option value="relevance">Editorial picks</option>
          <option value="newest">Newest arrivals</option>
          <option value="price_asc">Price: Low to high</option>
          <option value="price_desc">Price: High to low</option>
        </select>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
        <span>
          {activeFiltersCount > 0
            ? `${activeFiltersCount} active ${activeFiltersCount === 1 ? 'filter' : 'filters'}`
            : 'Filters update results instantly'}
        </span>
        <button
          type="button"
          onClick={reset}
          className="font-semibold text-primary-600 hover:text-primary-500"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
