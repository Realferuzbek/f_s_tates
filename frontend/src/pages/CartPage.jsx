import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function CartPage() {
  const { items, updateItem, cartTotal } = useCart();

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Your cart</h1>
        <p className="mt-2 text-sm text-slate-600">Review the items you plan to purchase.</p>
      </header>
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          Your cart is empty. <Link to="/" className="text-primary-600 hover:text-primary-500">Browse products</Link> to find something you love.
        </div>
      ) : (
        <div className="grid gap-6">
          <ul className="grid gap-4">
            {items.map((item) => (
              <li key={item.product.id} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-[120px_1fr_140px] sm:items-center">
                <div className="aspect-square overflow-hidden rounded-lg bg-slate-100">
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-500">No image</div>
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">{item.product.name}</p>
                  <p className="mt-1 text-sm text-slate-500">${item.product.price.toFixed(2)}</p>
                  <p className="mt-1 text-xs text-slate-500">{(item.product.inventory?.quantity ?? item.product.inventory ?? 0)} available</p>
                </div>
                <div className="flex items-center gap-2 sm:justify-end">
                  <label className="text-sm text-slate-600" htmlFor={`qty-${item.product.id}`}>
                    Qty
                  </label>
                  <input
                    id={`qty-${item.product.id}`}
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(event) => {
                      const next = Number(event.target.value);
                      updateItem(item.product.id, Number.isNaN(next) ? 0 : Math.max(0, next));
                    }}
                    className="w-20 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Subtotal</p>
              <p className="text-2xl font-semibold text-slate-900">${cartTotal.toFixed(2)}</p>
            </div>
            <Link
              to="/checkout"
              className="rounded-md bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Proceed to checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
