import { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient.js';

const initialState = {
  hero: null,
  newArrivals: [],
  capsuleEdit: [],
  statementPieces: []
};

export default function useCuratedProducts() {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    apiClient
      .get('/products/curated')
      .then((response) => {
        if (!isCancelled) {
          setData(response.data);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(err);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  return { data, loading, error };
}
