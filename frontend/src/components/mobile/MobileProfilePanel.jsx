import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const shoppingItems = [
  {
    id: 'orders',
    label: 'My orders',
    description: 'Track purchases and delivery status',
    href: '/account/orders',
    requiresAuth: true
  },
  {
    id: 'saved',
    label: 'Saved items / Wishlist',
    description: 'Favourite edits and lookbooks',
    requiresAuth: true
  },
  {
    id: 'addresses',
    label: 'Addresses',
    description: 'Residences, pied-à-terre, delivery notes',
    comingSoon: true
  },
  {
    id: 'payments',
    label: 'Payment methods',
    description: 'Stored cards and concierge billing',
    comingSoon: true
  }
];

const accountItems = [
  {
    id: 'details',
    label: 'Personal details',
    description: 'Name, measurements, contact info',
    href: '/account',
    requiresAuth: true
  },
  {
    id: 'security',
    label: 'Password & security',
    description: 'Password, 2FA, device approvals',
    requiresAuth: true
  },
  {
    id: 'login',
    label: 'Login methods',
    description: 'Apple ID, Google, concierge access',
    comingSoon: true
  }
];

const preferenceToggles = [
  {
    id: 'orders',
    label: 'Order updates',
    description: 'Push + email alerts for each milestone'
  },
  {
    id: 'edits',
    label: 'Exclusive edits',
    description: 'Stylist drops, capsule guides, concierge notes'
  }
];

export default function MobileProfilePanel({ promptMessage, onPromptClear, onContactSupport = () => {} }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [compactHeader, setCompactHeader] = useState(false);
  const [preferences, setPreferences] = useState({
    orders: true,
    edits: false
  });

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

  const initials = user?.name ? user.name.slice(0, 1).toUpperCase() : 'F•S';

  const togglePreference = (id) => {
    setPreferences((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleProtectedNavigation = (href) => {
    if (!href) return;
    if (user) {
      navigate(href);
    } else {
      navigate('/auth');
    }
  };

  const renderList = (items) =>
    items.map((item) => {
      const disabled = item.requiresAuth && !user;
      const comingSoonLabel = item.comingSoon ? 'Soon' : disabled ? 'Sign in' : 'Open';
      return (
        <button
          key={item.id}
          type="button"
          onClick={() => {
            if (item.comingSoon) return;
            if (item.href) {
              handleProtectedNavigation(item.href);
            } else if (disabled) {
              navigate('/auth');
            }
          }}
          className="flex items-center justify-between gap-4 rounded-2xl px-2 py-3 text-left transition hover:bg-slate-50"
        >
          <div>
            <p className="text-base font-semibold text-slate-900">{item.label}</p>
            <p className="text-sm text-slate-500">{item.description}</p>
          </div>
          <span
            className={`text-xs font-semibold uppercase tracking-[0.3em] ${
              item.comingSoon ? 'text-slate-300' : disabled ? 'text-primary-600' : 'text-slate-400'
            }`}
          >
            {comingSoonLabel}
          </span>
        </button>
      );
    });

  return (
    <div className="space-y-6">
      {promptMessage && (
        <div className="rounded-3xl border border-primary-200 bg-primary-50/80 px-4 py-4 text-sm text-primary-700">
          {promptMessage}
        </div>
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
            <p className="text-lg font-semibold text-slate-900">{user?.name ?? 'Welcome to F•S TATES'}</p>
            <p className="text-sm text-slate-500">
              {user?.email ?? 'Sign in to track orders, save edits, and unlock concierge.'}
            </p>
          </div>
        </div>
        {user ? (
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
        ) : (
          <Link
            to="/auth"
            className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.25)]"
          >
            Sign in or create account
          </Link>
        )}
      </div>

      <div className="rounded-[32px] border border-white/80 bg-white/95 p-4 shadow-[0_15px_35px_rgba(15,23,42,0.08)]">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-400">My shopping</p>
        <div className="mt-3 space-y-1">{renderList(shoppingItems)}</div>
      </div>

      <div className="rounded-[32px] border border-white/80 bg-white/95 p-4 shadow-[0_15px_35px_rgba(15,23,42,0.08)]">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-400">Account & security</p>
        <div className="mt-3 space-y-1">{renderList(accountItems)}</div>
      </div>

      <div className="rounded-[32px] border border-white/80 bg-white/95 p-4 shadow-[0_15px_35px_rgba(15,23,42,0.08)]">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-400">Notifications & preferences</p>
        <div className="mt-4 space-y-4">
          {preferenceToggles.map((toggle) => (
            <div key={toggle.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-3 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{toggle.label}</p>
                <p className="text-xs text-slate-500">{toggle.description}</p>
              </div>
              <button
                type="button"
                onClick={() => togglePreference(toggle.id)}
                role="switch"
                aria-checked={preferences[toggle.id]}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                  preferences[toggle.id] ? 'bg-slate-900' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 rounded-full bg-white transition ${
                    preferences[toggle.id] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="rounded-2xl border border-slate-200 px-3 py-3 text-left text-sm font-semibold text-slate-600"
            >
              Language <span className="block text-base text-slate-900">English</span>
            </button>
            <button
              type="button"
              className="rounded-2xl border border-slate-200 px-3 py-3 text-left text-sm font-semibold text-slate-600"
            >
              Currency <span className="block text-base text-slate-900">USD</span>
            </button>
          </div>
          <button
            type="button"
            className="w-full rounded-2xl border border-slate-200 px-3 py-3 text-left text-sm font-semibold text-slate-600"
          >
            Region / Delivery country
            <span className="block text-base text-slate-900">Worldwide express</span>
          </button>
        </div>
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
            onClick={onContactSupport}
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
