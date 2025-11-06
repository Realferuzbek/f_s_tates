import { useCallback, useState } from 'react';
import useProducts from '../hooks/useProducts.js';
import ProductCard from '../components/ProductCard.jsx';
import SearchFilters from '../components/SearchFilters.jsx';

export default function HomePage() {
  const [filters, setFilters] = useState({});
  const { products, loading } = useProducts(filters);

  const handleFiltersChange = useCallback((values) => {
    const normalized = {
      query: values.query || undefined,
      categoryId: values.categoryId === 'all' ? undefined : values.categoryId,
      priceMin: values.priceMin || undefined,
      priceMax: values.priceMax || undefined,
      sort: values.sort
    };
    setFilters(normalized);
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <section aria-label="Filters" className="lg:sticky lg:top-24 lg:self-start">
        <SearchFilters onChange={handleFiltersChange} />
      </section>
      <section aria-label="Product results" className="grid gap-6">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">Shop the latest arrivals</h1>
          <p className="mt-2 text-sm text-slate-600">
            Discover curated products with detailed specs, transparent pricing, and real-time inventory.
          </p>
        </header>
        {loading ? (
          <div className="grid h-48 place-items-center rounded-xl border border-dashed border-slate-300 bg-white">
            <p className="text-sm text-slate-500">Loading products…</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {products.length === 0 && (
              <p className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">
                No products match your filters. Try broadening your search.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
