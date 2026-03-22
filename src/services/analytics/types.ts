export type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

export type AnalyticsEvent = {
  name: string;
  params?: AnalyticsEventParams;
};

export interface AnalyticsProvider {
  track(event: AnalyticsEvent): void;
}
