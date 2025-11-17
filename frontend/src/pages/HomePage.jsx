import useCuratedProducts from '../hooks/useCuratedProducts.js';
import useIsMobile from '../hooks/useIsMobile.js';
import HeroShowcase from '../components/HeroShowcase.jsx';
import ProductCarousel from '../components/ProductCarousel.jsx';
import MarketplaceTable from '../components/MarketplaceTable.jsx';
import { marketplaceCategories } from '../data/marketplaceCategories.js';
import MobileMarketplacePanel from '../components/mobile/MobileMarketplacePanel.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function HomePage() {
  const isMobile = useIsMobile();
  const { data: curated, loading: curatedLoading } = useCuratedProducts();
  const { t } = useLanguage();

  if (isMobile) {
    return <MobileMarketplacePanel curatedData={curated} />;
  }

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
          title={t('New this week')}
          subtitle={t('Fresh silhouettes hand-picked by our buyers.')}
          products={curated.newArrivals}
        />
      )}
      {!curatedLoading && curated.capsuleEdit.length > 0 && (
        <ProductCarousel
          title={t('Capsule edit')}
          subtitle={t('Build your 10-piece wardrobe with mix-and-match icons.')}
          products={curated.capsuleEdit}
        />
      )}

      {!curatedLoading && curated.statementPieces.length > 0 && (
        <ProductCarousel
          title={t('Statement pieces')}
          subtitle={t('Artisanal releases designed to turn heads at your next event.')}
          products={curated.statementPieces}
          accent="dark"
        />
      )}
    </div>
  );
}
