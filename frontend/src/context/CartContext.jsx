import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import apiClient from '../utils/apiClient.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

const buildLineKey = (productId, size, color) =>
  [productId, (size ?? '').toLowerCase(), (color ?? '').toLowerCase()].join('::');

const enhanceCartItem = (rawItem) => {
  const product = rawItem.product ?? rawItem.productData;
  const productId = rawItem.productId ?? product?.id;
  return {
    ...rawItem,
    product,
    productId,
    lineKey: buildLineKey(productId, rawItem.selectedSize, rawItem.selectedColor)
  };
};

const toPayload = (item) => ({
  productId: item.productId ?? item.product?.id,
  quantity: item.quantity,
  selectedSize: item.selectedSize ?? null,
  selectedColor: item.selectedColor ?? null
});

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
        const fetchedItems =
          response.data.items?.map((item) => enhanceCartItem({ ...item, product: item.product })) ?? [];
        setItems(fetchedItems);
      } catch (error) {
        console.error('Failed to load cart', error);
      }
    };
    fetchCart();
  }, [token]);

  const pushToServer = async (lineItems) => {
    const authToken = token();
    if (!authToken) {
      return;
    }
    try {
      const response = await apiClient.put(
        '/cart',
        { items: lineItems.map(toPayload) },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      const serverItems =
        response.data.items?.map((item) => enhanceCartItem({ ...item, product: item.product })) ?? [];
      setItems(serverItems);
    } catch (error) {
      console.error('Failed to sync cart', error);
    }
  };

  const syncCart = (nextItems) => {
    setItems(nextItems);
    pushToServer(nextItems);
  };

  const addItem = (product, { quantity = 1, size, color } = {}) => {
    const lineKey = buildLineKey(product.id, size, color);
    const existing = items.find((item) => item.lineKey === lineKey);
    const sanitizedQty = Math.max(1, Number(quantity) || 1);
    let nextItems;

    if (existing) {
      nextItems = items.map((item) =>
        item.lineKey === lineKey
          ? { ...item, quantity: item.quantity + sanitizedQty }
          : item
      );
    } else {
      const newItem = enhanceCartItem({
        product,
        productId: product.id,
        quantity: sanitizedQty,
        selectedSize: size,
        selectedColor: color
      });
      nextItems = [...items, newItem];
    }
    syncCart(nextItems);
  };

  const updateItem = (lineKey, quantity) => {
    const parsed = Math.max(0, Number(quantity) || 0);
    const nextItems = items
      .map((item) => (item.lineKey === lineKey ? { ...item, quantity: parsed } : item))
      .filter((item) => item.quantity > 0);
    syncCart(nextItems);
  };

  const clearCart = () => {
    syncCart([]);
  };

  const cartTotal = useMemo(
    () => items.reduce((total, item) => total + (item.product?.price ?? 0) * item.quantity, 0),
    [items]
  );
  const cartCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        clearCart,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
