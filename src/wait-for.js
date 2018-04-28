// @flow

import type {Duration} from "./types";

import {MILLISECONDS} from "./constants";

export const waitFor = (waitDuration: Duration): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, waitDuration.in(MILLISECONDS)));
