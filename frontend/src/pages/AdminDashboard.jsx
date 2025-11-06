import { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    apiClient
      .get('/admin/metrics', {
        headers: { Authorization: `Bearer ${token()}` }
      })
      .then((response) => {
        setMetrics(response.data.metrics);
        setProducts(response.data.products);
      })
      .catch((error) => console.error('Failed to load admin data', error));
  }, [token]);

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Admin dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Monitor store performance, manage inventory levels, and update product visibility.
        </p>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardMetric title="Total revenue" value={metrics?.totalRevenue} prefix="$" />
        <DashboardMetric title="Orders" value={metrics?.orders} />
        <DashboardMetric title="Customers" value={metrics?.customers} />
        <DashboardMetric title="Low inventory" value={metrics?.lowInventory} />
      </section>
      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Product catalog</h2>
            <p className="text-sm text-slate-600">Quickly adjust inventory levels for fast-moving products.</p>
          </div>
          <button className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-primary-300 hover:text-primary-600">
            New product
          </button>
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3">Name</th>
                <th scope="col" className="px-4 py-3">Category</th>
                <th scope="col" className="px-4 py-3">Price</th>
                <th scope="col" className="px-4 py-3">Inventory</th>
                <th scope="col" className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((product) => (
                <tr key={product.id} className="odd:bg-white even:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{product.name}</td>
                  <td className="px-4 py-3 text-slate-600">{product.category?.name}</td>
                  <td className="px-4 py-3 text-slate-600">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-600">{product.inventory?.quantity}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        product.inventory?.quantity > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.inventory?.quantity > 0 ? 'Active' : 'Out of stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function DashboardMetric({ title, value, prefix = '' }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">
        {value !== undefined ? `${prefix}${value}` : '—'}
      </p>
    </div>
  );
}
