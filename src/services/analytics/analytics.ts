import type { AnalyticsEvent, AnalyticsEventParams, AnalyticsProvider } from './types';

export class Analytics {
  private static provider: AnalyticsProvider | null = null;

  static init(provider: AnalyticsProvider): void {
    this.provider = provider;
  }

  static track(name: string, params?: AnalyticsEventParams): void {
    if (!this.provider) {
      return;
    }

    const event: AnalyticsEvent = {
      name,
      params,
    };

    this.provider.track(event);
  }

  static trackCta(params: {
    ctaName: string;
    location?: string;
    linkUrl?: string;
    label?: string;
  }): void {
    this.track('cta_click', {
      cta_name: params.ctaName,
      location: params.location,
      link_url: params.linkUrl,
      label: params.label,
    });
  }
}
