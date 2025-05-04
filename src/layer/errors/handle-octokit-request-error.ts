import { Schema } from 'effect';
import { Effect, pipe } from 'effect';

import { GithubApiError } from './index.js';
import { OctokitApiRateLimitErrorSchema } from './octokit-api-rate-limit-error.schema.js';

export type RetryAfterTag = {
  _tag: 'retry-after';
  retryAfterInSeconds: string | number | undefined;
  rateLimitReset: string | undefined;
  rateLimiteResource: string | undefined;
  rateLimit: string | undefined;
  rateLimitUsed: string | undefined;
  requestUrl: string;
};

export const handleOctokitRequestError = (
  error: unknown,
): RetryAfterTag | GithubApiError => {
  return Effect.runSync(
    pipe(
      error,
      Schema.validate(OctokitApiRateLimitErrorSchema),
      Effect.map(({ request, response }) => ({
        _tag: 'retry-after' as const,
        retryAfterInSeconds: response.headers['retry-after'],
        rateLimiteResource: response.headers['x-ratelimit-resource'],
        rateLimitReset: response.headers['x-ratelimit-reset'],
        rateLimit: response.headers['x-ratelimit-limit'],
        rateLimitUsed: response.headers['x-ratelimit-used'],
        requestUrl: request.url.replace('https://api.github.com', ''),
      })),
      Effect.catchTag('ParseError', () => {
        if (error instanceof Error) {
          return Effect.succeed(new GithubApiError({ cause: error.message }));
        }
        return Effect.succeed(new GithubApiError({ cause: error }));
      }),
    ),
  );
};
