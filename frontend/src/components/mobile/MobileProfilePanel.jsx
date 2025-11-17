import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const profileOptions = [
  {
    id: 'account',
    label: 'Account details',
    description: 'Measurements, preferences, client notes',
    href: '/account'
  },
  {
    id: 'orders',
    label: 'Order history',
    description: 'Track couture and ready-to-wear pieces',
    href: '/account/orders'
  },
  {
    id: 'addresses',
    label: 'Addresses',
    description: 'Residences, pied-à-terre, hotel drop-offs',
    soon: true
  },
  {
    id: 'payments',
    label: 'Payment methods',
    description: 'Cards and concierge billing',
    soon: true
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Language, notifications, regional services',
    soon: true
  }
];

export default function MobileProfilePanel() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/90 p-5 shadow-[0_15px_35px_rgba(15,23,42,0.08)]">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-500">Profile</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-lg font-semibold text-white">
            {user?.name ? user.name.slice(0, 1).toUpperCase() : 'F•S'}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{user?.name || 'Guest'}</p>
            <p className="text-sm text-slate-500">{user?.email || 'Sign in to personalize your experience'}</p>
          </div>
        </div>
        {user ? (
          <div className="mt-4 flex gap-3">
            <Link
              to="/account"
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-600"
            >
              View desktop account
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)]"
          >
            Sign in / Create account
          </Link>
        )}
      </div>
      <div className="rounded-3xl border border-slate-100 bg-white/90 p-4 shadow-[0_8px_25px_rgba(15,23,42,0.06)]">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-500">Manage</p>
        <div className="mt-3 divide-y divide-slate-100">
          {profileOptions.map((option) => (
            <div key={option.id} className="py-3 first:pt-0 last:pb-0">
              {option.href ? (
                <Link to={option.href} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{option.label}</p>
                    <p className="text-sm text-slate-500">{option.description}</p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600">Open</span>
                </Link>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{option.label}</p>
                    <p className="text-sm text-slate-500">{option.description}</p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    {option.soon ? 'Soon' : 'Locked'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-primary-700 p-5 text-white shadow-[0_20px_35px_rgba(15,23,42,0.35)]">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">Concierge</p>
        <p className="mt-2 text-lg font-semibold">Need something tailored?</p>
        <p className="mt-2 text-sm text-white/80">Chat tab is your direct line to our atelier managers.</p>
      </div>
    </div>
  );
}
