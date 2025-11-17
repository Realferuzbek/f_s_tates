import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient.js';
import { useCart } from '../context/CartContext.jsx';
import { getColorSwatchClass } from '../utils/palette.js';
import { useLanguage } from '../context/LanguageContext.jsx';

const formatTitleCase = (value) => value.replace(/\b\w/g, (char) => char.toUpperCase());

export default function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const { addItem } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    apiClient
      .get(`/products/${productId}`)
      .then((response) => setProduct(response.data.product))
      .catch((err) => setError(err));
  }, [productId]);

  useEffect(() => {
    if (!product) return;
    const gallery = [product.heroImage, product.image, ...(product.galleryImages ?? [])].filter(Boolean);
    setSelectedImage(gallery[0] ?? null);
    if (product.sizeOptions?.length && !selectedSize) {
      setSelectedSize(product.sizeOptions[0]);
    }
    if (product.colorOptions?.length && !selectedColor) {
      setSelectedColor(product.colorOptions[0]);
    }
  }, [product]);

  const galleryImages = useMemo(
    () => (product ? [product.heroImage, product.image, ...(product.galleryImages ?? [])].filter(Boolean) : []),
    [product]
  );

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/80 p-6 text-sm text-red-700">
        {t('Unable to load this product. Please try again later.')}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="grid h-64 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white/80">
        <p className="text-sm text-slate-500">{t('Loading product details...')}</p>
      </div>
    );
  }

  const inventoryCount = product.inventory?.quantity ?? 0;
  const requiresSize = product.sizeOptions?.length;
  const requiresColor = product.colorOptions?.length;
  const disableCta = (requiresSize && !selectedSize) || (requiresColor && !selectedColor) || inventoryCount === 0;

  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <section aria-labelledby="product-gallery" className="space-y-5">
        <h2 id="product-gallery" className="text-xs uppercase tracking-[0.3em] text-slate-400">
          {t('Lookbook')}
        </h2>
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-xl">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100">
            {selectedImage ? (
              <img src={selectedImage} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="grid h-full place-items-center text-sm text-slate-500">{t('Editorial image coming soon')}</div>
            )}
          </div>
          {galleryImages.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {galleryImages.map((image) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(image)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border ${
                    selectedImage === image ? 'border-primary-500' : 'border-slate-200'
                  }`}
                  type="button"
                >
                  <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
      <section aria-labelledby="product-info" className="space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-primary-600">
            {product.brand} • {formatTitleCase(t(product.category?.name ?? 'Limited'))}
          </p>
          <h1 id="product-info" className="text-4xl font-semibold text-slate-900">
            {product.name}
          </h1>
          <p className="text-sm leading-relaxed text-slate-600">{product.shortDescription}</p>
          <div className="flex flex-wrap gap-2">
            {(product.badges ?? []).slice(0, 4).map((badge) => (
              <span key={badge} className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
                {formatTitleCase(badge)}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-semibold text-slate-900">${product.price.toFixed(2)}</span>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {inventoryCount > 0 ? `${inventoryCount} pieces available` : 'Join waitlist'}
            </span>
          </div>
          {requiresColor && (
            <fieldset className="space-y-3">
              <legend className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                {t('Colour palette')}
              </legend>
              <div className="flex flex-wrap gap-2">
                {product.colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`group flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      selectedColor === color
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600'
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full ${getColorSwatchClass(color)} ring-1 ring-black/10`}
                      aria-hidden="true"
                    />
                    {formatTitleCase(color)}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          {requiresSize && (
            <fieldset className="space-y-3">
              <legend className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{t('Size')}</legend>
              <div className="flex flex-wrap gap-2">
                {product.sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                      selectedSize === size
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 text-slate-600 hover:border-primary-400 hover:text-primary-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <button
            onClick={() =>
              addItem(product, {
                size: selectedSize || undefined,
                color: selectedColor || undefined
              })
            }
            disabled={disableCta}
            className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-white shadow-lg shadow-slate-900/25 transition hover:-translate-y-0.5 hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {inventoryCount > 0 ? t('Add to bag') : t('Notify me')}
          </button>
          <p className="text-xs text-slate-500">
            {t('Complimentary alterations and express international delivery included with every purchase.')}
          </p>
        </div>

        <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">{t('The story')}</h2>
            <p className="text-sm leading-relaxed text-slate-600">{product.description}</p>
          </div>
          <dl className="grid gap-4 text-sm text-slate-600 md:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{t('SKU')}</dt>
              <dd>{product.sku}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{t('Audience')}</dt>
              <dd>{formatTitleCase(t(product.audience ?? 'Unisex'))}</dd>
            </div>
            {product.fit && (
              <div className="space-y-1">
                <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{t('Fit')}</dt>
                <dd>{product.fit}</dd>
              </div>
            )}
            {product.style && (
              <div className="space-y-1">
                <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{t('Capsule')}</dt>
                <dd>{product.style}</dd>
              </div>
            )}
          </dl>
          <div className="grid gap-4 md:grid-cols-2">
            {product.materials?.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{t('Materials')}</h3>
                <ul className="mt-2 space-y-1">
                  {product.materials.map((material) => (
                    <li key={material} className="text-sm text-slate-600">
                      {formatTitleCase(material)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.care && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{t('Care')}</h3>
                <p className="mt-2 text-sm text-slate-600">{product.care}</p>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{t('Tags')}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {(product.tags ?? []).map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
