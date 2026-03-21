type AnalyticsEventName = 'cta_click' | 'page_view' | 'custom_event';

type CtaName = 'github' | 'npm' | 'docs';

type TrackEventParams = Record<string, string | number | boolean | undefined>;

export class Analytics {
  private static isEnabled(): boolean {
    return typeof window !== 'undefined' && typeof window.gtag === 'function';
  }

  static track(eventName: AnalyticsEventName | string, params?: TrackEventParams): void {
    if (!this.isEnabled()) return;

    window.gtag!('event', eventName, params ?? {});
  }

  static trackCta(
    ctaName: CtaName | string,
    params?: {
      location?: string;
      url?: string;
      label?: string;
    },
  ): void {
    this.track('cta_click', {
      cta_name: ctaName,
      location: params?.location,
      link_url: params?.url,
      label: params?.label,
    });
  }

  static trackPageView(path: string, title?: string): void {
    if (!this.isEnabled()) return;

    window.gtag!('event', 'page_view', {
      page_path: path,
      page_title: title,
      page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    });
  }
}
