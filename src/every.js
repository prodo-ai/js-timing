// @flow

import type {Cancel, Duration, ErrorHandler} from "./types";
import {DefaultErrorHandler} from "./errors";
import {repeatedly} from "./repeatedly";

export const every = (
  delay: Duration,
  behaviour: () => Promise<void> | void,
  onError: ErrorHandler = DefaultErrorHandler,
): Cancel => {
  const behaviourWithDelay = () => behaviour();
  return repeatedly(behaviourWithDelay, delay, onError);
};
