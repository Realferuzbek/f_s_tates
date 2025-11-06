import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../utils/apiClient.js';
import { useAuth } from '../context/AuthContext.jsx';

const formatTitleCase = (value) => value.replace(/\b\w/g, (char) => char.toUpperCase());

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const successMessage = location.state?.message;

  useEffect(() => {
    apiClient
      .get('/orders', {
        headers: { Authorization: `Bearer ${token()}` }
      })
      .then((response) => setOrders(response.data.orders))
      .catch((error) => console.error('Failed to load orders', error));
  }, [token]);

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Order history</h1>
        <p className="mt-2 text-sm text-slate-600">Track your recent purchases and fulfillment status.</p>
      </header>
      {successMessage && (
        <p className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700">{successMessage}</p>
      )}
      <div className="grid gap-4">
        {orders.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
            You have not placed any orders yet.
          </p>
        ) : (
          orders.map((order) => (
            <article key={order.id} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6">
              <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Order #{order.id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-slate-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} • Status {order.status}
                  </p>
                </div>
                <p className="text-lg font-semibold text-slate-900">${order.total.toFixed(2)}</p>
              </header>
              <ul className="grid gap-2 text-sm text-slate-600">
                {order.items.map((item) => {
                  const details = [];
                  if (item.selectedSize) {
                    details.push(`Size ${item.selectedSize.toUpperCase()}`);
                  }
                  if (item.selectedColor) {
                    details.push(formatTitleCase(item.selectedColor));
                  }
                  details.push(`Qty ${item.quantity}`);
                  return (
                    <li key={item.id} className="flex items-center justify-between">
                      <span>
                        {item.product?.name ?? 'Archived product'}
                        <span className="ml-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                          {details.join(' • ')}
                        </span>
                      </span>
                      <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
