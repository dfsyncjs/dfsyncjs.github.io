import { Analytics } from './analytics';
import type { AnalyticsEventParams } from './types';

type TrackedLinkHandlerOptions = {
  eventName?: string;
  params?: AnalyticsEventParams;
};

export function createTrackedLinkHandler(options: TrackedLinkHandlerOptions = {}) {
  const { eventName = 'cta_click', params } = options;

  return () => {
    Analytics.track(eventName, params);
  };
}
