import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowPathRoundedSquareIcon,
  ArrowRightIcon,
  CheckIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  SparklesIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import useProducts from '../../hooks/useProducts.js';
import { marketplaceCategories } from '../../data/marketplaceCategories.js';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useMobileExperience } from '../../context/MobileExperienceContext.jsx';
import useAnalytics from '../../hooks/useAnalytics.js';
import apiClient from '../../utils/apiClient.js';
import { getColorSwatchClass } from '../../utils/palette.js';

const audiences = [
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
  { id: 'unisex', label: 'Unisex' },
  { id: 'kids', label: 'Kids' }
];

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colorOptions = ['Black', 'White', 'Camel', 'Navy', 'Emerald', 'Crimson'];
const highlightOptions = ['New', 'Limited', 'Sustainable', 'Made to order'];

const sortOptions = [
  { id: 'newest', label: 'Newest first' },
  { id: 'price-low', label: 'Price: Low to high' },
  { id: 'price-high', label: 'Price: High to low' },
  { id: 'limited', label: 'Limited drops' }
];

const heroFallbacks = [
  {
    id: 'seasonal-edit',
    title: 'Seasonal edit',
    description: 'Winter textures, sculpted boots, and cloud knits.',
    accent: 'from-slate-900 via-slate-800 to-slate-900',
    button: 'Shop edit',
    categorySlug: 'coats-jackets',
    image:
      'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'atelier-boots',
    title: 'New in boots',
    description: 'Hand-lasted silhouettes ready in 48h.',
    accent: 'from-purple-600 via-indigo-600 to-slate-900',
    button: 'View boots',
    categorySlug: 'boots',
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'scarves',
    title: 'Winter scarves',
    description: 'Regenerative cashmere & featherlight silks.',
    accent: 'from-rose-500 via-amber-400 to-orange-500',
    button: 'Wrap me up',
    categorySlug: 'scarves'
  }
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

const orderStatusLabels = {
  PLACED: 'Placed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered'
};

function MobileSheet({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/70 backdrop-blur-md" role="dialog">
      <button type="button" className="flex-1" aria-label="Close sheet overlay" onClick={onClose} />
      <section className="max-h-[88vh] rounded-t-[32px] bg-white px-5 pb-8 pt-6 shadow-[0_-25px_45px_rgba(15,23,42,0.25)]">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="mt-5 flex max-h-[60vh] flex-col gap-6 overflow-y-auto">{children}</div>
        {footer && <div className="mt-6">{footer}</div>}
      </section>
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600"
      onClick={onRemove}
    >
      {label}
      <ArrowPathRoundedSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
}

function ProductListItem({ product, onRequireProfile }) {
  const badges = (product.badges ?? []).slice(0, 2);
  const colors = (product.colorOptions ?? []).slice(0, 3);

  return (
    <article className="rounded-3xl border border-white/80 bg-gradient-to-br from-white via-white to-slate-50/70 p-4 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
      <Link to={`/products/${product.id}`} className="block overflow-hidden rounded-2xl">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-52 w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-52 items-center justify-center bg-slate-100 text-sm text-slate-500">Preview coming soon</div>
        )}
      </Link>
      <div className="mt-4 space-y-2">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-500">
          {product.brand ?? 'F•S Tates'}
        </p>
        <div className="flex items-center justify-between gap-2">
          <Link to={`/products/${product.id}`} className="text-lg font-semibold text-slate-900">
            {product.name}
          </Link>
          <span className="text-base font-semibold text-primary-600">{currencyFormatter.format(product.price ?? 0)}</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">{product.description}</p>
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-slate-900/5 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-slate-600"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {colors.map((color) => (
              <span
                key={color}
                className={`h-5 w-5 rounded-full ${getColorSwatchClass(color)} ring-1 ring-black/10`}
                title={color}
              />
            ))}
          </div>
          <button
            type="button"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
            onClick={onRequireProfile}
          >
            Save
          </button>
        </div>
      </div>
      <Link
        to={`/products/${product.id}`}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_15px_30px_rgba(15,23,42,0.25)] transition hover:bg-primary-600"
      >
        View details
        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

