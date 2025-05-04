
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useTransition } from '@/contexts/TransitionContext';

interface PageTransitionProps {
  children: React.ReactNode;
}

const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  rotate: {
    initial: { opacity: 0, rotate: 2 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: -2 },
  },
};

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const { isTransitioning, transitionName } = useTransition();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  
  // Update current path when location changes
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  // Choose transition variant based on path or context
  const getTransitionVariant = () => {
    // Default transitions for specific routes
    if (location.pathname.includes('/khoa-hoc')) {
      return transitionVariants.slideLeft;
    } else if (location.pathname.includes('/profile')) {
      return transitionVariants.slideUp;
    } else if (location.pathname.includes('/login') || location.pathname.includes('/register')) {
      return transitionVariants.scale;
    } else if (location.pathname.includes('/admin')) {
      return transitionVariants.rotate;
    }
    
    // Use context-defined transition or default to fade
    return transitionVariants[transitionName as keyof typeof transitionVariants] || transitionVariants.fade;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPath}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={getTransitionVariant()}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="page-transition-container"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
