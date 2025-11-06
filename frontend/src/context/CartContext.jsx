import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import apiClient from '../utils/apiClient.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const authToken = token();
        if (!authToken) {
          setItems([]);
          return;
        }
        const response = await apiClient.get('/cart', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setItems(response.data.items || []);
      } catch (error) {
        console.error('Failed to load cart', error);
      }
    };
    fetchCart();
  }, [token]);

  const syncCart = async (updatedItems) => {
    setItems(updatedItems);
    try {
      const authToken = token();
      if (!authToken) {
        return;
      }
      await apiClient.put(
        '/cart',
        { items: updatedItems.map(({ productId, product, quantity }) => ({ productId: productId ?? product.id, quantity })) },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
    } catch (error) {
      console.error('Failed to sync cart', error);
    }
  };

  const addItem = (product, quantity = 1) => {
    const existing = items.find((item) => item.product.id === product.id);
    const nextItems = existing
      ? items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...items, { productId: product.id, product, quantity }];
    syncCart(nextItems);
  };

  const updateItem = (productId, quantity) => {
    const nextItems = items
      .map((item) => (item.product.id === productId ? { ...item, productId, quantity } : item))
      .filter((item) => item.quantity > 0);
    syncCart(nextItems);
  };

  const clearCart = () => {
    syncCart([]);
  };

  const cartTotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const value = useMemo(
    () => ({ items, addItem, updateItem, clearCart, cartTotal, cartCount }),
    [items, cartTotal, cartCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
