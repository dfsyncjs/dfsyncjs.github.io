import type { AnalyticsEvent, AnalyticsProvider } from '../types';

export class GA4Provider implements AnalyticsProvider {
  track(event: AnalyticsEvent): void {
    if (typeof window === 'undefined') {
      return;
    }
    if (typeof window.gtag !== 'function') {
      return;
    }

    window.gtag('event', event.name, event.params);
  }
}
