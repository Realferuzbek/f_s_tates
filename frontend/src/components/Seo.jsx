import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const FALLBACK_SITE_URL = 'https://fstates.vercel.app';
const DEFAULT_TITLE = 'F-S Tates Marketplace';
const DEFAULT_DESCRIPTION =
  'Discover limited releases from visionary fashion ateliers with concierge service, mindful sourcing, and effortless delivery.';
const DEFAULT_IMAGE_PATH = '/brand-icon.svg';

function withBaseUrl(url, baseUrl) {
  if (!url) return `${baseUrl}${DEFAULT_IMAGE_PATH}`;
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `${baseUrl}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`;
}

export default function Seo({ title = DEFAULT_TITLE, description = DEFAULT_DESCRIPTION, image, noIndex = false }) {
  const { pathname } = useLocation();
  const siteUrl = (import.meta.env.VITE_SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, '');
  const canonicalUrl = `${siteUrl}${pathname || '/'}`;
  const imageUrl = withBaseUrl(image || DEFAULT_IMAGE_PATH, siteUrl);
  const robotsValue = noIndex ? 'noindex,nofollow' : 'index,follow';

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robotsValue} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}