export default function MobileMarketplacePanel({ curatedData = null }) {
  const { cartCount } = useCart();
  const { user, token } = useAuth();
  const { openOrderChat, openSupportChat, promptProfile } = useMobileExperience();
  const trackEvent = useAnalytics();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAudience, setActiveAudience] = useState('women');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedHighlights, setSelectedHighlights] = useState([]);
  const curatedHero = curatedData?.hero;
  const [priceRange, setPriceRange] = useState([120, 1200]);
  const [sortOption, setSortOption] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(6);
  const [activeSheet, setActiveSheet] = useState(null);
  const [categoryFlash, setCategoryFlash] = useState(false);
  const [latestOrder, setLatestOrder] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const feedSectionRef = useRef(null);
  useEffect(() => {
    if (!user) {
      setLatestOrder(null);
      return;
    }
    const authToken = typeof token === 'function' ? token() : null;
    if (!authToken) {
      return;
    }
    setOrdersLoading(true);
    apiClient
      .get('/account/orders', {
        params: { limit: 1 },
        headers: { Authorization: `Bearer ${authToken}` }
      })
      .then((response) => {
        setLatestOrder(response.data.orders?.[0] ?? null);
      })
      .catch(() => {
        setLatestOrder(null);
      })
      .finally(() => setOrdersLoading(false));
  }, [token, user]);

  const heroSlides = useMemo(() => {
    if (curatedHero) {
      return [
        {
          id: 'hero-product',
          title: curatedHero.name,
          description: curatedHero.description,
          accent: 'from-primary-600 via-purple-600 to-slate-900',
          button: 'View capsule',
          productId: curatedHero.id,
          image: curatedHero.heroImage ?? curatedHero.image
        },
        ...heroFallbacks
      ];
    }
    return heroFallbacks;
  }, [curatedHero]);

  const filterPayload = useMemo(
    () => ({
      audience: activeAudience,
      search: searchQuery || undefined,
      category: selectedCategory || undefined,
      colors: selectedColors,
      sizes: selectedSizes,
      highlights: selectedHighlights,
      sort: sortOption,
      priceMin: priceRange[0],
      priceMax: priceRange[1]
    }),
    [activeAudience, searchQuery, selectedCategory, selectedColors, selectedSizes, selectedHighlights, sortOption, priceRange]
  );

  const { products, loading } = useProducts(filterPayload);
  const visibleProducts = products.slice(0, visibleCount);
  const canLoadMore = products.length > visibleCount;

  const filterChips = useMemo(() => {
    const chips = [];
    if (selectedCategory) {
      const category = marketplaceCategories.find((c) => c.slug === selectedCategory);
      if (category) {
        chips.push({ id: 'category', label: category.title });
      }
    }
    if (selectedColors.length > 0) {
      chips.push({ id: 'color', label: `${selectedColors.length} colour${selectedColors.length > 1 ? 's' : ''}` });
    }
    if (selectedSizes.length > 0) {
      chips.push({ id: 'sizes', label: `${selectedSizes.length} size${selectedSizes.length > 1 ? 's' : ''}` });
    }
    if (selectedHighlights.length > 0) {
      chips.push({ id: 'highlights', label: `${selectedHighlights.length} highlight` });
    }
    if (sortOption !== 'newest') {
      const label = sortOptions.find((option) => option.id === sortOption)?.label ?? 'Custom sort';
      chips.push({ id: 'sort', label });
    }
    return chips;
  }, [selectedCategory, selectedColors.length, selectedSizes.length, selectedHighlights.length, sortOption]);

  const toggleArrayValue = (value, listSetter) => {
    listSetter((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));
  };

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    setVisibleCount(6);
    setCategoryFlash(true);
    setActiveSheet(null);
    trackEvent('marketplace_category_clicked', {
      screen: 'mobile_marketplace',
      properties: { category_slug: slug }
    });
    setTimeout(() => setCategoryFlash(false), 450);
    if (feedSectionRef.current && typeof window !== 'undefined') {
      const rect = feedSectionRef.current.getBoundingClientRect();
      const top = rect.top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleRequireProfile = () => {
    if (!user) {
      promptProfile('Sign in to save favourites and checkout faster');
    }
  };

  const handleViewMessages = () => {
    if (!user) {
      promptProfile('Sign in to view your concierge messages');
      return;
    }
    if (!latestOrder) {
      promptProfile('Finish checkout to unlock message threads for your orders');
      return;
    }
    trackEvent('marketplace_view_messages_clicked', {
      screen: 'mobile_marketplace',
      properties: { order_id: latestOrder.id }
    });
    openOrderChat(latestOrder.id);
  };

  const resetFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedHighlights([]);
    setPriceRange([120, 1200]);
  };

  const renderFilterSheet = () => {
    if (activeSheet !== 'filters') return null;
    return (
      <MobileSheet
        title="Filters"
        onClose={() => setActiveSheet(null)}
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
              onClick={resetFilters}
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setActiveSheet(null)}
              className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.22)]"
            >
              Show {products.length} looks
            </button>
          </div>
        }
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Price range</p>
          <div className="mt-3 flex items-center justify-between text-sm font-semibold text-slate-700">
            <span>{currencyFormatter.format(priceRange[0])}</span>
            <span>{currencyFormatter.format(priceRange[1])}</span>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <input
              type="range"
              min="80"
              max="2000"
              step="20"
              value={priceRange[0]}
              onChange={(event) => {
                const next = Number(event.target.value);
                setPriceRange(([_, max]) => [Math.min(next, max - 20), max]);
              }}
            />
            <input
              type="range"
              min="80"
              max="2000"
              step="20"
              value={priceRange[1]}
              onChange={(event) => {
                const next = Number(event.target.value);
                setPriceRange(([min]) => [min, Math.max(next, min + 20)]);
              }}
            />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Sizes</p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {sizeOptions.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleArrayValue(size, setSelectedSizes)}
                  className={`rounded-2xl border px-3 py-3 text-sm font-semibold ${
                    isSelected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Highlights</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {highlightOptions.map((highlight) => {
              const isSelected = selectedHighlights.includes(highlight);
              return (
                <button
                  key={highlight}
                  type="button"
                  onClick={() => toggleArrayValue(highlight, setSelectedHighlights)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${
                    isSelected ? 'bg-primary-600 text-white' : 'bg-slate-900/5 text-slate-600'
                  }`}
                >
                  {highlight}
                </button>
              );
            })}
          </div>
        </div>
      </MobileSheet>
    );
  };

  const renderSortSheet = () => {
    if (activeSheet !== 'sort') return null;
    return (
      <MobileSheet title="Sort" onClose={() => setActiveSheet(null)}>
        <div className="flex flex-col gap-2">
          {sortOptions.map((option) => {
            const isSelected = option.id === sortOption;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setSortOption(option.id);
                  setActiveSheet(null);
                }}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-base font-semibold ${
                  isSelected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-700'
                }`}
              >
                {option.label}
                {isSelected && <CheckIcon className="h-5 w-5" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </MobileSheet>
    );
  };

  const renderColorSheet = () => {
    if (activeSheet !== 'color') return null;
    return (
      <MobileSheet
        title="Colour focus"
        onClose={() => setActiveSheet(null)}
        footer={
          <button
            type="button"
            onClick={() => setSelectedColors([])}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
          >
            Clear colours
          </button>
        }
      >
        <div className="grid grid-cols-3 gap-4">
          {colorOptions.map((color) => {
            const isSelected = selectedColors.includes(color);
            return (
              <button
                key={color}
                type="button"
                onClick={() => toggleArrayValue(color, setSelectedColors)}
                className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-sm font-semibold ${
                  isSelected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-600'
                }`}
              >
                <span className={`h-10 w-10 rounded-full ${getColorSwatchClass(color)} ring-1 ring-black/10`} />
                {color}
              </button>
            );
          })}
        </div>
      </MobileSheet>
    );
  };

  return (
    <Fragment>
      <section className="space-y-8 pb-16" aria-label="Mobile marketplace home">
        <div className="rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-400">F•S TATES</p>
              <p className="text-xl font-semibold text-slate-900">Curated market</p>
            </div>
            <button
              type="button"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700"
              aria-label="View bag"
            >
              <ShoppingBagIcon className="h-5 w-5" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary-600 px-1 text-[0.6rem] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
          <label className="mt-5 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-inner shadow-slate-200/40 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-200">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              placeholder="Search products, brands..."
            />
          </label>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {audiences.map((audience) => {
              const isActive = audience.id === activeAudience;
              return (
                <button
                  key={audience.id}
                  type="button"
                  onClick={() => setActiveAudience(audience.id)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${
                    isActive ? 'bg-slate-900 text-white' : 'bg-slate-900/5 text-slate-600'
                  }`}
                >
                  {audience.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-500">Hero highlights</p>
              <h2 className="text-2xl font-semibold text-slate-900">Swipe the seasonal edit</h2>
            </div>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500"
              onClick={() => {
                trackEvent('support_contact_opened', {
                  screen: 'mobile_marketplace',
                  properties: { entry_point: 'marketplace' }
                });
                openSupportChat();
              }}
            >
              Help
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-1">
            {heroSlides.map((slide) => (
              <article
                key={slide.id}
                className={`relative h-64 w-64 flex-shrink-0 overflow-hidden rounded-[28px] bg-gradient-to-br ${slide.accent} p-5 text-white shadow-[0_20px_45px_rgba(15,23,42,0.35)]`}
              >
                <div className="flex h-full flex-col">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">Seasonal drop</p>
                  <h3 className="mt-3 text-2xl font-semibold">{slide.title}</h3>
                  <p className="mt-2 text-sm text-white/80">{slide.description}</p>
                  <div className="mt-auto flex items-center gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white backdrop-blur"
                      onClick={() => {
                        if (slide.categorySlug) {
                          handleCategorySelect(slide.categorySlug);
                        } else if (slide.productId) {
                          handleViewMessages();
                        }
                      }}
                    >
                      {slide.button}
                      <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                {slide.image && (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="pointer-events-none absolute inset-y-6 right-4 h-2/3 w-28 rounded-3xl object-cover opacity-80"
                  />
                )}
              </article>
            ))}
          </div>
        </div>

        <div
          className={`rounded-[32px] border border-white/80 bg-white/95 p-4 shadow-[0_20px_45px_rgba(15,23,42,0.12)] transition ${
            categoryFlash ? 'ring-2 ring-primary-200' : ''
          }`}
        >
          <div className="flex items-center justify-between px-1 pb-3">
            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-500">Categories</p>
              <h3 className="text-lg font-semibold text-slate-900">Tap a table</h3>
            </div>
            {selectedCategory && (
              <button
                type="button"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600"
                onClick={() => setSelectedCategory(null)}
              >
                Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {marketplaceCategories.slice(0, 6).map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() => handleCategorySelect(category.slug)}
                className={`flex h-32 flex-col justify-between rounded-3xl border px-4 py-3 text-left ${
                  selectedCategory === category.slug
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-900'
                }`}
              >
                <span className="text-sm font-semibold">{category.title}</span>
                <p className="text-xs text-slate-500">{category.subtitle}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-dashed border-primary-200/60 bg-primary-50/40 p-5 text-sm text-slate-700">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-600">
            <SparklesIcon className="h-4 w-4" aria-hidden="true" />
            Post-purchase inbox
          </div>
          <p className="mt-2 text-base font-semibold text-slate-900">Orders drop messages straight into Chat.</p>
          <p className="mt-1 text-sm text-slate-600">View access codes, delivery notes, and support threads after checkout.</p>
          {latestOrder && (
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">
              Latest: #{latestOrder.id.slice(-4).toUpperCase()} · {orderStatusLabels[latestOrder.status] ?? latestOrder.status}
            </p>
          )}
          <button
            type="button"
            onClick={handleViewMessages}
            disabled={ordersLoading}
            className={`mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.35em] text-white ${
              ordersLoading ? 'cursor-wait bg-slate-400' : 'bg-slate-900'
            }`}
          >
            {ordersLoading ? 'Loading' : 'View messages'}
            <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <section ref={feedSectionRef} className="space-y-4">
          <div className="sticky top-20 z-20 -mx-4 px-4">
            <div className="rounded-3xl border border-slate-200 bg-white/95 px-4 py-3 shadow-[0_15px_35px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600"
                  onClick={() => {
                    trackEvent('marketplace_filters_opened', {
                      screen: 'mobile_marketplace',
                      properties: { source: 'filters_bar' }
                    });
                    setActiveSheet('filters');
                  }}
                >
                  <FunnelIcon className="h-4 w-4" aria-hidden="true" />
                  Filters
                </button>
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600"
                  onClick={() => setActiveSheet('sort')}
                >
                  <ArrowRightIcon className="h-4 w-4 rotate-90" aria-hidden="true" />
                  Sort
                </button>
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600"
                  onClick={() => setActiveSheet('color')}
                >
                  <SwatchIcon className="h-4 w-4" aria-hidden="true" />
                  Colour
                </button>
              </div>
            </div>
          </div>

          {filterChips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filterChips.map((chip) => (
                <FilterChip
                  key={chip.id}
                  label={chip.label}
                  onRemove={() => {
                    if (chip.id === 'category') setSelectedCategory(null);
                    if (chip.id === 'color') setSelectedColors([]);
                    if (chip.id === 'sizes') setSelectedSizes([]);
                    if (chip.id === 'highlights') setSelectedHighlights([]);
                    if (chip.id === 'sort') setSortOption('newest');
                  }}
                />
              ))}
            </div>
          )}

          <div className="space-y-4">
            {loading && visibleProducts.length === 0 ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-72 animate-pulse rounded-3xl bg-white/60" />
              ))
            ) : visibleProducts.length > 0 ? (
              visibleProducts.map((product) => (
                <ProductListItem key={product.id} product={product} onRequireProfile={handleRequireProfile} />
              ))
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-center text-sm text-slate-600">
                No pieces match your filters yet. Try adjusting the sliders or audiences.
              </div>
            )}
          </div>
          {canLoadMore && (
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + 4)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
            >
              Load more
            </button>
          )}
        </section>
      </section>

      {renderFilterSheet()}
      {renderSortSheet()}
      {renderColorSheet()}
    </Fragment>
  );
}
