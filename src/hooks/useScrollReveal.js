import { useEffect, useRef, useState } from 'react';

/**
 * Universal Scroll Reveal Hook
 * Supports both:
 * 1. const [ref, isRevealed] = useScrollReveal(options);
 * 2. useScrollReveal(); // observes all .reveal-on-scroll elements automatically
 */
export function useScrollReveal(options = {}) {
  const elementRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsRevealed(true);
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
        rootMargin: options.rootMargin || '0px 0px -40px 0px',
        threshold: options.threshold || 0.1
      }
    );

    // Observe specific attached ref
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    // Also observe all elements with .reveal-on-scroll class
    const elements = document.querySelectorAll('.reveal-on-scroll:not(.revealed)');
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [options.rootMargin, options.threshold]);

  // Return iterable array so destructuring [ref, isRevealed] always succeeds
  return [elementRef, isRevealed];
}

export default useScrollReveal;
