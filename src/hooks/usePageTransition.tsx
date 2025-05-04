
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTransition } from '@/contexts/TransitionContext';

interface TransitionOptions {
  type?: 'fade' | 'slideUp' | 'slideLeft' | 'scale' | 'rotate' | 'none';
  duration?: number;
}

export const usePageTransition = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsTransitioning, setTransitionName } = useTransition();
  
  const navigateWithTransition = (
    to: string, 
    options: TransitionOptions = {}
  ) => {
    const { type = 'fade', duration = 200 } = options;
    
    // Set transition type
    setTransitionName(type);
    setIsTransitioning(true);
    
    // Add transitioning class to body
    document.body.classList.add('page-transitioning');
    
    // Navigate after a brief delay to allow exit animation
    setTimeout(() => {
      navigate(to);
      
      // Remove transitioning class
      setTimeout(() => {
        document.body.classList.remove('page-transitioning');
        setIsTransitioning(false);
      }, duration);
    }, 20); // Giảm thời gian chờ trước khi chuyển trang
  };
  
  // Monitor current route for analytics or other purposes
  useEffect(() => {
    // You could add analytics tracking here
    console.log(`Navigated to: ${location.pathname}`);
  }, [location.pathname]);
  
  return { navigateWithTransition };
};
