import ProductCard from './ProductCard.jsx';

export default function ProductCarousel({ title, subtitle, products = [], accent = 'light' }) {
  if (!products || products.length === 0) {
    return null;
  }

  const accentStyles =
    accent === 'dark'
      ? 'bg-slate-950 text-white border border-white/20'
      : 'bg-white text-slate-900 border border-slate-200/60';

  return (
    <section className={`grid gap-6 rounded-3xl p-8 shadow-lg ${accentStyles}`}>
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-current/70">{title}</p>
          <h2 className="text-2xl font-semibold">{subtitle}</h2>
        </div>
        <div className="text-sm text-current/60">
          {products.length} piece{products.length === 1 ? '' : 's'} in this drop
        </div>
      </header>
      <div className="flex gap-5 overflow-x-auto pb-2">
        {products.map((product) => (
          <div key={product.id} className="w-[260px] flex-shrink-0 md:w-[300px]">
            <ProductCard product={product} variant={accent === 'dark' ? 'on-dark' : 'default'} />
          </div>
        ))}
      </div>
    </section>
  );
}
