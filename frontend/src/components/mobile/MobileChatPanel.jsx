const mockMessages = [
  {
    id: 1,
    title: 'Order #8472 confirmed',
    body: 'Your made-to-order silk set is now in production. Expect a concierge update within 48 hours.',
    timestamp: 'Today • 09:41'
  },
  {
    id: 2,
    title: 'Stylist follow-up',
    body: 'Mara left measurements guidance for your Atelier Noir blazer fit.',
    timestamp: 'Yesterday • 19:12'
  },
  {
    id: 3,
    title: 'Shipping notice',
    body: 'Tracking will unlock once the atelier completes final QC.',
    timestamp: 'Mon • 11:05'
  }
];

export default function MobileChatPanel() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/90 p-5 text-center shadow-[0_15px_35px_rgba(15,23,42,0.08)]">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-500">Messages</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Chat with F•S TATES</h2>
        <p className="mt-2 text-sm text-slate-500">
          Order confirmations, atelier notes, and concierge instructions will drop in here soon.
        </p>
      </div>
      <div className="space-y-4">
        {mockMessages.map((message) => (
          <article
            key={message.id}
            className="rounded-3xl border border-slate-100 bg-white px-4 py-4 shadow-[0_8px_20px_rgba(15,23,42,0.05)]"
          >
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-primary-600">{message.title}</p>
            <p className="mt-2 text-base text-slate-700">{message.body}</p>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.3em] text-slate-400">{message.timestamp}</p>
          </article>
        ))}
      </div>
      <div className="rounded-3xl border border-dashed border-slate-300/70 bg-white/80 px-4 py-5 text-center text-sm text-slate-400">
        <p className="font-semibold tracking-[0.3em] text-slate-500">Coming soon</p>
        <p className="mt-1 text-base text-slate-400">Messaging will unlock once orders flow through concierge.</p>
      </div>
    </div>
  );
}
