import { differenceInSeconds, fromUnixTime } from 'date-fns';
import { Console, Effect } from 'effect';

import {
  rateLimitErrorMessage,
  rateLimitExceededWarningMessage,
  retryWarningMessage,
} from '@constants';

import {
  ApiRateLimitError,
  GithubApiError,
  type RetryAfterTag,
} from './index.js';

export const warnOnRetryAndFailWithApiRateLimitError = ({
  requestUrl,
  retryAfterInSeconds,
  rateLimitReset,
  rateLimit,
  rateLimitUsed,
  rateLimiteResource,
}: RetryAfterTag) =>
  Effect.gen(function* () {
    if (retryAfterInSeconds !== undefined) {
      yield* Console.warn(retryWarningMessage(requestUrl, retryAfterInSeconds));

      return yield* new ApiRateLimitError({
        retryAfterInSeconds,
      });
    }
    if (rateLimitReset !== undefined) {
      const retryAfterInSeconds = differenceInSeconds(
        fromUnixTime(+rateLimitReset),
        new Date(),
      );

      if (
        rateLimit !== undefined &&
        rateLimit === rateLimitUsed &&
        rateLimiteResource !== undefined
      ) {
        yield* Console.warn(
          rateLimitExceededWarningMessage(rateLimiteResource, rateLimit),
        );
      }
      yield* Console.warn(retryWarningMessage(requestUrl, retryAfterInSeconds));

      return yield* new ApiRateLimitError({
        retryAfterInSeconds,
      });
    }

    yield* Console.error(rateLimitErrorMessage(requestUrl));
    return yield* new GithubApiError({
      message: 'Rate limit error',
    });
  });
