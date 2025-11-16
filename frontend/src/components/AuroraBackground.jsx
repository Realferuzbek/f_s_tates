const layers = [
  {
    className: 'from-primary-500/50 via-rose-400/30 to-amber-300/20',
    style: { top: '-20%', left: '-10%', width: '34rem', height: '34rem', '--drift-duration': '26s' }
  },
  {
    className: 'from-sky-400/40 via-indigo-500/30 to-purple-500/20',
    style: { bottom: '-30%', right: '-15%', width: '42rem', height: '42rem', '--drift-duration': '32s' }
  },
  {
    className: 'from-emerald-400/40 via-teal-400/20 to-cyan-400/10',
    style: { top: '15%', right: '10%', width: '28rem', height: '28rem', '--drift-duration': '22s' }
  }
];

export default function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {layers.map((layer, index) => (
        <div
          key={layer.className}
          style={layer.style}
          className={`aurora-blob absolute rounded-full bg-gradient-to-br blur-[140px] opacity-60 mix-blend-screen`}
        >
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${layer.className}`} />
        </div>
      ))}
      <div className="absolute inset-x-0 top-12 mx-auto h-[600px] w-[80%] rounded-full bg-white/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-slate-50 via-white/30 to-transparent" />
    </div>
  );
}
