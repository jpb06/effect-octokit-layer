import { Effect } from 'effect';

import { retryWarningMessage } from '@constants';
import { Logger } from '@dependencies/logger';

import { ApiRateLimitError, type RetryAfterTag } from './index.js';

export const warnOnRetryAndFailWithApiRateLimitError = ({
  requestUrl,
  retryAfter,
}: RetryAfterTag) =>
  Effect.gen(function* () {
    const { warn } = yield* Logger;

    warn(retryWarningMessage(requestUrl, retryAfter));

    return yield* new ApiRateLimitError({
      retryAfter,
    });
  });
