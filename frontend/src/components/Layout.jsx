import { useEffect, useRef, useState } from 'react';
import { Bars3Icon, ChatBubbleLeftRightIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import BrandIcon from './BrandIcon.jsx';
import Seo from './Seo.jsx';

const navLinkClass = ({ isActive }) =>
  isActive
    ? 'text-primary-600 font-semibold'
    : 'text-slate-600 transition hover:text-primary-600';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
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
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Seo />
      <div className="border-b border-primary-200/40 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 py-2 text-center text-xs font-semibold uppercase tracking-[0.35em] text-white">
        Seasonal edit just dropped — enjoy complimentary worldwide express shipping.
      </div>
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-xl font-semibold tracking-[0.3em] text-slate-900">
              <BrandIcon size={30} />
              F•S TATES
            </Link>
            <span className="hidden text-xs uppercase tracking-[0.4em] text-slate-400 sm:inline">
              Curated fashion marketplace
            </span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium sm:flex">
            <NavLink to="/" className={navLinkClass}>
              Collection
            </NavLink>
            <NavLink to="/cart" className={navLinkClass}>
              <span className="inline-flex items-center gap-2">
                <ShoppingBagIcon className="h-5 w-5" aria-hidden="true" />
                Bag
                <span className="sr-only">items in bag</span>
                <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs text-primary-600">
                  {cartCount}
                </span>
              </span>
            </NavLink>
            {user && (
              <NavLink to="/account" className={navLinkClass}>
                My account
              </NavLink>
            )}
            {user?.role === 'ADMIN' && (
              <NavLink to="/admin" className={navLinkClass}>
                Studio admin
              </NavLink>
            )}
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:border-primary-300 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4" aria-hidden="true" />
              Chat
            </button>
            <div className="relative" ref={avatarRef}>
              <button
                type="button"
                onClick={() => setAvatarOpen((open) => !open)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold uppercase tracking-[0.3em] text-slate-700 shadow-sm transition hover:border-primary-300 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
                aria-haspopup="menu"
                aria-expanded={avatarOpen}
              >
                FS
              </button>
              {avatarOpen && (
                <div className="absolute right-0 z-40 mt-3 w-40 rounded-2xl border border-slate-200 bg-white/95 p-3 text-sm shadow-2xl ring-1 ring-black/5">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">Profile</p>
                  <button
                    type="button"
                    className="mt-2 w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Settings
                  </button>
                </div>
              )}
            </div>
            {user ? (
              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:border-primary-300 hover:text-primary-600"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/auth"
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-primary-600"
              >
                Sign in
              </Link>
            )}
          </div>
          <button
            className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-700"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </nav>
        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white/90 px-4 pb-6 pt-4 sm:hidden">
            <div className="flex flex-col gap-3 text-sm font-medium">
              <NavLink to="/" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                Collection
              </NavLink>
              <NavLink to="/cart" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                Bag
              </NavLink>
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
                  className="text-left text-slate-600 hover:text-primary-600"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-primary-600"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">{children}</div>
      </main>
      <footer className="mt-16 bg-white/90 py-10 text-sm text-slate-500">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <BrandIcon size={20} />
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">F•S Tates</h3>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              A global destination for future-forward fashion, spotlighting emerging ateliers and mindful craftsmanship.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Client services</h4>
            <ul className="mt-3 space-y-1 text-sm">
              <li>Virtual styling appointments</li>
              <li>Complimentary tailoring</li>
              <li>Express international delivery</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Stay in the loop</h4>
            <p className="mt-2 text-sm">Receive limited drop alerts and exclusive capsule previews.</p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} F-S Tates Marketplace • Crafted with accessibility-first design
        </p>
      </footer>
    </div>
  );
}
