import { useEffect, useState } from 'react';

const RESPONSIVE_BREAKPOINT = 1440;
const RESIZE_DEBOUNCE_MS = 150;

export const useIsSmallViewport = () => {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const update = () => setIsSmall(window.innerWidth < RESPONSIVE_BREAKPOINT);
    update();

    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(update, RESIZE_DEBOUNCE_MS);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isSmall;
};
