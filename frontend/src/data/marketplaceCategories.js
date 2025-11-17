import { SparklesIcon, FireIcon, CloudIcon, Squares2X2Icon, SwatchIcon, BeakerIcon, GlobeAltIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';

export const marketplaceCategories = [
  {
    title: 'Boot Atelier',
    subtitle: 'Sculpted boots in vegetable-tanned hides',
    slug: 'boots',
    label: 'FOOTWEAR',
    meta: 'From $220 · Ready in 48h',
    tags: ['Handcrafted', 'Limited run'],
    filters: ['ready72', 'worldwide', 'fittings', 'live'],
    accentClass: 'from-rose-50 via-amber-50 to-white',
    Icon: SparklesIcon,
    imageUrl: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Scarves & Wraps',
    subtitle: 'Featherlight silks and seasonless cashmere',
    slug: 'scarves',
    label: 'ACCESSORIES',
    meta: 'From $140 · Worldwide shipping',
    tags: ['Featherlight', 'Seasonless'],
    filters: ['worldwide', 'sustainable'],
    accentClass: 'from-slate-50 via-white to-emerald-50/60',
    Icon: CloudIcon,
    imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Coats & Jackets',
    subtitle: 'Architected silhouettes for every climate',
    slug: 'coats-jackets',
    label: 'OUTERWEAR',
    meta: 'From $360 · Ready in 72h',
    tags: ['Climate-smart', 'Structured'],
    filters: ['ready72', 'live'],
    accentClass: 'from-blue-50 via-indigo-50 to-white',
    Icon: Squares2X2Icon,
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Dresses',
    subtitle: 'Gallery-worthy gowns and day dresses',
    slug: 'dresses',
    label: 'DRESSES',
    meta: 'From $280 · Private fittings',
    tags: ['Evening', 'Made to order'],
    filters: ['fittings'],
    accentClass: 'from-fuchsia-50 via-rose-50 to-white',
    Icon: FireIcon,
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Knitwear',
    subtitle: 'Regenerative alpaca and cloud-soft cashmere',
    slug: 'knitwear',
    label: 'KNITWEAR',
    meta: 'From $190 · Regenerative fibres',
    tags: ['Soft touch', 'Sustainable'],
    filters: ['sustainable'],
    accentClass: 'from-amber-50 via-white to-slate-50',
    Icon: SwatchIcon,
    imageUrl: 'https://images.unsplash.com/photo-1490111718993-d98654ce6cf7?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Bags & Accessories',
    subtitle: 'Hand-woven totes and precision hardware',
    slug: 'bags-accessories',
    label: 'BAGS & ACCESSORIES',
    meta: 'From $90 · Worldwide dispatch',
    tags: ['Artisanal', 'Everyday'],
    filters: ['worldwide', 'live'],
    accentClass: 'from-emerald-50 via-white to-lime-50',
    Icon: GlobeAltIcon,
    imageUrl: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Tailored Tops',
    subtitle: 'Architected shirting with couture finishes',
    slug: 'tops',
    label: 'TAILORING',
    meta: 'From $210 · Complimentary tailoring',
    tags: ['Precise fit', 'Ready in 72h'],
    filters: ['ready72', 'fittings'],
    accentClass: 'from-slate-50 via-slate-100 to-white',
    Icon: BeakerIcon,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Trousers & Skirts',
    subtitle: 'Fluid pleats and precision tailoring',
    slug: 'trousers-skirts',
    label: 'EDITORIAL',
    meta: 'From $180 · Worldwide delivery',
    tags: ['Fluid pleats', 'Limited stock'],
    filters: ['worldwide', 'ready72'],
    accentClass: 'from-purple-50 via-white to-rose-50',
    Icon: CubeTransparentIcon,
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'
  }
];

export const getCategoryBySlug = (slug) => marketplaceCategories.find((category) => category.slug === slug);
