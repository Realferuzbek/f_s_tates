import { SparklesIcon, FireIcon, CloudIcon, Squares2X2Icon, SwatchIcon, BeakerIcon, GlobeAltIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';

export const marketplaceCategories = [
  {
    title: 'Boot Atelier',
    subtitle: 'Sculpted boots in vegetable-tanned hides',
    slug: 'boots',
    accentClass: 'from-rose-50 via-amber-50 to-white',
    Icon: SparklesIcon
  },
  {
    title: 'Scarves & Wraps',
    subtitle: 'Featherlight silks and seasonless cashmere',
    slug: 'scarves',
    accentClass: 'from-slate-50 via-white to-emerald-50/60',
    Icon: CloudIcon
  },
  {
    title: 'Coats & Jackets',
    subtitle: 'Architected silhouettes for every climate',
    slug: 'coats-jackets',
    accentClass: 'from-blue-50 via-indigo-50 to-white',
    Icon: Squares2X2Icon
  },
  {
    title: 'Dresses',
    subtitle: 'Gallery-worthy gowns and day dresses',
    slug: 'dresses',
    accentClass: 'from-fuchsia-50 via-rose-50 to-white',
    Icon: FireIcon
  },
  {
    title: 'Knitwear',
    subtitle: 'Regenerative alpaca and cloud-soft cashmere',
    slug: 'knitwear',
    accentClass: 'from-amber-50 via-white to-slate-50',
    Icon: SwatchIcon
  },
  {
    title: 'Bags & Accessories',
    subtitle: 'Hand-woven totes and precision hardware',
    slug: 'bags-accessories',
    accentClass: 'from-emerald-50 via-white to-lime-50',
    Icon: GlobeAltIcon
  },
  {
    title: 'Tailored Tops',
    subtitle: 'Architected shirting with couture finishes',
    slug: 'tops',
    accentClass: 'from-slate-50 via-slate-100 to-white',
    Icon: BeakerIcon
  },
  {
    title: 'Trousers & Skirts',
    subtitle: 'Fluid pleats and precision tailoring',
    slug: 'trousers-skirts',
    accentClass: 'from-purple-50 via-white to-rose-50',
    Icon: CubeTransparentIcon
  }
];

export const getCategoryBySlug = (slug) => marketplaceCategories.find((category) => category.slug === slug);