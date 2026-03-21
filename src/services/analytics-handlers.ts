import { Analytics } from './analytics';

export function createTrackedLinkHandler(
  ctaName: string,
  options: {
    location?: string;
    url?: string;
    label?: string;
  },
) {
  return () => {
    Analytics.trackCta(ctaName, options);
  };
}
