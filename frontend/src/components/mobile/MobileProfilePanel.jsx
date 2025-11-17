import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import apiClient from '../../utils/apiClient.js';
import useAnalytics from '../../hooks/useAnalytics.js';

const orderStatusLabels = {
  PLACED: 'Placed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

const languageOptions = ['en', 'uz', 'fr'];
const currencyOptions = ['USD', 'UZS', 'EUR'];
const regionOptions = ['United States', 'Uzbekistan', 'United Kingdom'];

function formatMemberSince(date) {
  if (!date) return 'Member';
  return `Member since ${new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
}

function formatExpiry(method) {
  if (!method?.expiresMonth || !method?.expiresYear) {
    return 'Expires soon';
  }
  return `Exp. ${String(method.expiresMonth).padStart(2, '0')}/${String(method.expiresYear).slice(-2)}`;
}

export default function MobileProfilePanel({ promptMessage, onPromptClear, onContactSupport = () => {} }) {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const trackEvent = useAnalytics();
  const [compactHeader, setCompactHeader] = useState(false);
  const [overview, setOverview] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setCompactHeader(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!promptMessage) return undefined;
    const timeout = window.setTimeout(() => onPromptClear?.(), 6000);
    return () => window.clearTimeout(timeout);
  }, [promptMessage, onPromptClear]);

  const buildAuthHeaders = useCallback(() => {
    const authToken = typeof token === 'function' ? token() : null;
    return authToken
      ? {
          Authorization: `Bearer ${authToken}`
        }
      : null;
  }, [token]);

  const hydrateAccount = useCallback(async () => {
    if (!user) {
      return;
    }
    const headers = buildAuthHeaders();
    if (!headers) {
      return;
    }
    setLoading(true);
    try {
      const [meResponse, ordersResponse, addressesResponse, paymentResponse, preferencesResponse] = await Promise.all([
        apiClient.get('/account/me', { headers }),
        apiClient.get('/account/orders', { params: { limit: 3 }, headers }),
        apiClient.get('/account/addresses', { headers }),
        apiClient.get('/account/payment-methods', { headers }),
        apiClient.get('/account/preferences', { headers })
      ]);
      setOverview(meResponse.data);
      setOrders(ordersResponse.data.orders ?? []);
      setAddresses(addressesResponse.data.addresses ?? []);
      setPaymentMethods(paymentResponse.data.paymentMethods ?? []);
      setPreferences(preferencesResponse.data);
      setError(null);
    } catch (err) {
      setError('Unable to load your account right now.');
    } finally {
      setLoading(false);
    }
  }, [buildAuthHeaders, user]);

  useEffect(() => {
    if (!user) {
      setOverview(null);
      setOrders([]);
      setAddresses([]);
      setPaymentMethods([]);
      setPreferences(null);
      return;
    }
    hydrateAccount();
  }, [hydrateAccount, user]);

  const initials = useMemo(() => {
    const source = overview?.name ?? user?.name ?? 'F•S';
    return source.slice(0, 1).toUpperCase();
  }, [overview?.name, user?.name]);

  const ordersPreview = useMemo(() => orders.slice(0, 3), [orders]);

  const handleProtectedNavigation = (href, section) => {
    if (!href) return;
    if (user) {
      if (section) {
        trackEvent('profile_section_opened', {
          screen: 'mobile_profile',
          properties: { section }
        });
      }
      navigate(href);
    } else {
      navigate('/auth');
    }
  };

  const togglePreference = async (field) => {
    if (!preferences?.notificationPreference) return;
    const headers = buildAuthHeaders();
    if (!headers) return;
    const nextValue = !preferences.notificationPreference[field];
    setPreferences((prev) => ({
      ...prev,
      notificationPreference: {
        ...prev.notificationPreference,
        [field]: nextValue
      }
    }));
    try {
      await apiClient.put(
        '/account/preferences',
        {
          [field]: nextValue
        },
        { headers }
      );
      trackEvent('profile_edit_submitted', {
        screen: 'mobile_profile',
        properties: { field }
      });
    } catch {
      hydrateAccount();
    }
  };

  const updateSetting = async (field, options) => {
    if (!preferences?.profileSetting) return;
    const headers = buildAuthHeaders();
    if (!headers) return;
    const current = preferences.profileSetting[field];
    const index = options.indexOf(current);
    const nextValue = options[(index + 1) % options.length];
    setPreferences((prev) => ({
      ...prev,
      profileSetting: {
        ...prev.profileSetting,
        [field]: nextValue
      }
    }));
    try {
      await apiClient.put(
        '/account/preferences',
        {
          [field]: nextValue
        },
        { headers }
      );
      trackEvent('profile_edit_submitted', {
        screen: 'mobile_profile',
        properties: { field }
      });
    } catch {
      hydrateAccount();
    }
  };

  const handleSupport = () => {
    trackEvent('support_contact_opened', {
      screen: 'mobile_profile',
      properties: { entry_point: 'profile' }
    });
    onContactSupport();
  };

  if (!user) {
    return (
      <div className="space-y-6">
        {promptMessage && (
          <div className="rounded-3xl border border-primary-200 bg-primary-50/80 px-4 py-4 text-sm text-primary-700">
            {promptMessage}
          </div>
        )}
        <div className="rounded-[32px] bg-white/95 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.12)]">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-400">Profile</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">Welcome to F•S TATES</h2>
          <p className="mt-2 text-sm text-slate-600">
            Track orders, save edits, manage addresses, and message concierge once you sign in.
          </p>
          <Link
            to="/auth"
            className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.25)]"
          >
            Sign in or create account
          </Link>
        </div>
        <div className="rounded-[32px] border border-dashed border-slate-200 bg-white/80 p-4 text-sm text-slate-500">
          Concierge chat unlocks after checkout. You’ll see shipment updates and access codes inside the Chat tab.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {promptMessage && (
        <div className="rounded-3xl border border-primary-200 bg-primary-50/80 px-4 py-4 text-sm text-primary-700">
          {promptMessage}
        </div>
      )}
      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}
      <div
        className={`rounded-[32px] bg-white/95 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.12)] transition ${
          compactHeader ? 'scale-[0.99]' : ''
        }`}
      >
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-400">Profile</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 text-xl font-semibold text-white">
            {initials}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{overview?.name ?? user.name}</p>
            <p className="text-sm text-slate-500">{overview?.email ?? user.email}</p>
            <p className="text-xs text-slate-400">{formatMemberSince(overview?.createdAt)}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/account"
            className="flex-1 rounded-2xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-600"
          >
            Edit profile
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_15px_30px_rgba(15,23,42,0.28)]"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="rounded-[32px] border border-white/80 bg-white/95 p-4 shadow-[0_15px_35px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-400">My shopping</p>
          <button
            type="button"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600"
            onClick={() => handleProtectedNavigation('/account/orders', 'my_shopping')}
          >
            View all
          </button>
        </div>
        {loading && orders.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Loading your recent orders…</p>
        ) : ordersPreview.length > 0 ? (
          <div className="mt-3 space-y-3">
            {ordersPreview.map((order) => (
              <div key={order.id} className="rounded-2xl border border-slate-200 px-3 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Order #{order.id.slice(-4).toUpperCase()}
                    </p>
                    <p className="text-sm text-slate-600">{order.items?.[0]?.product?.name ?? 'Curated order'}</p>
                  </div>
                  <span className="rounded-full bg-slate-900/5 px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-slate-600">
                    {orderStatusLabels[order.status] ?? order.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-2xl border border-dashed border-slate-200 px-3 py-3 text-sm text-slate-500">
            Complete checkout to see your order history and delivery timeline.
          </p>
        )}
      </div>

      <div className="rounded-[32px] border border-white/80 bg-white/95 p-4 shadow-[0_15px_35px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-400">Addresses</p>
          <button
            type="button"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600"
            onClick={() => handleProtectedNavigation('/account', 'addresses')}
          >
            Manage
          </button>
        </div>
        {addresses.length > 0 ? (
          <div className="mt-3 space-y-3">
            {addresses.map((address) => (
              <div key={address.id} className="rounded-2xl border border-slate-200 px-3 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{address.label}</p>
                  {address.isDefaultShipping && (
                    <span className="text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-primary-500">Default</span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.country}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-2xl border border-dashed border-slate-200 px-3 py-3 text-sm text-slate-500">
            Add your residence or pied-à-terre to speed up concierge delivery.
          </p>
        )}
      </div>

      <div className="rounded-[32px] border border-white/80 bg-white/95 p-4 shadow-[0_15px_35px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-400">Payment methods</p>
          <button
            type="button"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600"
            onClick={() => handleProtectedNavigation('/account', 'payments')}
          >
            Manage
          </button>
        </div>
        {paymentMethods.length > 0 ? (
          <div className="mt-3 space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="rounded-2xl border border-slate-200 px-3 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">
                    {method.brand ?? method.provider} ·••• {method.last4}
                  </p>
                  {method.isDefault && (
                    <span className="text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-primary-500">Default</span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{formatExpiry(method)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-2xl border border-dashed border-slate-200 px-3 py-3 text-sm text-slate-500">
            Save a card for concierge checkout and expedited orders.
          </p>
        )}
      </div>

      <div className="rounded-[32px] border border-white/80 bg-white/95 p-4 shadow-[0_15px_35px_rgba(15,23,42,0.08)]">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-400">Notifications & preferences</p>
        {preferences ? (
          <div className="mt-4 space-y-4">
            {[
              { id: 'orderUpdatesEmail', label: 'Order updates (email)', description: 'Milestones delivered to your inbox' },
              { id: 'orderUpdatesPush', label: 'Order updates (push)', description: 'Push alerts for each courier update' },
              { id: 'promotionsEmail', label: 'Editorial promos (email)', description: 'Seasonal capsules & styling notes' },
              { id: 'promotionsPush', label: 'Editorial promos (push)', description: 'Rare drops & limited access pings' }
            ].map((toggle) => (
              <div key={toggle.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-3 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{toggle.label}</p>
                  <p className="text-xs text-slate-500">{toggle.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => togglePreference(toggle.id)}
                  role="switch"
                  aria-checked={preferences.notificationPreference?.[toggle.id]}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                    preferences.notificationPreference?.[toggle.id] ? 'bg-slate-900' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 rounded-full bg-white transition ${
                      preferences.notificationPreference?.[toggle.id] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className="rounded-2xl border border-slate-200 px-3 py-3 text-left text-sm font-semibold text-slate-600"
                onClick={() => updateSetting('language', languageOptions)}
              >
                Language <span className="block text-base text-slate-900">{preferences.profileSetting?.language}</span>
              </button>
              <button
                type="button"
                className="rounded-2xl border border-slate-200 px-3 py-3 text-left text-sm font-semibold text-slate-600"
                onClick={() => updateSetting('currency', currencyOptions)}
              >
                Currency <span className="block text-base text-slate-900">{preferences.profileSetting?.currency}</span>
              </button>
              <button
                type="button"
                className="rounded-2xl border border-slate-200 px-3 py-3 text-left text-sm font-semibold text-slate-600"
                onClick={() => updateSetting('region', regionOptions)}
              >
                Region <span className="block text-base text-slate-900">{preferences.profileSetting?.region}</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">Loading your notification preferences…</p>
        )}
      </div>

      <div className="rounded-[32px] border border-white/80 bg-white/95 p-4 shadow-[0_15px_35px_rgba(15,23,42,0.08)]">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-400">Support</p>
        <div className="mt-3 space-y-3">
          <Link
            to="/support"
            className="block rounded-2xl border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-600"
          >
            Help center / FAQ
          </Link>
          <button
            type="button"
            onClick={handleSupport}
            className="w-full rounded-2xl bg-slate-900 px-3 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.25)]"
          >
            Contact support
          </button>
        </div>
      </div>

      <div className="rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-primary-700 p-5 text-white shadow-[0_25px_45px_rgba(15,23,42,0.35)]">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/60">Concierge</p>
        <p className="mt-2 text-lg font-semibold">Need something tailored?</p>
        <p className="mt-2 text-sm text-white/80">Tap “Contact support” for a dedicated thread in Chat.</p>
      </div>

      <div className="rounded-[32px] border border-dashed border-slate-200 bg-white/80 p-4 text-xs text-slate-500">
        <p>Log out removes sensitive info from this device. Re-authenticate to unlock saved payments.</p>
        <p className="mt-2">App build 1.9.0 · Terms · Privacy</p>
      </div>
    </div>
  );
}
