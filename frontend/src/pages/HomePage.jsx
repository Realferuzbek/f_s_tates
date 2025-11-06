import { useCallback, useMemo, useState } from 'react';
import useProducts from '../hooks/useProducts.js';
import useCuratedProducts from '../hooks/useCuratedProducts.js';
import ProductCard from '../components/ProductCard.jsx';
import SearchFilters from '../components/SearchFilters.jsx';
import HeroShowcase from '../components/HeroShowcase.jsx';
import ProductCarousel from '../components/ProductCarousel.jsx';
import BrandIcon from '../components/BrandIcon.jsx';

const brandHighlights = [
  {
    title: 'Small-batch ateliers',
    description: 'Each piece is produced in limited runs with traceable sourcing and atelier-level finishing.'
  },
  {
    title: 'Sustainable fibres',
    description: 'Premium organic cotton, regenerative alpaca, and recycled fills minimise footprint without compromise.'
  },
  {
    title: 'Complimentary tailoring',
    description: 'Enjoy expert virtual fittings and alterations on us with every ready-to-wear purchase.'
  }
];

const formatTitleCase = (value) => value.replace(/\b\w/g, (char) => char.toUpperCase());

export default function HomePage() {
  const [apiFilters, setApiFilters] = useState({});
  const [activeFilterState, setActiveFilterState] = useState(null);
  const { products, loading } = useProducts(apiFilters);
  const { data: curated, loading: curatedLoading } = useCuratedProducts();

  const handleFiltersChange = useCallback((values) => {
    setActiveFilterState(values);
    const normalized = {
      query: values.query || undefined,
      categoryId: values.categoryId === 'all' ? undefined : values.categoryId,
      audience: values.audience === 'all' ? undefined : values.audience,
      priceMin: values.priceMin || undefined,
      priceMax: values.priceMax || undefined,
      brand: values.brand || undefined,
      colors: values.colors.length > 0 ? values.colors.join(',') : undefined,
      sizes: values.sizes.length > 0 ? values.sizes.join(',') : undefined,
      badges: values.badges.length > 0 ? values.badges.join(',') : undefined,
      sort: values.sort
    };
    setApiFilters(normalized);
  }, []);

  const activeFilterChips = useMemo(() => {
    if (!activeFilterState) return [];
    const chips = [];
    if (activeFilterState.audience && activeFilterState.audience !== 'all') {
      chips.push(formatTitleCase(activeFilterState.audience));
    }
    if (activeFilterState.brand) {
      chips.push(`Brand: ${formatTitleCase(activeFilterState.brand)}`);
    }
    if (activeFilterState.colors.length) {
      chips.push(...activeFilterState.colors.map((color) => `Colour: ${formatTitleCase(color)}`));
    }
    if (activeFilterState.sizes.length) {
      chips.push(...activeFilterState.sizes.map((size) => `Size ${size}`));
    }
    if (activeFilterState.badges.length) {
      chips.push(...activeFilterState.badges.map((badge) => formatTitleCase(badge)));
    }
    if (activeFilterState.priceMin) {
      chips.push(`Min $${activeFilterState.priceMin}`);
    }
    if (activeFilterState.priceMax) {
      chips.push(`Max $${activeFilterState.priceMax}`);
    }
    if (activeFilterState.categoryId && activeFilterState.categoryId !== 'all') {
      chips.push('Curated category');
    }
    return chips.slice(0, 6);
  }, [activeFilterState]);

  return (
    <div className="flex flex-col gap-16">
      {curated.hero && (
        <HeroShowcase
          product={curated.hero}
          loading={curatedLoading}
        />
      )}

      <section className="grid gap-4 rounded-3xl bg-gradient-to-br from-white via-primary-50/40 to-white p-8 shadow-lg md:grid-cols-3">
        {brandHighlights.map((item) => (
          <article key={item.title} className="flex flex-col gap-2 rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur md:gap-3">
            <div className="flex items-center gap-2">
              <BrandIcon size={22} />
              <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
            </div>
            <p className="text-sm text-slate-600">{item.description}</p>
          </article>
        ))}
      </section>

      {!curatedLoading && curated.newArrivals.length > 0 && (
        <ProductCarousel
          title="New this week"
          subtitle="Fresh silhouettes hand-picked by our buyers."
          products={curated.newArrivals}
        />
      )}

      <section className="grid gap-10 lg:grid-cols-[320px_1fr]">
        <aside aria-label="Filters" className="lg:sticky lg:top-24 lg:self-start">
          <SearchFilters onChange={handleFiltersChange} />
        </aside>
        <div className="grid gap-6">
          <header className="grid gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Boutique edit</p>
              <h1 className="text-3xl font-semibold text-slate-900">The season&apos;s considered wardrobe</h1>
            </div>
            <p className="text-sm text-slate-600">
              Explore limited-run pieces across womenswear, menswear, and accessories. Every item is in stock now and
              ready to ship worldwide.
            </p>
            {activeFilterChips.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {activeFilterChips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </header>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {products.length === 0 && (
                <p className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-sm text-slate-500">
                  Nothing matches that combination yet—adjust your palette or size filters to discover more looks.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {!curatedLoading && curated.capsuleEdit.length > 0 && (
        <ProductCarousel
          title="Capsule edit"
          subtitle="Build your 10-piece wardrobe with mix-and-match icons."
          products={curated.capsuleEdit}
        />
      )}

      {!curatedLoading && curated.statementPieces.length > 0 && (
        <ProductCarousel
          title="Statement pieces"
          subtitle="Artisanal releases designed to turn heads at your next event."
          products={curated.statementPieces}
          accent="dark"
        />
      )}
    </div>
  );
}
