/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeIsoDate(): R;
      toBeUUID(): R;
    }
    interface Expect {
      toBeIsoDate(): void;
      toBeUUID(): void;
    }
  }
}

import * as moment from 'moment';

expect.extend({
  toBeIsoDate(received: string) {
    const pass = moment(received, moment.ISO_8601).isValid();
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid ISO date`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid ISO date`,
        pass: false,
      };
    }
  },
  toBeUUID(received: string) {
    const pass = !!received.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid UUID`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid UUID`,
        pass: false,
      };
    }
  },
});

export default undefined;
