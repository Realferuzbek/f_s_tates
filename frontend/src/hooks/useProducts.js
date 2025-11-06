import { useEffect, useMemo, useState } from 'react';
import apiClient from '../utils/apiClient.js';

export default function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    apiClient
      .get('/products', { params: filters, signal: controller.signal })
      .then((response) => setProducts(response.data.products))
      .catch((err) => {
        if (err.name !== 'CanceledError') {
          setError(err);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [JSON.stringify(filters)]);

  const summaries = useMemo(
    () =>
      products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.shortDescription,
        image: product.image,
        category: product.category?.name,
        inventory: product.inventory?.quantity ?? 0,
        rating: product.rating
      })),
    [products]
  );

  return { products: summaries, raw: products, loading, error };
}
