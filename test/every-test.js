// @flow

import {duration, every, MILLISECOND} from "../src";
import test from "ava";

test.cb("every: calls the error handler on error", t => {
  const testError = new Error("Test Error");

  const handleError = error => {
    cancel().then(() => {
      t.is(error, testError);
      t.end();
    });
  };

  let firstIteration = true;
  const behaviour = async () => {
    if (firstIteration) {
      firstIteration = false;
      throw testError;
    }
    await cancel();
    t.fail("The error handler was not called.");
    t.end();
  };

  const cancel = every(duration(1, MILLISECOND), behaviour, handleError);
});

test.cb("every: triggers an event repeatedly with a fixed delay", t => {
  let succeeded = false;
  let triggerCount = 0;
  let done;
  const behaviour = () => {
    triggerCount += 1;
    if (!succeeded && triggerCount >= 5) {
      done();
    }
  };
  const fail = error => {
    clearTimeout(failureTimeout);
    cancel().then(() => {
      // @flow-ignore-line
      t.fail(error.message || error);
      t.end();
    });
  };

  const cancel = every(duration(1, MILLISECOND), behaviour, fail);

  const failureTimeout = setTimeout(() => {
    if (!succeeded) {
      fail(`The behaviour was only triggered ${triggerCount} times.`);
    }
  }, 1000);

  new Promise(resolve => {
    done = resolve;
  })
    .then(async () => {
      succeeded = true;
      clearTimeout(failureTimeout);
      await cancel();
      t.end();
    })
    .catch(fail);
});
