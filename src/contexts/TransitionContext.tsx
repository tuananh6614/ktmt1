
import React, { createContext, useContext, useState } from 'react';

interface TransitionContextType {
  isTransitioning: boolean;
  setIsTransitioning: React.Dispatch<React.SetStateAction<boolean>>;
  transitionName: string;
  setTransitionName: React.Dispatch<React.SetStateAction<string>>;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionName, setTransitionName] = useState('fade');

  return (
    <TransitionContext.Provider value={{
      isTransitioning,
      setIsTransitioning,
      transitionName,
      setTransitionName
    }}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};
