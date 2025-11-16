import { useEffect, useRef, useState } from 'react';
import { Bars3Icon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import BrandIcon from './BrandIcon.jsx';
import Seo from './Seo.jsx';
import AuroraBackground from './AuroraBackground.jsx';

const navLinkClass = ({ isActive }) =>
  isActive
    ? 'text-primary-600 font-semibold'
    : 'text-slate-600 transition hover:text-primary-600';

const navItems = [
  { label: 'Marketplace', to: '/' },
  { label: 'New in', to: '/category/dresses' },
  { label: 'Designers', to: '/category/boots' },
  { label: 'Live ateliers', to: '/category/knitwear' },
  { label: 'Journal', to: '/category/bags-accessories' }
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef(null);

  const handleLogout = () => {
    setAvatarOpen(false);
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (!avatarOpen) return undefined;
    const handleOutsideClick = (event) => {
      if (!avatarRef.current || avatarRef.current.contains(event.target)) return;
      setAvatarOpen(false);
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setAvatarOpen(false);
      }
    };
    window.addEventListener('pointerdown', handleOutsideClick);
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('pointerdown', handleOutsideClick);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [avatarOpen]);

  return (
    <div className="relative isolate min-h-screen bg-slate-900/5">
      <AuroraBackground />
      <div className="relative z-10 flex min-h-screen flex-col text-slate-900">
        <Seo />
        <div className="border-b border-primary-200/40 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 py-1.5 text-center text-[0.8rem] font-semibold text-white shadow-lg">
          Seasonal drop: complimentary worldwide express shipping on all orders.
        </div>
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-2xl">
        <nav className="mx-auto mt-2 flex w-full max-w-6xl items-center gap-4 rounded-full border border-white/60 bg-white/90 px-5 py-3 shadow-[0_15px_35px_rgba(15,23,42,0.12)] sm:px-8">
          <div className="flex flex-1 items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-[0.25em] text-slate-900">
              <BrandIcon size={28} />
              F•S TATES
            </Link>
            <span className="hidden text-xs uppercase tracking-[0.3em] text-slate-400 lg:inline">
              Curated marketplace
            </span>
          </div>
          <div className="hidden flex-1 items-center justify-center gap-6 text-sm font-medium md:flex">
            {navItems.map((item) => (
              <NavLink key={item.label} to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="hidden flex-1 items-center justify-end gap-3 sm:flex">
            <button
              type="button"
              aria-label="Chat with a stylist"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-primary-200 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {user ? (
              <>
                <div className="relative" ref={avatarRef}>
                  <button
                    type="button"
                    onClick={() => setAvatarOpen((open) => !open)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm transition hover:border-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
                    aria-haspopup="menu"
                    aria-expanded={avatarOpen}
                    aria-label="Open account menu"
                  >
                    <img
                      src="/associate-avatar.svg"
                      alt=""
                      aria-hidden="true"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  </button>
                  {avatarOpen && (
                    <div className="absolute right-0 z-40 mt-3 w-52 rounded-2xl border border-slate-200 bg-white/95 p-4 text-sm shadow-2xl ring-1 ring-black/5">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-500">
                        Quick actions
                      </p>
                      <div className="mt-3 space-y-2">
                        <Link
                          to="/account"
                          onClick={() => setAvatarOpen(false)}
                          className="block rounded-xl px-2 py-1.5 text-slate-700 transition hover:bg-slate-100"
                        >
                          My profile
                        </Link>
                        <Link
                          to="/account/orders"
                          onClick={() => setAvatarOpen(false)}
                          className="block rounded-xl px-2 py-1.5 text-slate-700 transition hover:bg-slate-100"
                        >
                          Orders
                        </Link>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-left text-slate-500"
                          aria-label="Saved items"
                          disabled
                        >
                          Saved items
                          <span className="text-[0.65rem] uppercase tracking-[0.25em]">Soon</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="mt-1 block w-full rounded-xl bg-slate-900 px-2 py-1.5 text-center text-sm font-semibold text-white transition hover:bg-primary-600"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <a
                  href="#marketplace"
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
                >
                  Start shopping
                </a>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-sm font-semibold text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline"
                >
                  Sign in
                </Link>
                <a
                  href="#marketplace"
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
                >
                  Start shopping
                </a>
              </>
            )}
          </div>
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 sm:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </nav>
        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white/90 px-4 pb-6 pt-4 sm:hidden">
            <div className="flex flex-col gap-3 text-sm font-medium">
              {navItems.map((item) => (
                <NavLink key={item.label} to={item.to} className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
              {user && (
                <NavLink to="/account" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  My account
                </NavLink>
              )}
              {user?.role === 'ADMIN' && (
                <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  Studio admin
                </NavLink>
              )}
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="rounded-full border border-slate-200 px-4 py-2 text-left text-sm font-semibold text-slate-600"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full border border-slate-900 px-4 py-2 text-center text-sm font-semibold text-slate-900"
                >
                  Sign in
                </Link>
              )}
              <a
                href="#marketplace"
                onClick={() => setMobileOpen(false)}
                className="rounded-full bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Start shopping
              </a>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">{children}</div>
      </main>
      <footer className="mt-20 border-t border-slate-200/60 bg-white/90 py-12 text-sm text-slate-500">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <BrandIcon size={20} />
              <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">F•S Tates</h3>
            </div>
            <p className="mt-3 text-base text-slate-600">
              A curated marketplace spotlighting emerging ateliers, mindful craftsmanship, and elevated everyday pieces.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Customer care</h4>
            <ul className="mt-3 space-y-2 text-base text-slate-600">
              <li>Shipping &amp; returns</li>
              <li>Size guide</li>
              <li>Contact concierge</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Stay in the loop</h4>
            <p className="mt-3 text-base text-slate-600">
              Seasonal drops, live atelier sessions, and styling intel straight to your inbox.
            </p>
            <form className="mt-4 flex gap-3">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="you@email.com"
                className="w-full flex-1 rounded-full border border-slate-200/70 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
              <button
                type="button"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} F-S Tates Marketplace. All rights reserved.
        </p>
      </footer>
    </div>
    </div>
  );
}
