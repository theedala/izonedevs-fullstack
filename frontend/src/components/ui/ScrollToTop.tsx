import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // If there's a hash, scroll to that element
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    
    // For regular navigation, scroll to top
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use instant for immediate scroll
      });
      
      // Also ensure document body is scrolled to top
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });
    
    // Handle any potential layout shifts by scrolling again after a short delay
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [pathname, hash, key]);

  return null;
};

export default ScrollToTop;