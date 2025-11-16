import { useEffect, useRef, useState } from 'react';
import { Bars3Icon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import BrandIcon from './BrandIcon.jsx';
import Seo from './Seo.jsx';
import AuroraBackground from './AuroraBackground.jsx';
import LanguageSelector from './LanguageSelector.jsx';
import AccessibilityWidget from './AccessibilityWidget.jsx';

const navLinkClass = ({ isActive }) =>
  isActive
    ? 'text-primary-600 font-semibold'
    : 'text-slate-600 transition hover:text-primary-600';

const supportLinks = [
  { label: 'Shipping & returns', href: '/support/shipping' },
  { label: 'Size guide', href: '/support/size-guide' },
  { label: 'Contact concierge', href: '/support/concierge' },
  { label: 'FAQ', href: '/support/faq' }
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef(null);
  const primaryCtaClass =
    'inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(15,23,42,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white';
  const secondaryCtaClass =
    'inline-flex h-11 items-center justify-center rounded-full border border-[#E0E4EE] bg-white px-5 text-sm font-semibold text-slate-900/80 transition duration-200 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white';

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
        <header className="sticky top-0 z-40 border-b border-white/40 bg-white/75 backdrop-blur-2xl">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[30px] border border-white/70 bg-white/90 shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
              <div className="grid grid-cols-1 gap-1 rounded-t-[30px] border-b border-white/40 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 px-6 py-1 text-[0.78rem] font-medium uppercase tracking-[0.1em] text-white sm:grid-cols-2 sm:items-center sm:px-8">
                <span className="px-3 text-center leading-tight sm:px-0 sm:text-left">Complimentary worldwide express shipping</span>
                <span className="px-3 text-center text-white/85 sm:px-0 sm:text-right">Seasonal drop live now</span>
              </div>
              <nav className="flex flex-wrap items-center gap-4 px-6 py-2 sm:px-8">
                <div className="flex flex-1 items-center gap-2">
                  <Link to="/" className="flex items-center gap-2 text-base font-semibold uppercase tracking-[0.24em] text-slate-900">
                    <BrandIcon size={30} />
                    <span className="flex flex-col leading-tight">
                      <span className="text-lg tracking-[0.22em] text-slate-900">F•S TATES</span>
                      <span className="text-[0.6rem] font-medium tracking-[0.18em] text-slate-400">Curated marketplace</span>
                    </span>
                  </Link>
                </div>
                <div className="flex-1" />
                <div className="hidden flex-1 items-center justify-end gap-6 sm:flex">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Chat with a stylist"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E0E4EE] bg-white text-slate-500 transition hover:border-primary-200 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      <ChatBubbleLeftRightIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <LanguageSelector />
                  </div>
                  {user ? (
                    <div className="flex items-center gap-4">
                      <div className="relative" ref={avatarRef}>
                        <button
                          type="button"
                          onClick={() => setAvatarOpen((open) => !open)}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E0E4EE] bg-white text-xs font-semibold text-slate-700 transition hover:border-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                          aria-haspopup="menu"
                          aria-expanded={avatarOpen}
                          aria-label="Open account menu"
                        >
                          <img
                            src="/associate-avatar.svg"
                            alt=""
                            aria-hidden="true"
                            className="h-8 w-8 rounded-full object-cover"
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
                      <a href="#marketplace" className={primaryCtaClass}>
                        Start shopping
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Link to="/auth" className={secondaryCtaClass}>
                        Sign in
                      </Link>
                      <a href="#marketplace" className={primaryCtaClass}>
                        Start shopping
                      </a>
                    </div>
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
                <div className="border-t border-slate-200/70 bg-white/95 px-4 pb-6 pt-4 sm:hidden">
                  <div className="mb-4 flex justify-start">
                    <LanguageSelector />
                  </div>
                  <div className="flex flex-col gap-3 text-sm font-medium">
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
                        type="button"
                        onClick={() => {
                          handleLogout();
                          setMobileOpen(false);
                        }}
                        className={`${secondaryCtaClass} w-full justify-start px-4 text-left`}
                      >
                        Sign out
                      </button>
                    ) : (
                      <Link
                        to="/auth"
                        onClick={() => setMobileOpen(false)}
                        className={`${secondaryCtaClass} w-full justify-center`}
                      >
                        Sign in
                      </Link>
                    )}
                    <a
                      href="#marketplace"
                      onClick={() => setMobileOpen(false)}
                      className={`${primaryCtaClass} mt-2 w-full justify-center`}
                    >
                      Start shopping
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 lg:px-8">{children}</div>
        </main>
        <footer className="mt-20 border-t border-slate-200/70 bg-gradient-to-b from-white/92 via-slate-100/80 to-slate-200/60 py-14 text-sm text-slate-600">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BrandIcon size={20} />
                <h3 className="text-[0.82rem] font-semibold uppercase tracking-[0.28em] text-slate-900">F•S Tates</h3>
              </div>
              <p className="text-base leading-relaxed text-[#6E7585]">
                A curated marketplace spotlighting emerging ateliers, mindful craftsmanship, and elevated everyday pieces.
              </p>
            </div>
            <div>
              <h4 className="text-[0.82rem] font-semibold uppercase tracking-[0.28em] text-slate-900">Customer care</h4>
              <ul className="mt-4 space-y-2 text-base text-slate-700">
                {supportLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-flex items-center text-slate-600 transition hover:text-primary-600 hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[0.82rem] font-semibold uppercase tracking-[0.28em] text-slate-900">Stay in the loop</h4>
              <p className="mt-4 text-base leading-relaxed text-[#6E7585]">
                Seasonal drops, live atelier sessions, and styling intel straight to your inbox.
              </p>
              <form className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  placeholder="you@email.com"
                  className="h-11 flex-1 rounded-full border border-[#E0E4EE] bg-white/90 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
                <button type="button" className={`${primaryCtaClass} w-full justify-center sm:w-auto`}>
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} F-S Tates Marketplace. All rights reserved.
          </p>
        </footer>
        <AccessibilityWidget />
      </div>
    </div>
  );
}
