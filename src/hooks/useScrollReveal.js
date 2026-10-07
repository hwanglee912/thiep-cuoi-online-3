import { useLayoutEffect } from 'react';

// One observer, no scroll listeners or React renders during scrolling.
export default function useScrollReveal(rootRef, enabled, revision) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!enabled || !root) return;
    const elements = [...root.querySelectorAll('[data-reveal]')];
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.add('is-revealed');
        observer.unobserve(target);
      });
    }, { threshold: 0.08 });
    elements.forEach((element) => {
      if (element.getBoundingClientRect().bottom <= 0) return;
      element.classList.add('reveal-ready');
      observer.observe(element);
    });
    const showAll = () => {
      if (preference.matches) {
        observer.disconnect();
        elements.forEach((element) => element.classList.remove('reveal-ready'));
      }
    };
    preference.addEventListener('change', showAll);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', showAll);
      elements.forEach((element) => element.classList.remove('reveal-ready', 'is-revealed'));
    };
  }, [rootRef, enabled, revision]);
}
