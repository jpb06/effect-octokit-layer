import type { HttpClient } from '@effect/platform';
import { Effect, pipe } from 'effect';

import {
  GithubApiError,
  warnOnRetryAndFailWithApiRateLimitError,
} from '@errors';
import { retryAfterSchedule } from '@schedules';

import { failWithRetryAfterIfRequestedByServer } from './fail-with-retry-after-if-requested-by-server.js';

export const getFromGithub = (url: string) => (client: HttpClient.HttpClient) =>
  pipe(
    client.get(url, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    }),
    Effect.flatMap(failWithRetryAfterIfRequestedByServer(url)),
    Effect.catchTag('ParseError', (error) => {
      const cause = error instanceof Error ? error.message : error;

      return Effect.fail(new GithubApiError({ cause }));
    }),
    Effect.catchTag('retry-after', warnOnRetryAndFailWithApiRateLimitError),
    Effect.retry(retryAfterSchedule),
    Effect.withSpan('get-from-github', { attributes: { url } }),
  );
