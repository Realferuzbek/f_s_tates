import useProducts from '../hooks/useProducts.js';
import useCuratedProducts from '../hooks/useCuratedProducts.js';
import ProductCard from '../components/ProductCard.jsx';
import HeroShowcase from '../components/HeroShowcase.jsx';
import ProductCarousel from '../components/ProductCarousel.jsx';
import MarketplaceTable from '../components/MarketplaceTable.jsx';
import { marketplaceCategories } from '../data/marketplaceCategories.js';

export default function HomePage() {
  const { products, loading } = useProducts();
  const { data: curated, loading: curatedLoading } = useCuratedProducts();

  return (
    <div className="flex flex-col gap-16">
      <MarketplaceTable categories={marketplaceCategories} />
      {curated.hero && (
        <HeroShowcase
          product={curated.hero}
          loading={curatedLoading}
        />
      )}

      {!curatedLoading && curated.newArrivals.length > 0 && (
        <ProductCarousel
          title="New this week"
          subtitle="Fresh silhouettes hand-picked by our buyers."
          products={curated.newArrivals}
        />
      )}

      <section className="grid gap-8">
        <header className="grid gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Boutique edit</p>
            <h1 className="text-3xl font-semibold text-slate-900">Choose your table, then refine</h1>
          </div>
          <p className="text-sm text-slate-600">
            After selecting a table above, this feed surfaces the matching drops—no extra controls, just a clean runway of
            pieces to explore.
          </p>
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
                Nothing is on this runway yet—fresh looks are loading in shortly.
              </p>
            )}
          </div>
        )}
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
