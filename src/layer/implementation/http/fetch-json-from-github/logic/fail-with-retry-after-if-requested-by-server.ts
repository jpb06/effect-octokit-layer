import type { HttpClientResponse } from '@effect/platform/HttpClientResponse';
import { Effect, Schema, pipe } from 'effect';

import { OctokitApiRateLimitErrorSchema } from '@errors';

export const failWithRetryAfterIfRequestedByServer =
  (url: string) => (response: HttpClientResponse) =>
    pipe(
      Effect.gen(function* () {
        if (response.status === 403) {
          const { response: unauthorizedResponse } = yield* Schema.validate(
            OctokitApiRateLimitErrorSchema,
          )({
            request: { url },
            response,
          });

          return yield* Effect.fail({
            _tag: 'retry-after' as const,
            retryAfterInSeconds: unauthorizedResponse.headers['retry-after'],
            rateLimiteResource:
              unauthorizedResponse.headers['x-ratelimit-resource'],
            rateLimitReset: unauthorizedResponse.headers['x-ratelimit-reset'],
            rateLimit: unauthorizedResponse.headers['x-ratelimit-limit'],
            rateLimitUsed: unauthorizedResponse.headers['x-ratelimit-used'],
            requestUrl: url.replace('https://api.github.com', ''),
          });
        }

        return yield* Effect.succeed(response);
      }),
      Effect.withSpan('fail-with-retry-after-if-requested-by-server', {
        attributes: { url },
      }),
    );
