import { useEffect, useRef, useState } from 'react';

/**
 * Universal Scroll Reveal Hook with dynamic DOM mutation tracking
 */
export function useScrollReveal(options = {}) {
  const elementRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsRevealed(true);
      document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            if (entry.target === elementRef.current) {
              setIsRevealed(true);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: options.rootMargin || '0px 0px -30px 0px',
        threshold: options.threshold || 0.08
      }
    );

    const observeAll = () => {
      if (elementRef.current) {
        observer.observe(elementRef.current);
      }
      const elements = document.querySelectorAll('.reveal-on-scroll:not(.revealed)');
      elements.forEach((el) => {
        // If already in viewport on initial load, reveal immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('revealed');
        } else {
          observer.observe(el);
        }
      });
    };

    observeAll();

    // Re-check when children or routes change
    const mutationObserver = new MutationObserver(() => {
      observeAll();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Clean observer disconnect on unmount
    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [options.rootMargin, options.threshold]);

  return [elementRef, isRevealed];
}

export default useScrollReveal;
