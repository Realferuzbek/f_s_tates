import { createContext, useContext } from 'react';

const noop = () => {};

const MobileExperienceContext = createContext({
  isMobile: false,
  activeTab: 'marketplace',
  goToTab: noop,
  openChatThread: noop,
  openOrderChat: noop,
  openSupportChat: noop,
  promptProfile: noop
});

export function MobileExperienceProvider({ value, children }) {
  return <MobileExperienceContext.Provider value={value}>{children}</MobileExperienceContext.Provider>;
}

export function useMobileExperience() {
  const context = useContext(MobileExperienceContext);
  if (context === undefined) {
    throw new Error('useMobileExperience must be used within a MobileExperienceProvider');
  }
  return context;
}

export default MobileExperienceContext;
