import { Effect, pipe } from 'effect';

import {
  handleOctokitRequestError,
  warnOnRetryAndFailWithApiRateLimitError,
} from '@errors';
import { githubSourceAnalysisProvider } from '@provider';
import { retryAfterSchedule } from '@schedules';
import type { EffectResultSuccess } from '@types';

/**
 * Github documentation:
 * https://docs.github.com/en/rest/orgs/orgs#list-organizations-for-the-authenticated-user
 */
export const getUserOrgs = (username: string) =>
  pipe(
    githubSourceAnalysisProvider,
    Effect.flatMap((octokit) =>
      pipe(
        Effect.tryPromise({
          try: () =>
            octokit.request('GET /user/orgs', {
              username,
              per_page: 100,
            }),
          catch: handleOctokitRequestError,
        }),
        Effect.catchTag('retry-after', warnOnRetryAndFailWithApiRateLimitError),
        Effect.retry(retryAfterSchedule),
      ),
    ),
    Effect.map((response) => response.data),
    Effect.withSpan('get-user-orgs', {
      attributes: { username },
    }),
  );

export type UserOrgsResult = EffectResultSuccess<typeof getUserOrgs>;
