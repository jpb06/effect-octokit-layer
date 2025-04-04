import { Schema } from 'effect';
import { Effect, pipe } from 'effect';

import { GithubApiError } from './index.js';
import { OctokitApiRateLimitErrorSchema } from './octokit-api-rate-limit-error.schema.js';

export type RetryAfterTag = {
  _tag: 'retry-after';
  retryAfter: string | number;
  requestUrl: string;
};

export const handleOctokitRequestError = (
  error: unknown,
): RetryAfterTag | GithubApiError =>
  Effect.runSync(
    pipe(
      error,
      Schema.validate(OctokitApiRateLimitErrorSchema),
      Effect.map(({ request, response }) => ({
        _tag: 'retry-after' as const,
        retryAfter: response.headers['retry-after'],
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
