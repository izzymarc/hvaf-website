import React, { createContext, useContext, useState, useEffect } from 'react';

interface SplashContextType {
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

export const SplashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Show splash screen only on initial load
    setShowSplash(true);

    // Listen for route changes
    const handleRouteChange = () => {
      // Hide splash screen when navigating away from home page
      if (window.location.pathname !== '/') {
        setShowSplash(false);
      }
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <SplashContext.Provider value={{ showSplash, setShowSplash }}>
      {children}
    </SplashContext.Provider>
  );
};

export const useSplash = () => {
  const context = useContext(SplashContext);
  if (context === undefined) {
    throw new Error('useSplash must be used within a SplashProvider');
  }
  return context;
};
