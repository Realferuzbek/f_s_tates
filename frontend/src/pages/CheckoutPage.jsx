import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import apiClient from '../utils/apiClient.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      paymentMethod: 'card'
    }
  });

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await apiClient.post(
        '/orders/checkout',
        {
          shippingAddress: {
            fullName: values.fullName,
            address: values.address,
            city: values.city,
            postalCode: values.postalCode
          },
          payment: {
            method: values.paymentMethod
          }
        },
        {
          headers: { Authorization: `Bearer ${token()}` }
        }
      );
      clearCart();
      navigate('/account/orders', { replace: true, state: { message: 'Order placed successfully!' } });
    } catch (error) {
      console.error('Failed to complete checkout', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section className="grid gap-6">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">Checkout</h1>
          <p className="mt-2 text-sm text-slate-600">Provide your shipping and payment information.</p>
        </header>
        <form className="grid gap-6 rounded-xl border border-slate-200 bg-white p-6" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="grid gap-4">
            <legend className="text-lg font-semibold text-slate-900">Shipping address</legend>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-slate-700">Full name</span>
              <input
                type="text"
                {...register('fullName', { required: 'Your name is required' })}
                className="rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
              {errors.fullName && <span className="text-xs text-red-600">{errors.fullName.message}</span>}
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-slate-700">Street address</span>
              <input
                type="text"
                {...register('address', { required: 'Your address is required' })}
                className="rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
              {errors.address && <span className="text-xs text-red-600">{errors.address.message}</span>}
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-slate-700">City</span>
                <input
                  type="text"
                  {...register('city', { required: 'City is required' })}
                  className="rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
                {errors.city && <span className="text-xs text-red-600">{errors.city.message}</span>}
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-slate-700">Postal code</span>
                <input
                  type="text"
                  {...register('postalCode', { required: 'Postal code is required' })}
                  className="rounded-md border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
                {errors.postalCode && <span className="text-xs text-red-600">{errors.postalCode.message}</span>}
              </label>
            </div>
          </fieldset>
          <fieldset className="grid gap-4">
            <legend className="text-lg font-semibold text-slate-900">Payment</legend>
            <label className="flex items-center gap-3 rounded-md border border-slate-200 p-3 text-sm">
              <input
                type="radio"
                value="card"
                {...register('paymentMethod', { required: true })}
                className="h-4 w-4 border-slate-300 text-primary-600 focus:ring-primary-600"
              />
              <div>
                <p className="font-medium text-slate-800">Credit or debit card</p>
                <p className="text-xs text-slate-500">Secured via Stripe test mode</p>
              </div>
            </label>
            <label className="flex items-center gap-3 rounded-md border border-slate-200 p-3 text-sm">
              <input
                type="radio"
                value="paypal"
                {...register('paymentMethod', { required: true })}
                className="h-4 w-4 border-slate-300 text-primary-600 focus:ring-primary-600"
              />
              <div>
                <p className="font-medium text-slate-800">PayPal</p>
                <p className="text-xs text-slate-500">Redirect to PayPal sandbox</p>
              </div>
            </label>
          </fieldset>
          <button
            type="submit"
            disabled={submitting || items.length === 0}
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {submitting ? 'Processing…' : 'Place order'}
          </button>
        </form>
      </section>
      <aside className="grid gap-4 self-start rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
        <ul className="grid gap-3 text-sm text-slate-600">
          {items.map((item) => (
            <li key={item.product.id} className="flex items-center justify-between">
              <span>
                {item.product.name}
                <span className="sr-only"> quantity </span>
                <span aria-hidden="true"> × {item.quantity}</span>
              </span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between text-base font-semibold text-slate-900">
          <span>Total</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
      </aside>
    </div>
  );
}
