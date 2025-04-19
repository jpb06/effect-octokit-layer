import { Console, Effect } from 'effect';

import { retryWarningMessage } from '@constants';

import { ApiRateLimitError, type RetryAfterTag } from './index.js';

export const warnOnRetryAndFailWithApiRateLimitError = ({
  requestUrl,
  retryAfter,
}: RetryAfterTag) =>
  Effect.gen(function* () {
    yield* Console.warn(retryWarningMessage(requestUrl, retryAfter));

    return yield* new ApiRateLimitError({
      retryAfter,
    });
  });
