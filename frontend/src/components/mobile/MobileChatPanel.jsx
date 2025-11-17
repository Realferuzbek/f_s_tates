import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeftIcon, ChevronRightIcon, EnvelopeOpenIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import apiClient from '../../utils/apiClient.js';
import useAnalytics from '../../hooks/useAnalytics.js';

const statusStyles = {
  PLACED: 'bg-amber-50 text-amber-700',
  PROCESSING: 'bg-slate-100 text-slate-700',
  SHIPPED: 'bg-sky-50 text-sky-700',
  DELIVERED: 'bg-emerald-50 text-emerald-700',
  SUPPORT: 'bg-purple-50 text-purple-700'
};

const statusLabels = {
  PLACED: 'Placed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  SUPPORT: 'Support'
};

function formatStatus(status, isSupport) {
  if (isSupport) {
    return 'Support';
  }
  return statusLabels[status] ?? 'Updates';
}

function formatTimestamp(value) {
  if (!value) return '';
  const date = new Date(value);
  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })}`;
}

function senderLabel(message) {
  if (message.senderType === 'USER') return 'You';
  if (message.senderType === 'ADMIN') return 'F•S TATES';
  return 'System';
}

export default function MobileChatPanel({ isActive, focusThreadId, focusOrderId, onFocusConsumed, onUnreadChange }) {
  const { user, token } = useAuth();
  const trackEvent = useAnalytics();
  const [threads, setThreads] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [threadsError, setThreadsError] = useState(null);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [threadDetails, setThreadDetails] = useState({});
  const [fetchingThread, setFetchingThread] = useState(false);

  const buildAuthHeaders = useCallback(() => {
    const authToken = typeof token === 'function' ? token() : null;
    return authToken
      ? {
          Authorization: `Bearer ${authToken}`
        }
      : null;
  }, [token]);

  const fetchThreads = useCallback(async () => {
    if (!user) {
      return;
    }
    const headers = buildAuthHeaders();
    if (!headers) {
      return;
    }
    setLoadingThreads(true);
    try {
      const response = await apiClient.get('/chat/threads', { headers });
      setThreads(response.data.threads ?? []);
      setThreadsError(null);
    } catch (error) {
      setThreadsError('Unable to load your conversations right now.');
    } finally {
      setLoadingThreads(false);
    }
  }, [buildAuthHeaders, user]);

  const markThreadAsRead = useCallback(
    async (conversationId, unreadBefore) => {
      if (!conversationId || !unreadBefore || unreadBefore <= 0) {
        return;
      }
      const headers = buildAuthHeaders();
      if (!headers) return;
      try {
        await apiClient.post(`/chat/threads/${conversationId}/read`, {}, { headers });
        setThreads((current) =>
          current.map((thread) => (thread.id === conversationId ? { ...thread, unreadForUser: 0 } : thread))
        );
        trackEvent('chat_message_read', {
          screen: 'mobile_chat',
          properties: { conversation_id: conversationId, unread_before: unreadBefore, unread_after: 0 }
        });
      } catch {
        // ignore read errors
      }
    },
    [buildAuthHeaders, trackEvent]
  );

  const fetchThreadDetail = useCallback(
    async (conversationId, unreadForUser = 0) => {
      const headers = buildAuthHeaders();
      if (!headers) {
        return;
      }
      setFetchingThread(true);
      try {
        const response = await apiClient.get(`/chat/threads/${conversationId}`, { headers });
        if (response.data?.conversation) {
          setThreadDetails((prev) => ({
            ...prev,
            [conversationId]: response.data.conversation
          }));
          if (unreadForUser > 0) {
            markThreadAsRead(conversationId, unreadForUser);
          }
        }
        setThreadsError(null);
      } catch (error) {
        setThreadsError('Unable to open this thread.');
      } finally {
        setFetchingThread(false);
      }
    },
    [buildAuthHeaders, markThreadAsRead]
  );

  const openThread = useCallback(
    (thread) => {
      setActiveThreadId(thread.id);
      trackEvent('chat_thread_opened', {
        screen: 'mobile_chat',
        properties: { conversation_id: thread.id, order_id: thread.orderId }
      });
      if (!threadDetails[thread.id]) {
        fetchThreadDetail(thread.id, thread.unreadForUser);
      } else if (thread.unreadForUser > 0) {
        markThreadAsRead(thread.id, thread.unreadForUser);
      }
    },
    [fetchThreadDetail, markThreadAsRead, threadDetails, trackEvent]
  );

  useEffect(() => {
    if (!user) {
      setThreads([]);
      setThreadDetails({});
      setActiveThreadId(null);
    }
  }, [user]);

  useEffect(() => {
    if (!isActive || !user) {
      return;
    }
    fetchThreads();
  }, [fetchThreads, isActive, user]);

  useEffect(() => {
    if (!threads || threads.length === 0) {
      onUnreadChange?.(false);
      return;
    }
    onUnreadChange?.(threads.some((thread) => thread.unreadForUser > 0));
  }, [threads, onUnreadChange]);

  useEffect(() => {
    if (!focusThreadId && !focusOrderId) {
      return;
    }
    if (threads.length === 0 && !loadingThreads) {
      fetchThreads();
      return;
    }
    let target = null;
    if (focusThreadId) {
      target =
        focusThreadId === 'support'
          ? threads.find((thread) => thread.isSupport)
          : threads.find((thread) => thread.id === focusThreadId);
    }
    if (!target && focusOrderId) {
      target = threads.find((thread) => thread.orderId === focusOrderId);
    }
    if (target) {
      openThread(target);
      onFocusConsumed?.();
    }
  }, [focusThreadId, focusOrderId, threads, loadingThreads, fetchThreads, openThread, onFocusConsumed]);

  const activeThread = useMemo(() => threads.find((thread) => thread.id === activeThreadId), [threads, activeThreadId]);
  const conversationDetail = activeThreadId ? threadDetails[activeThreadId] : null;

  if (!user) {
    return (
      <div className="space-y-4">
        <div className="rounded-[32px] border border-white/80 bg-white/95 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.12)]">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-400">Messages</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">Post-purchase messages</h2>
          <p className="mt-1 text-sm text-slate-600">
            Sign in to view concierge updates, delivery notes, and access codes once you complete checkout.
          </p>
          <Link
            to="/auth"
            className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.25)]"
          >
            Sign in to continue
          </Link>
        </div>
      </div>
    );
  }

  if (!activeThread) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-400">Inbox</p>
            <h2 className="text-2xl font-semibold text-slate-900">Chat after checkout</h2>
            <p className="text-sm text-slate-500">System events, concierge notes, and your replies live here.</p>
          </div>
          <button
            type="button"
            onClick={fetchThreads}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
          >
            Refresh
          </button>
        </div>
        {threadsError && <p className="rounded-2xl border border-rose-200 bg-rose-50/60 px-3 py-2 text-sm text-rose-600">{threadsError}</p>}
        {loadingThreads && threads.length === 0 ? (
          <p className="text-sm text-slate-500">Loading your threads...</p>
        ) : threads.length > 0 ? (
          <div className="space-y-3">
            {threads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                onClick={() => openThread(thread)}
                className="w-full rounded-[28px] border border-slate-200 bg-white/95 px-4 py-4 text-left shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:border-primary-100"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      {thread.orderId ? `Order ${thread.orderId.slice(-4).toUpperCase()}` : 'Support'}
                    </p>
                    <p className="text-base font-semibold text-slate-900">{thread.title}</p>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{thread.lastMessagePreview ?? 'No messages yet'}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.3em] ${
                      statusStyles[thread.isSupport ? 'SUPPORT' : thread.orderStatus] ?? 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {formatStatus(thread.orderStatus, thread.isSupport)}
                  </span>
                  <div className="flex items-center gap-2">
                    {thread.lastMessageAt && (
                      <span className="text-xs text-slate-400">{formatTimestamp(thread.lastMessageAt)}</span>
                    )}
                    {thread.unreadForUser > 0 && (
                      <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-primary-600 px-2 text-xs font-semibold text-white">
                        {thread.unreadForUser}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-200 bg-white/80 px-4 py-6 text-center text-sm text-slate-500">
            You’ll see your order updates here once checkout is complete.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setActiveThreadId(null)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white"
          aria-label="Back to threads"
        >
          <ArrowLeftIcon className="h-5 w-5 text-slate-600" aria-hidden="true" />
        </button>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Messages</p>
          <p className="text-base font-semibold text-slate-900">{activeThread.title}</p>
          <p className="text-xs text-slate-500">{formatStatus(activeThread.orderStatus, activeThread.isSupport)}</p>
        </div>
        {activeThread.orderId && (
          <Link
            to="/account/orders"
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600"
          >
            View order
          </Link>
        )}
      </header>
      {fetchingThread && !conversationDetail ? (
        <div className="rounded-[28px] border border-slate-200 bg-white/90 px-4 py-6 text-center text-sm text-slate-500">
          Loading conversation...
        </div>
      ) : conversationDetail ? (
        <>
          <div className="rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-[0_20px_40px_rgba(15,23,42,0.12)]">
            {conversationDetail.order ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-900/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    #{conversationDetail.order.id.slice(-4).toUpperCase()}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.3em] ${
                      statusStyles[conversationDetail.order.status] ?? 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {formatStatus(conversationDetail.order.status, false)}
                  </span>
                </div>
                {conversationDetail.order.items.length > 0 && (
                  <p className="mt-2 text-sm text-slate-600">
                    {conversationDetail.order.items.map((item) => item.name).join(' · ')}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-400">
                  Last update {formatTimestamp(conversationDetail.lastMessageAt ?? activeThread.lastMessageAt)}
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-600">Concierge support thread</p>
            )}
          </div>
          <div className="space-y-4">
            {conversationDetail.messages.map((message) => {
              if (message.kind === 'ORDER_STATUS' && message.senderType === 'SYSTEM') {
                return (
                  <div
                    key={message.id}
                    className="text-center text-xs font-semibold uppercase tracking-[0.35em] text-slate-400"
                  >
                    {message.text} · {formatTimestamp(message.createdAt)}
                  </div>
                );
              }
              if (message.kind === 'CODE' && message.payload?.code) {
                return (
                  <div
                    key={message.id}
                    className="self-start rounded-3xl border border-slate-200 bg-white/95 p-4 text-left shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{message.text ?? 'Access code'}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-[0.3em]">{message.payload.code}</p>
                    {message.payload.instructions && <p className="mt-2 text-sm text-slate-500">{message.payload.instructions}</p>}
                    <p className="mt-3 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
                      {senderLabel(message)} · {formatTimestamp(message.createdAt)}
                    </p>
                  </div>
                );
              }
              const isUser = message.senderType === 'USER';
              return (
                <div
                  key={message.id}
                  className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm shadow ${
                    isUser ? 'self-end bg-primary-600 text-white' : 'self-start border border-slate-200 bg-white text-slate-900'
                  }`}
                >
                  <p>{message.text ?? message.payload?.text ?? '—'}</p>
                  <p
                    className={`mt-2 text-[0.65rem] uppercase tracking-[0.3em] ${
                      isUser ? 'text-white/70' : 'text-slate-400'
                    }`}
                  >
                    {senderLabel(message)} · {formatTimestamp(message.createdAt)}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Reply</p>
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-400">
              <EnvelopeOpenIcon className="h-5 w-5" aria-hidden="true" />
              Replies opening soon
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Messaging unlocks in Phase 2 so you can attach delivery notes or ask concierge follow-ups.
            </p>
          </div>
        </>
      ) : (
        <div className="rounded-[28px] border border-slate-200 bg-white/90 px-4 py-6 text-center text-sm text-slate-500">
          Select a thread to view messages.
        </div>
      )}
    </div>
  );
}
