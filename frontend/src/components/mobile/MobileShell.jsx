import MobileBottomNav from './MobileBottomNav.jsx';

export default function MobileShell({
  activeTab,
  onTabChange,
  marketplaceContent,
  chatContent,
  profileContent
}) {
  return (
    <div className="relative md:hidden">
      <div className="pb-32">
        <div className={activeTab === 'marketplace' ? 'block' : 'hidden'} aria-hidden={activeTab !== 'marketplace'}>
          {marketplaceContent}
        </div>
        <div className={activeTab === 'chat' ? 'block' : 'hidden'} aria-hidden={activeTab !== 'chat'}>
          {chatContent}
        </div>
        <div className={activeTab === 'profile' ? 'block' : 'hidden'} aria-hidden={activeTab !== 'profile'}>
          {profileContent}
        </div>
      </div>
      <MobileBottomNav activeTab={activeTab} onChange={onTabChange} />
    </div>
  );
}
