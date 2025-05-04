import { Effect, pipe } from 'effect';

import {
  handleOctokitRequestError,
  warnOnRetryAndFailWithApiRateLimitError,
} from '@errors';
import type { RepoArgs } from '@implementation/types';
import { githubSourceAnalysisProvider } from '@provider';
import { retryAfterSchedule } from '@schedules';
import type { EffectResultSuccess } from '@types';

export interface GetRepoLanguagesArgs extends RepoArgs {}

export const getRepoLanguages = (args: GetRepoLanguagesArgs) =>
  pipe(
    githubSourceAnalysisProvider,
    Effect.flatMap((octokit) =>
      pipe(
        Effect.tryPromise({
          try: () =>
            octokit.request('GET /repos/{owner}/{repo}/languages', args),
          catch: handleOctokitRequestError,
        }),
        Effect.catchTag('retry-after', warnOnRetryAndFailWithApiRateLimitError),
        Effect.retry(retryAfterSchedule),
      ),
    ),
    Effect.map((response) => response.data),
    Effect.withSpan('get-repo-languages', {
      attributes: { ...args },
    }),
  );

export type RepoLanguagesResult = EffectResultSuccess<typeof getRepoLanguages>;
