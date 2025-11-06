import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { Bars3Icon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const navLinkClass = ({ isActive }) =>
  isActive ? 'text-primary-600 font-semibold' : 'text-slate-600 hover:text-slate-900';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-lg font-semibold text-primary-600">
              F-S Tates
            </Link>
            <button
              className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-600"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label="Toggle navigation"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="hidden sm:flex items-center gap-6 text-sm">
              <NavLink to="/" className={navLinkClass}>
                Products
              </NavLink>
              {user && (
                <NavLink to="/account" className={navLinkClass}>
                  My Account
                </NavLink>
              )}
              {user?.role === 'ADMIN' && (
                <NavLink to="/admin" className={navLinkClass}>
                  Admin
                </NavLink>
              )}
              <NavLink to="/cart" className={navLinkClass}>
                <span className="inline-flex items-center gap-1">
                  <ShoppingBagIcon className="h-5 w-5" aria-hidden="true" />
                  Cart
                  <span className="sr-only">items in cart</span>
                  <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs text-primary-600">
                    {cartCount}
                  </span>
                </span>
              </NavLink>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
          {mobileOpen && (
            <div className="sm:hidden border-t border-slate-200 pb-4">
              <div className="flex flex-col gap-2 pt-4 text-sm">
                <NavLink to="/" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  Products
                </NavLink>
                {user && (
                  <NavLink to="/account" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                    My Account
                  </NavLink>
                )}
                {user?.role === 'ADMIN' && (
                  <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                    Admin
                  </NavLink>
                )}
                <NavLink to="/cart" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  Cart
                </NavLink>
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="text-left text-slate-600 hover:text-slate-900"
                  >
                    Sign out
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">{children}</div>
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} F-S Tates Marketplace. Built with accessibility-first design.
      </footer>
    </div>
  );
}
