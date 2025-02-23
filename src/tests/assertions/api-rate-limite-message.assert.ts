import { expect } from 'vitest';

import { type WithRequestUrl, retryWarningMessage } from '@constants';

export const expectApiRateLimitMessages = (
  error: WithRequestUrl,
  retryDelay: number,
) => {
  expect(console.warn).toHaveBeenCalledTimes(2);
  expect(console.warn).toHaveBeenNthCalledWith(
    1,
    retryWarningMessage(error, retryDelay),
  );
  expect(console.warn).toHaveBeenNthCalledWith(
    2,
    retryWarningMessage(error, retryDelay),
  );
};
