// @flow

import {duration, MILLISECOND, MILLISECONDS, repeatedly} from "../src";
import test from "ava";

test.cb("repeatedly: calls the error handler on error", t => {
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

  const cancel = repeatedly(behaviour, duration(1, MILLISECOND), handleError);
});

test.cb("repeatedly: triggers an event repeatedly", t => {
  let succeeded = false;
  let triggerCount = 0;
  let done;
  const behaviour = () => {
    triggerCount += 1;
    if (!succeeded && triggerCount >= 5) {
      done();
    }
    return duration(triggerCount, MILLISECONDS);
  };
  const fail = error => {
    clearTimeout(failureTimeout);
    cancel().then(() => {
      // @flow-ignore-line
      t.fail(error.message || error);
      t.end();
    });
  };

  const cancel = repeatedly(behaviour, duration(1, MILLISECOND), fail);

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

test.cb("repeatedly: uses the default delay on failure", t => {
  let succeeded = false;
  let triggerCount = 0;
  let done;
  const behaviour = () => {
    triggerCount += 1;
    if (!succeeded && triggerCount >= 5) {
      done();
    }
    throw new Error("Oh no, it broke.");
  };
  const fail = error => {
    clearTimeout(failureTimeout);
    cancel().then(() => {
      // @flow-ignore-line
      t.fail(error.message || error);
      t.end();
    });
  };

  const cancel = repeatedly(behaviour, duration(1, MILLISECOND));

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

test.cb("repeatedly: stops after cancellation", t => {
  let succeeded = false;
  let triggerCount = 0;
  let done;
  const behaviour = () => {
    triggerCount += 1;
    if (!succeeded && triggerCount >= 5) {
      done();
    }
    return duration(1, MILLISECOND);
  };
  const fail = error => {
    clearTimeout(failureTimeout);
    cancel().then(() => {
      // @flow-ignore-line
      t.fail(error.message || error);
      t.end();
    });
  };

  const cancel = repeatedly(behaviour, duration(1, MILLISECOND), fail);

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
      const preCancelTriggerCount = triggerCount;
      await cancel();

      setTimeout(() => {
        if (
          triggerCount !== preCancelTriggerCount &&
          triggerCount !== preCancelTriggerCount + 1
        ) {
          t.fail(
            `Cancelled after ${preCancelTriggerCount} times, but ran ${triggerCount} times.`,
          );
        }
        t.end();
      }, 1000);
    })
    .catch(fail);
});
