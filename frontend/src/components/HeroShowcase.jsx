import { Link } from 'react-router-dom';
import { getColorSwatchClass } from '../utils/palette.js';
import BrandIcon from './BrandIcon.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

function formatTitleCase(value) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function HeroShowcase({ product, loading = false }) {
  const { t } = useLanguage();

  if (loading || !product) {
    return (
      <section className="relative overflow-hidden rounded-3xl bg-slate-900/80 p-10 text-white shadow-xl">
        <div className="animate-pulse space-y-8">
          <div className="h-6 w-32 rounded-full bg-white/20" />
          <div className="h-16 w-3/5 rounded-2xl bg-white/20" />
          <div className="h-4 w-2/5 rounded-full bg-white/20" />
          <div className="h-12 w-40 rounded-full bg-white/20" />
        </div>
      </section>
    );
  }

  const displayImage = product.heroImage || product.image;
  const colorPalette = (product.colorOptions ?? []).slice(0, 4);
  const badges = (product.badges ?? []).slice(0, 3);
  const materials = (product.materials ?? []).slice(0, 2);

  return (
    <section className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white shadow-[0_30px_80px_rgba(15,23,42,0.6)]">
      <div className="absolute inset-0">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary-500/40 blur-3xl" />
        <div className="absolute -right-16 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />
      </div>
      <div className="relative grid gap-10 p-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="max-w-xl space-y-6">
          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.35em] text-white/70">
            <BrandIcon size={28} className="drop-shadow-[0_6px_12px_rgba(0,0,0,0.2)]" label="F-S Tates monogram" />
            <span>{t('Featured drop')}</span>
            <span className="h-px flex-1 bg-white/20" aria-hidden="true" />
          </div>
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.25em] text-primary-200/90">
              {product.brand} • {formatTitleCase(product.category?.name ?? product.category ?? 'Limited')}
            </p>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">{product.name}</h1>
            <p className="text-sm text-white/85 md:text-base">{product.shortDescription}</p>
          </div>
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white/90 backdrop-blur"
                >
                  {formatTitleCase(badge)}
                </span>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-2xl font-semibold text-white">${product.price.toFixed(2)}</span>
            {colorPalette.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-white/70">
                <span aria-hidden="true" className="hidden sm:inline">
                  {t('Palette')}
                </span>
                <div className="flex items-center gap-1.5">
                  {colorPalette.map((color) => (
                    <span
                      key={color}
                      className={`h-4 w-4 rounded-full ${getColorSwatchClass(
                        color
                      )} ring-2 ring-white/40`}
                      title={formatTitleCase(color)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          {materials.length > 0 && (
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              {t('hero.craftedIn', {
                materials: materials.map((material) => formatTitleCase(material)).join(' • ')
              })}
            </p>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to={`/products/${product.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-primary-100"
            >
              {t('Shop the look')}
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              to="/account"
              className="inline-flex items-center rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white/90 transition hover:border-white hover:text-white"
            >
              {t('Book a styling session')}
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-2xl backdrop-blur-sm transition duration-700 group-hover:scale-[1.01]">
          {displayImage ? (
            <img src={displayImage} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="grid h-96 place-items-center text-sm text-white/70">{t('Editorial image coming soon')}</div>
          )}
          <div className="absolute bottom-4 right-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-white/70 backdrop-blur">
            {product.fit ? formatTitleCase(product.fit) : t('Limited release')}
          </div>
        </div>
      </div>
    </section>
  );
}
