import { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient.js';

const initialFilters = {
  query: '',
  categoryId: 'all',
  priceMin: '',
  priceMax: '',
  sort: 'relevance'
};

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

  const update = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => setFilters(initialFilters);

  return (
    <form className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm" onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-1">
        <label htmlFor="query" className="text-sm font-medium text-slate-700">
          Search products
        </label>
        <input
          id="query"
          name="query"
          type="search"
          value={filters.query}
          onChange={(event) => update('query', event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          placeholder='Try "wireless earbuds"'
        />
      </div>
      <div className="grid gap-1">
        <label htmlFor="category" className="text-sm font-medium text-slate-700">
          Category
        </label>
        <select
          id="category"
          value={filters.categoryId}
          onChange={(event) => update('categoryId', event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
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
              className="rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>
          <label className="grid gap-1 text-xs">
            <span className="font-medium text-slate-500">Max ($)</span>
            <input
              type="number"
              min="0"
              value={filters.priceMax}
              onChange={(event) => update('priceMax', event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </label>
        </div>
      </fieldset>
      <div className="grid gap-1">
        <label htmlFor="sort" className="text-sm font-medium text-slate-700">
          Sort by
        </label>
        <select
          id="sort"
          value={filters.sort}
          onChange={(event) => update('sort', event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        >
          <option value="relevance">Relevance</option>
          <option value="price_asc">Price: Low to high</option>
          <option value="price_desc">Price: High to low</option>
          <option value="newest">Newest arrivals</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">Filters update results automatically.</p>
        <button
          type="button"
          onClick={reset}
          className="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          Reset all
        </button>
      </div>
    </form>
  );
}
