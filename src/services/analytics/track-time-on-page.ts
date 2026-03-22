import { Analytics } from './analytics';

export function trackTimeOnPage(seconds: number): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const timeoutId = window.setTimeout(() => {
    Analytics.track('time_on_page', {
      seconds,
    });
  }, seconds * 1000);

  return () => {
    window.clearTimeout(timeoutId);
  };
}
