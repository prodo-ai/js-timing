# JS Timing

Utility library for handling time and timing.

## Usage

Most of the functions in this library rely on a single main type, `Duration`. To create a duration, use the `duration` method:

```javascript
import {duration, HOUR, SECONDS} from "@prodo-ai/js-timing";

const tenSeconds = duration(10, SECONDS);
const oneHour = duration(1, HOUR);
```

You can then modify durations, or convert them to different units:

```javascript
const threeHours = oneHour.times(3);

const waitInMinutes = (numMinutes: number) => {/*...*/};
waitInMinutes(oneHour.in(MINUTES));
```

### waitFor

Returns a `Promise` that will return after a provided duration;

```javascript
import {waitFor} from "@prodo-ai/js-timing";

waitFor(duration(10, SECONDS)).then(() => console.log("Done."));
```

### repeatedly

Runs a callback again and again. The optional second parameter specifies how much delay should be included between each execution:

```javascript
import {repeatedly} from "@prodo-ai/js-timing";

const callback = () => {
  console.log("foo")
};

const cancel = repeatedly(callback);
waitFor(duration(10, SECONDS)).then(cancel);

const cancel2 = repeatedly(callback, duration(1, SECOND));
waitFor(duration(10, SECONDS)).then(cancel2);
```

You can control the duration between each execution by returning a `Duration` from your callback - the execution of the next callback will only happen after that duration has passed:

```javascript
const callback = () => {
  console.log("foo");
  return duration(1, SECOND);
};
const cancel = repeatedly(callback);

waitFor(duration(10, SECONDS)).then(cancel); // The callback will executed
```

You can also specify an error handler:

```javascript
const callback = () => {
  throw new Error("Failed.");
};
const errorHandler = (error) => {
  console.error(error.message);
};
const cancel = repeatedly(callback, duration(1, MILLISECOND), errorHandler);
```

### every

Actually, this is just the same as repeatedly.


## Information

Owner: Prodo Tech Ltd

Maintainer: [tdawes](https://github.com/tdawes)

License: UNLICENSED (for now)
