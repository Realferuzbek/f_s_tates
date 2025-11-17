import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bars3Icon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { MobileExperienceProvider } from '../context/MobileExperienceContext.jsx';
import useAnalytics from '../hooks/useAnalytics.js';
import BrandIcon from './BrandIcon.jsx';
import Seo from './Seo.jsx';
import AuroraBackground from './AuroraBackground.jsx';
import LanguageSelector from './LanguageSelector.jsx';
import AccessibilityWidget from './AccessibilityWidget.jsx';
import useIsMobile from '../hooks/useIsMobile.js';
import MobileShell from './mobile/MobileShell.jsx';
import MobileChatPanel from './mobile/MobileChatPanel.jsx';
import MobileProfilePanel from './mobile/MobileProfilePanel.jsx';

const navLinkClass = ({ isActive }) =>
  isActive
    ? 'text-primary-600 font-semibold'
    : 'text-slate-600 transition hover:text-primary-600';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('marketplace');
  const [chatUnread, setChatUnread] = useState(true);
  const [chatFocusThread, setChatFocusThread] = useState(null);
  const [chatFocusOrderId, setChatFocusOrderId] = useState(null);
  const [profilePrompt, setProfilePrompt] = useState(null);
  const avatarRef = useRef(null);
  const scrollPositionsRef = useRef({
    marketplace: 0,
    chat: 0,
    profile: 0
  });
  const isMobile = useIsMobile();
  const trackEvent = useAnalytics();

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

  useEffect(() => {
    if (!isMobile) {
      setActiveMobileTab('marketplace');
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      return;
    }
    trackEvent('mobile_screen_viewed', {
      screen: `mobile_${activeMobileTab}`,
      properties: { tab: activeMobileTab }
    });
  }, [activeMobileTab, isMobile, trackEvent]);

  const changeMobileTab = useCallback(
    (nextTab, options = {}) => {
      if (!isMobile) {
        return;
      }
      setActiveMobileTab((previous) => {
        if (previous !== nextTab && typeof window !== 'undefined') {
          scrollPositionsRef.current[previous] = window.scrollY;
          trackEvent('mobile_tab_changed', {
            screen: `mobile_${previous}`,
            properties: { from_tab: previous, to_tab: nextTab }
          });
        }
        return nextTab;
      });
      if (options.focusThreadId) {
        setChatFocusThread(options.focusThreadId);
      }
      if (options.focusOrderId) {
        setChatFocusOrderId(options.focusOrderId);
      }
      if (options.profilePrompt) {
        setProfilePrompt(options.profilePrompt);
      }
      if (typeof window !== 'undefined') {
        const restoreScroll = () => {
          const stored = scrollPositionsRef.current[nextTab] ?? 0;
          window.scrollTo({ top: stored, behavior: stored > 24 ? 'smooth' : 'auto' });
        };
        if (typeof window.requestAnimationFrame === 'function') {
          window.requestAnimationFrame(restoreScroll);
        } else {
          restoreScroll();
        }
      }
    },
    [isMobile, trackEvent]
  );

  const experienceValue = useMemo(
    () => ({
      isMobile,
      activeTab: activeMobileTab,
      goToTab: (tab, options = {}) => changeMobileTab(tab, options),
      openChatThread: (threadId) => changeMobileTab('chat', { focusThreadId: threadId }),
      openOrderChat: (orderId) => changeMobileTab('chat', { focusOrderId: orderId }),
      openSupportChat: () => changeMobileTab('chat', { focusThreadId: 'support' }),
      promptProfile: (message) => changeMobileTab('profile', { profilePrompt: message })
    }),
    [activeMobileTab, changeMobileTab, isMobile]
  );

  const chatPanel = (
    <MobileChatPanel
      isActive={activeMobileTab === 'chat'}
      focusThreadId={chatFocusThread}
      focusOrderId={chatFocusOrderId}
      onFocusConsumed={() => {
        setChatFocusThread(null);
        setChatFocusOrderId(null);
      }}
      onUnreadChange={setChatUnread}
    />
  );

  const profilePanel = (
    <MobileProfilePanel
      promptMessage={profilePrompt}
      onPromptClear={() => setProfilePrompt(null)}
      onContactSupport={() => changeMobileTab('chat', { focusThreadId: 'support' })}
    />
  );

  const renderedMainContent = isMobile ? (
    <MobileShell
      activeTab={activeMobileTab}
      onTabChange={changeMobileTab}
      marketplaceContent={children}
      chatContent={chatPanel}
      profileContent={profilePanel}
      chatUnread={chatUnread}
    />
  ) : (
    children
  );

  const contentWithProvider = (
    <MobileExperienceProvider value={experienceValue}>{renderedMainContent}</MobileExperienceProvider>
  );

  return (
    <div className="relative isolate min-h-screen bg-slate-900/5">
      <AuroraBackground />
      <div className="relative z-10 flex min-h-screen flex-col text-slate-900">
        <Seo />
        <header className="sticky top-0 z-40 border-b border-white/40 bg-white/75 backdrop-blur-2xl">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[32px] border border-white/70 bg-white/90 shadow-[0_15px_35px_rgba(15,23,42,0.12)]">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-[32px] border-b border-white/40 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white sm:flex-nowrap">
                <span className="text-[0.68rem] tracking-[0.22em]">Complimentary worldwide express shipping</span>
                <span className="text-[0.65rem] font-medium tracking-[0.16em] text-white/80">Seasonal drop live now</span>
              </div>
              <nav className="flex flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
                <div className="flex flex-1 items-center gap-2">
                  <Link to="/" className="flex items-center gap-2 text-base font-semibold uppercase tracking-[0.24em] text-slate-900">
                    <BrandIcon size={32} />
                    <span className="flex flex-col leading-tight">
                      <span className="text-lg tracking-[0.22em] text-slate-900">F•S TATES</span>
                      <span className="text-[0.6rem] font-medium tracking-[0.18em] text-slate-400">Curated marketplace</span>
                    </span>
                  </Link>
                </div>
                <div className="flex-1" />
                <div className="hidden flex-1 items-center justify-end gap-5 sm:flex">
                  <button
                    type="button"
                    aria-label="Chat with a stylist"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 text-slate-600 transition hover:border-primary-200 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <LanguageSelector />
                  {user ? (
                    <>
                      <div className="relative" ref={avatarRef}>
                        <button
                          type="button"
                          onClick={() => setAvatarOpen((open) => !open)}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm transition hover:border-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
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
                      <a
                        href="#marketplace"
                        className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.25)] transition hover:scale-[1.01] hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
                      >
                        Start shopping
                      </a>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth"
                        className="rounded-full border border-slate-300/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                      >
                        Sign in
                      </Link>
                      <a
                        href="#marketplace"
                        className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.25)] transition hover:scale-[1.01] hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
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
                        onClick={() => {
                          handleLogout();
                          setMobileOpen(false);
                        }}
                        className="rounded-full border border-slate-300/80 px-4 py-2 text-left text-sm font-semibold text-slate-700"
                      >
                        Sign out
                      </button>
                    ) : (
                      <Link
                        to="/auth"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-full border border-slate-300/80 px-4 py-2 text-center text-sm font-semibold text-slate-700"
                      >
                        Sign in
                      </Link>
                    )}
                    <a
                      href="#marketplace"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-full bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-[0_12px_25px_rgba(15,23,42,0.22)]"
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
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{contentWithProvider}</div>
        </main>
        <footer className="mt-14 border-t border-slate-200/60 bg-gradient-to-b from-white/95 via-slate-50 to-slate-100/60 pt-12 pb-28 text-sm text-slate-500 md:pb-12">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
            <div>
              <div className="flex items-center gap-2">
                <BrandIcon size={20} />
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">F•S Tates</h3>
              </div>
              <p className="mt-3 text-base text-slate-600">
                A curated marketplace spotlighting emerging ateliers, mindful craftsmanship, and elevated everyday pieces.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Customer care</h4>
              <ul className="mt-3 space-y-3 text-base text-slate-600">
                <li>Shipping &amp; returns</li>
                <li>Size guide</li>
                <li>Contact concierge</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Stay in the loop</h4>
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
                  className="w-full flex-1 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
                <button
                  type="button"
                  className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.22)] transition hover:bg-primary-600"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <p className="mt-10 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} F-S Tates Marketplace. All rights reserved.
          </p>
        </footer>
        <AccessibilityWidget />
      </div>
    </div>
  );
}
