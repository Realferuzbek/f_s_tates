import { useEffect, useMemo, useState } from 'react';
import { ArrowLeftIcon, ChevronRightIcon, EnvelopeOpenIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const initialThreads = [
  {
    id: 'order-8472',
    orderNumber: '#8472',
    title: 'Boot Atelier',
    subtitle: 'Hand-lasted boots',
    thumbnail:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    status: 'Paid',
    unreadCount: 1,
    updatedAt: '2025-11-17T09:42:00Z',
    messages: [
      {
        id: 'm1',
        type: 'system',
        text: 'Order placed',
        timestamp: '09:32',
        dateLabel: 'Today',
        sender: 'system'
      },
      {
        id: 'm2',
        type: 'system',
        text: 'Payment confirmed',
        timestamp: '09:34',
        dateLabel: 'Today',
        sender: 'system'
      },
      {
        id: 'm3',
        type: 'code',
        title: 'Your access code',
        code: 'FS-7KJ9-AB21',
        timestamp: '09:35',
        dateLabel: 'Today',
        sender: 'F•S TATES',
        instructions: 'Use this code when your courier arrives so we can unlock the atelier locker.'
      },
      {
        id: 'm4',
        type: 'admin',
        text: 'Hi! Your boots enter finishing tonight. Expect the courier window email tomorrow.',
        timestamp: '09:36',
        dateLabel: 'Today',
        sender: 'F•S TATES'
      }
    ]
  },
  {
    id: 'order-3281',
    orderNumber: '#3281',
    title: 'Scarves capsule',
    subtitle: 'Regenerative cashmere',
    thumbnail:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
    status: 'Shipped',
    unreadCount: 0,
    updatedAt: '2025-11-15T17:12:00Z',
    messages: [
      {
        id: 'm5',
        type: 'system',
        text: 'Order delivered',
        timestamp: '17:11',
        dateLabel: 'Saturday',
        sender: 'system'
      },
      {
        id: 'm6',
        type: 'admin',
        text: 'Let us know if you want styling tips for the charcoal scarf with tailored looks.',
        timestamp: '17:12',
        dateLabel: 'Saturday',
        sender: 'F•S TATES'
      }
    ]
  },
  {
    id: 'support',
    orderNumber: null,
    title: 'Concierge support',
    subtitle: '24/7 Atelier team',
    thumbnail:
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80',
    status: 'Online',
    unreadCount: 0,
    updatedAt: '2025-11-14T12:00:00Z',
    messages: [
      {
        id: 'm7',
        type: 'admin',
        text: 'Share any delivery notes or photos here once messaging opens up for customers.',
        timestamp: '12:00',
        dateLabel: 'Friday',
        sender: 'F•S TATES'
      }
    ]
  }
];

const statusStyles = {
  Paid: 'bg-amber-50 text-amber-700',
  Shipped: 'bg-sky-50 text-sky-700',
  Delivered: 'bg-emerald-50 text-emerald-700',
  Online: 'bg-purple-50 text-purple-700'
};

export default function MobileChatPanel({ focusThreadId, onFocusConsumed, onUnreadChange }) {
  const [threads, setThreads] = useState(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState(null);

  useEffect(() => {
    onUnreadChange?.(threads.some((thread) => thread.unreadCount > 0));
  }, [threads, onUnreadChange]);

  useEffect(() => {
    if (!focusThreadId) return;
    const hasThread = threads.some((thread) => thread.id === focusThreadId);
    if (!hasThread) return;
    setActiveThreadId(focusThreadId);
    setThreads((current) =>
      current.map((thread) => (thread.id === focusThreadId ? { ...thread, unreadCount: 0 } : thread))
    );
    onFocusConsumed?.();
  }, [focusThreadId, onFocusConsumed, threads]);

  const sortedThreads = useMemo(
    () => [...threads].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    [threads]
  );

  const activeThread = threads.find((thread) => thread.id === activeThreadId);

  const openThread = (threadId) => {
    setActiveThreadId(threadId);
    setThreads((current) =>
      current.map((thread) => (thread.id === threadId ? { ...thread, unreadCount: 0 } : thread))
    );
  };

  const renderThreadList = () => (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white/95 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.12)]">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-500">Messages</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Post-purchase inbox</h2>
        <p className="mt-2 text-sm text-slate-500">
          Every order creates a thread. Codes, delivery updates, and concierge replies stay in one place.
        </p>
      </div>
      {sortedThreads.map((thread) => {
        const pillClass = statusStyles[thread.status] ?? 'bg-slate-100 text-slate-600';
        return (
          <button
            key={thread.id}
            type="button"
            onClick={() => openThread(thread.id)}
            className="flex w-full items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
          >
            <img
              src={thread.thumbnail}
              alt=""
              className="h-16 w-16 rounded-2xl object-cover"
              loading="lazy"
            />
            <div className="flex flex-1 flex-col">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-900">
                  {thread.orderNumber ? `${thread.orderNumber} · ${thread.title}` : thread.title}
                </p>
                {thread.unreadCount > 0 && <span className="h-2 w-2 rounded-full bg-primary-600" />}
              </div>
              <p className="text-sm text-slate-500 line-clamp-2">{thread.subtitle}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span className={`rounded-full px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.3em] ${pillClass}`}>
                  {thread.status}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-[0.3em] text-slate-400">
                  View
                  <ChevronRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>
            </div>
          </button>
        );
      })}
      {sortedThreads.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-6 text-center text-sm text-slate-500">
          You’ll see your purchase messages here once you finish checkout.
        </div>
      )}
    </div>
  );

  const renderMessageBubble = (message) => {
    if (message.type === 'system') {
      return (
        <div key={message.id} className="text-center text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
          {message.text} · {message.dateLabel} {message.timestamp}
        </div>
      );
    }
    if (message.type === 'code') {
      return (
        <div
          key={message.id}
          className="self-start rounded-3xl border border-slate-200 bg-white/95 p-4 text-left shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{message.title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-[0.3em]">{message.code}</p>
          <p className="mt-2 text-sm text-slate-500">{message.instructions}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600"
            >
              Copy code
            </button>
            <button
              type="button"
              className="flex-1 rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white"
            >
              View instructions
            </button>
          </div>
          <p className="mt-3 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
            {message.sender} · {message.dateLabel} {message.timestamp}
          </p>
        </div>
      );
    }

    const isUser = message.sender === 'You';
    const bubbleClasses = isUser
      ? 'self-end bg-primary-600 text-white'
      : 'self-start bg-white text-slate-900 border border-slate-200';
    return (
      <div key={message.id} className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm shadow ${bubbleClasses}`}>
        <p>{message.text}</p>
        <p className="mt-2 text-[0.65rem] uppercase tracking-[0.3em] text-white/70">
          {message.sender} · {message.dateLabel} {message.timestamp}
        </p>
      </div>
    );
  };

  const renderConversation = () => {
    if (!activeThread) {
      return renderThreadList();
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
            <p className="text-base font-semibold text-slate-900">
              {activeThread.orderNumber ? `${activeThread.orderNumber} · ${activeThread.title}` : activeThread.title}
            </p>
          </div>
          {activeThread.orderNumber && (
            <Link
              to="/account/orders"
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600"
            >
              View order
            </Link>
          )}
        </header>
        <div className="rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-[0_20px_40px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3">
            <img src={activeThread.thumbnail} alt="" className="h-14 w-14 rounded-2xl object-cover" loading="lazy" />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {activeThread.orderNumber
                  ? `${activeThread.orderNumber} · ${activeThread.title}`
                  : activeThread.title}
              </p>
              <p className="text-xs text-slate-500">{activeThread.subtitle}</p>
            </div>
          </div>
          <span
            className={`mt-3 inline-block rounded-full px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.3em] ${
              statusStyles[activeThread.status] ?? 'bg-slate-100 text-slate-600'
            }`}
          >
            {activeThread.status}
          </span>
        </div>
        <div className="space-y-4">
          {activeThread.messages.map((message) => renderMessageBubble(message))}
        </div>
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Reply</p>
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-400">
            <EnvelopeOpenIcon className="h-5 w-5" aria-hidden="true" />
            Reply coming soon
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Messaging opens up in Phase 2 so you can ask questions, send delivery photos, or attach proof of purchase.
          </p>
        </div>
      </div>
    );
  };

  return <div className="space-y-6">{renderConversation()}</div>;
}
