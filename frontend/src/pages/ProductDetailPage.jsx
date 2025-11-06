import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    apiClient
      .get(`/products/${productId}`)
      .then((response) => setProduct(response.data.product))
      .catch((err) => setError(err));
  }, [productId]);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Unable to load this product. Please try again later.
      </div>
    );
  }

  if (!product) {
    return (
      <div className="grid h-64 place-items-center rounded-xl border border-dashed border-slate-300 bg-white">
        <p className="text-sm text-slate-500">Loading product details…</p>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section aria-labelledby="product-gallery" className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 id="product-gallery" className="sr-only">
          Product gallery
        </h2>
        <div className="aspect-square overflow-hidden rounded-lg bg-slate-100">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Image coming soon
            </div>
          )}
        </div>
      </section>
      <section aria-labelledby="product-info" className="grid gap-6">
        <div>
          <p className="text-sm font-medium text-primary-600">{product.category?.name}</p>
          <h1 id="product-info" className="mt-2 text-3xl font-semibold text-slate-900">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-slate-600">{product.shortDescription}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-2xl font-semibold text-primary-600">${product.price.toFixed(2)}</p>
          <p className="mt-2 text-sm text-slate-600">
            {product.inventory?.quantity > 0 ? `${product.inventory.quantity} in stock` : 'Out of stock'}
          </p>
          <button
            onClick={() => addItem(product)}
            className="mt-4 w-full rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Add to cart
          </button>
        </div>
        <div className="grid gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Details</h2>
          <p className="text-sm leading-relaxed text-slate-600">{product.description}</p>
          <dl className="grid gap-2 text-sm text-slate-600">
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium text-slate-500">SKU</dt>
              <dd>{product.sku}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium text-slate-500">Brand</dt>
              <dd>{product.brand}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium text-slate-500">Tags</dt>
              <dd>{product.tags?.join(', ')}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
