import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { getColorSwatchClass } from '../utils/palette.js';

function formatTitleCase(value) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function ProductCard({ product, variant = 'default' }) {
  const { addItem } = useCart();
  const colors = (product.colorOptions ?? []).slice(0, 3);
  const badges = (product.badges ?? []).slice(0, 3);
  const onDark = variant === 'on-dark';
  const inventoryCount =
    typeof product.inventory === 'number' ? product.inventory : product.inventory?.quantity;

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border ${
        onDark ? 'border-white/15 bg-white/10 backdrop-blur' : 'border-slate-200 bg-white shadow-sm'
      } transition hover:-translate-y-1 hover:shadow-xl`}
    >
      <Link
        to={`/products/${product.id}`}
        className="relative block h-56 overflow-hidden bg-slate-100"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Image coming soon
          </div>
        )}
        {badges.length > 0 && (
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className={`rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest ${
                  onDark
                    ? 'bg-white/10 text-white'
                    : 'bg-white/90 text-slate-900 shadow'
                }`}
              >
                {formatTitleCase(badge)}
              </span>
            ))}
          </div>
        )}
      </Link>
      <div className={`flex flex-1 flex-col gap-4 p-5 ${onDark ? 'text-white/90' : 'text-slate-900'}`}>
        <div className="space-y-1.5">
          <p className={`text-xs uppercase tracking-[0.3em] ${onDark ? 'text-white/60' : 'text-slate-500'}`}>
            {product.brand ?? 'F-S Tates Studio'}
          </p>
          <Link
            to={`/products/${product.id}`}
            className={`text-lg font-semibold ${onDark ? 'text-white' : 'text-slate-900'}`}
          >
            {product.name}
          </Link>
          <p className={`text-sm leading-relaxed ${onDark ? 'text-white/70' : 'text-slate-600'}`}>
            {product.description}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {colors.length > 0 && (
            <div className="flex items-center gap-1.5">
              {colors.map((color) => (
                <span
                  key={color}
                  className={`h-4 w-4 rounded-full ${getColorSwatchClass(
                    color
                  )} ring-1 ring-black/10`}
                  title={formatTitleCase(color)}
                />
              ))}
            </div>
          )}
          {inventoryCount !== undefined && (
            <span className={`text-xs uppercase tracking-[0.25em] ${onDark ? 'text-white/50' : 'text-slate-400'}`}>
              {inventoryCount > 0 ? `${inventoryCount} in studio` : 'Waitlist'}
            </span>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className={`text-xl font-semibold ${onDark ? 'text-white' : 'text-primary-600'}`}>
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => addItem(product)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              onDark
                ? 'bg-white/90 text-slate-900 hover:bg-white'
                : 'bg-primary-600 text-white hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
            }`}
          >
            Add to bag
          </button>
        </div>
      </div>
    </article>
  );
}
