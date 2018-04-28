// @flow

export type TimeUnit = 1 | 1000 | 60000 | 3600000 | 86400000;
export type Cancel = () => Promise<void>;
export type Duration = {
  in: (targetUnit: TimeUnit) => number,
  times: (multiple: number) => Duration,
};

export type ErrorHandler = (error: Error) => void;
