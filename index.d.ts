export type TimeUnit = 1 | 1000 | 60000 | 3600000 | 86400000;
export type Cancel = () => Promise<void>;
export type ErrorHandler = (error: Error) => void;

export interface Duration {
  in: (targetUnit: TimeUnit) => number;
  times: (multiple: number) => Duration;
}

export const MILLISECOND: TimeUnit;
export const MILLISECONDS: TimeUnit;
export const SECOND: TimeUnit;
export const SECONDS: TimeUnit;
export const MINUTE: TimeUnit;
export const MINUTES: TimeUnit;
export const HOUR: TimeUnit;
export const HOURS: TimeUnit;
export const DAY: TimeUnit;
export const DAYS: TimeUnit;

export const DefaultErrorHandler: ErrorHandler;

export const duration: (magnitude: number, unit: TimeUnit) => Duration;
export const every: (
  delay: Duration,
  behaviour: () => Promise<void> | void,
  onError: ErrorHandler,
) => Cancel;
export const repeatedly: (
  behaviour: () => Promise<Duration | null> | Duration | null,
  defaultDelay: Duration,
  onError: ErrorHandler,
) => Cancel;
export const waitFor: (duration: Duration) => Promise<void>;

