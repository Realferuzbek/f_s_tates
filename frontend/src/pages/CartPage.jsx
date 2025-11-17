import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const formatTitleCase = (value) => value.replace(/\b\w/g, (char) => char.toUpperCase());

export default function CartPage() {
  const { items, updateItem, cartTotal } = useCart();
  const { t } = useLanguage();

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">{t('Your edit')}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {t('Review the pieces in your bag. Quantities update in real time and inventory reflects current availability.')}
        </p>
      </header>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-sm text-slate-500">
          {t('cart.emptyLead')}{' '}
          <Link to="/" className="font-medium text-primary-600 hover:text-primary-500">
            {t('cart.emptyCta')}
          </Link>{' '}
          {t('cart.emptyTrail')}
        </div>
      ) : (
        <div className="grid gap-6">
          <ul className="grid gap-4">
            {items.map((item) => {
              const stock =
                typeof item.product.inventory === 'number'
                  ? item.product.inventory
                  : item.product.inventory?.quantity;
              return (
                <li
                  key={item.lineKey ?? item.product.id}
                  className="grid gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5 sm:grid-cols-[160px_1fr_140px] sm:items-center"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-xl bg-slate-100">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-500">{t('No image')}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                        {item.product.brand ?? 'F-S Tates Studio'}
                      </p>
                      <p className="text-lg font-semibold text-slate-900">{item.product.name}</p>
                    </div>
                    <p className="text-sm text-slate-600">{item.product.shortDescription ?? item.product.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      {item.selectedSize && <span>{t('cart.sizeLabel', { size: item.selectedSize.toUpperCase() })}</span>}
                      {item.selectedColor && <span>{formatTitleCase(item.selectedColor)}</span>}
                      <span>${item.product.price.toFixed(2)}</span>
                      <span>{stock ? t('cart.stockLabel', { count: stock }) : t('Limited availability')}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <label className="text-sm text-slate-600" htmlFor={`qty-${item.lineKey}`}>
                      {t('Qty')}
                    </label>
                    <input
                      id={`qty-${item.lineKey}`}
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(event) => {
                        const next = Number(event.target.value);
                        updateItem(item.lineKey, Number.isNaN(next) ? 0 : Math.max(0, next));
                      }}
                      className="w-20 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{t('Subtotal (before duties & shipping)')}</p>
              <p className="text-2xl font-semibold text-slate-900">${cartTotal.toFixed(2)}</p>
            </div>
            <Link
              to="/checkout"
              className="inline-flex items-center justify-center rounded-full bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:-translate-y-0.5 hover:bg-primary-500"
            >
              {t('Proceed to checkout')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
