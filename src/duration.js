// @flow

import type {Duration, TimeUnit} from "./types";

export const duration = (magnitude: number, unit: TimeUnit): Duration => ({
  in(targetUnit: TimeUnit) {
    return magnitude * unit / targetUnit;
  },
  times(multiple: number) {
    return duration(magnitude * multiple, unit);
  },
});
