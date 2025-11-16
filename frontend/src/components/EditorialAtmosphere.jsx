import { BoltIcon, GlobeAmericasIcon, SparklesIcon } from '@heroicons/react/24/outline';

const editorialMoments = [
  {
    title: 'Nightly capsule drop',
    description: 'Curators refresh the hero tables at 21:00 GMT with no more than 50 pieces per release.',
    Icon: SparklesIcon
  },
  {
    title: 'Worldwide fittings',
    description: 'Book virtual sessions across 6 continents with atelier stylists fluent in your language.',
    Icon: GlobeAmericasIcon
  },
  {
    title: 'Lightning tailoring',
    description: 'Express alterations leave the studio in under 48 hours with sustainability reports attached.',
    Icon: BoltIcon
  }
];

const signatureStats = [
  { label: 'Muse moodboards live', value: '18', detail: 'Updated hourly by editors' },
  { label: 'Craft hours saved', value: '2.3k', detail: 'Thanks to predictive sizing' },
  { label: 'Guest happiness', value: '98%', detail: 'Post-fitting satisfaction' }
];

export default function EditorialAtmosphere() {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white/70 bg-gradient-to-br from-white via-primary-50/40 to-white p-10 shadow-[0_40px_90px_rgba(15,23,42,0.12)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-300/20 blur-[120px]" />
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at top, rgba(15,23,42,0.05), transparent 55%)' }} />
      </div>
      <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-[11px] uppercase tracking-[0.4em] text-primary-500">Atmosphere</p>
          <h2 className="text-4xl font-semibold text-slate-900">A boutique aura purpose-built for collectors</h2>
          <p className="text-lg text-slate-600">
            Every screen should feel like stepping into a penthouse salon—quiet confidence, radiant gradients, and the hum of limited releases.
            The marketplace is now staged with cinematic lighting, deeper shadows, and editorial cues so shoppers sense the craft before tapping a single table.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {editorialMoments.map(({ title, description, Icon }) => (
              <article key={title} className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3 text-primary-600">
                  <span className="rounded-2xl bg-primary-50 p-2">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">{title}</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="space-y-4 rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-2xl backdrop-blur">
          <div className="rounded-[24px] border border-primary-100/70 bg-gradient-to-br from-primary-600 via-indigo-600 to-rose-500 p-6 text-white shadow-lg">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">Aura meter</p>
            <p className="mt-2 text-4xl font-semibold">9.4 / 10</p>
            <p className="mt-1 text-sm text-white/80">Measured across ambience, rarity, and service rituals.</p>
          </div>
          <ul className="divide-y divide-white/50 text-sm text-slate-600">
            {signatureStats.map((stat) => (
              <li key={stat.label} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">{stat.label}</p>
                  <p className="text-xs text-slate-500">{stat.detail}</p>
                </div>
                <span className="text-2xl font-semibold text-slate-900">{stat.value}</span>
              </li>
            ))}
          </ul>
          <p className="rounded-2xl border border-dashed border-primary-200/70 bg-white/70 px-4 py-3 text-xs uppercase tracking-[0.3em] text-primary-600">
            Aura increases as new tables go live—keep the glow high.
          </p>
        </div>
      </div>
    </section>
  );
}
