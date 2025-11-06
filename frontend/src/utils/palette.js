const COLOR_SWATCHES = {
  midnight: 'bg-slate-900',
  champagne: 'bg-amber-100 border border-amber-200',
  rosewater: 'bg-rose-100 border border-rose-200',
  charcoal: 'bg-neutral-800',
  navy: 'bg-blue-900',
  stone: 'bg-stone-300',
  sage: 'bg-emerald-200',
  black: 'bg-black',
  terracotta: 'bg-orange-300',
  sand: 'bg-amber-200',
  ecru: 'bg-amber-100 border border-amber-200',
  'oak moss': 'bg-lime-800',
  carbon: 'bg-neutral-900',
  'sea glass': 'bg-cyan-200',
  'optic white': 'bg-white border border-slate-200',
  sandstone: 'bg-amber-300',
  'sky blue': 'bg-sky-300',
  'rose dusk': 'bg-rose-300',
  oat: 'bg-amber-100 border border-amber-200',
  ink: 'bg-slate-950',
  espresso: 'bg-amber-900',
  camel: 'bg-orange-200'
};

export const COLOR_LIBRARY = [
  { value: 'midnight', label: 'Midnight' },
  { value: 'champagne', label: 'Champagne' },
  { value: 'rosewater', label: 'Rosewater' },
  { value: 'charcoal', label: 'Charcoal' },
  { value: 'navy', label: 'Navy' },
  { value: 'stone', label: 'Stone' },
  { value: 'sage', label: 'Sage' },
  { value: 'black', label: 'Black' },
  { value: 'terracotta', label: 'Terracotta' },
  { value: 'sand', label: 'Sand' },
  { value: 'ecru', label: 'Ecru' },
  { value: 'oak moss', label: 'Oak Moss' },
  { value: 'carbon', label: 'Carbon' },
  { value: 'sea glass', label: 'Sea Glass' },
  { value: 'optic white', label: 'Optic White' },
  { value: 'sandstone', label: 'Sandstone' },
  { value: 'sky blue', label: 'Sky Blue' },
  { value: 'rose dusk', label: 'Rose Dusk' },
  { value: 'oat', label: 'Oat' },
  { value: 'ink', label: 'Ink' },
  { value: 'espresso', label: 'Espresso' },
  { value: 'camel', label: 'Camel' }
];

export function getColorSwatchClass(value) {
  return COLOR_SWATCHES[value] ?? 'bg-slate-200';
}
