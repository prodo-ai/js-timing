// @flow

import type {Cancel, Duration, ErrorHandler} from "./types";
import {DefaultErrorHandler} from "./errors";

import {MILLISECONDS} from "./constants";

export const repeatedly = (
  behaviour: () => Promise<?Duration> | ?Duration,
  defaultDelay: Duration,
  onError: ErrorHandler = DefaultErrorHandler,
): Cancel => {
  let pendingCancellation = false;
  let cancelResolvers = [];
  let done = false;
  let cancelWait = () => {};

  const cancel = () =>
    new Promise(resolve => {
      if (done) {
        return resolve();
      }
      pendingCancellation = true;
      cancelResolvers.push(resolve);
      cancelWait();
    });

  const cancelled = () => {
    for (let resolve of cancelResolvers) {
      resolve();
    }
    cancelResolvers = [];
    done = true;
  };

  const iterate = async () => {
    let delay;
    try {
      delay = await behaviour();
    } catch (error) {
      onError(error);
    }
    const delayInMilliseconds = (delay || defaultDelay).in(MILLISECONDS);

    if (pendingCancellation || done) {
      cancelled();
      return;
    }
    await new Promise(resolve => {
      const cancellationToken = setTimeout(resolve, delayInMilliseconds);
      cancelWait = () => {
        clearTimeout(cancellationToken);
        resolve();
      };
    });

    if (pendingCancellation) {
      cancelled();
    }
    if (done) {
      return;
    }
    return iterate();
  };

  iterate();
  return cancel;
};
