import { ChatBubbleOvalLeftEllipsisIcon, Squares2X2Icon, UserCircleIcon } from '@heroicons/react/24/outline';

const tabs = [
  { id: 'marketplace', label: 'Market Place', icon: Squares2X2Icon },
  { id: 'chat', label: 'Chat', icon: ChatBubbleOvalLeftEllipsisIcon },
  { id: 'profile', label: 'Profile', icon: UserCircleIcon }
];

export default function MobileBottomNav({ activeTab, onChange }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/90 bg-white/95 shadow-[0_-10px_35px_rgba(15,23,42,0.08)] backdrop-blur-md md:hidden"
      aria-label="Mobile primary navigation"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-between px-6 py-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className="flex flex-1 flex-col items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em]"
              aria-current={isActive ? 'page' : undefined}
            >
              <tab.icon className={`h-6 w-6 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} aria-hidden="true" />
              <span className={isActive ? 'text-primary-600' : 'text-slate-400'}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
