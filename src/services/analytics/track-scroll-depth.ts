import { Analytics } from './analytics';

const THRESHOLDS = [25, 50, 75, 100] as const;

export function trackScrollDepth(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const tracked = new Set<number>();

  const onScroll = () => {
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = window.scrollY;

    const maxScrollable = documentHeight - windowHeight;
    if (maxScrollable <= 0) return;

    const scrollPercent = Math.round((scrollTop / maxScrollable) * 100);

    for (const threshold of THRESHOLDS) {
      if (scrollPercent >= threshold && !tracked.has(threshold)) {
        tracked.add(threshold);

        Analytics.track('scroll_depth', {
          percent: threshold,
        });
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', onScroll);
  };
}
