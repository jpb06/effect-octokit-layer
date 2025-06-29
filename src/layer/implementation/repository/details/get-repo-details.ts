import { Effect, pipe } from 'effect';

import {
  handleOctokitRequestError,
  warnOnRetryAndFailWithApiRateLimitError,
} from '@errors';
import type { RepoArgs } from '@implementation/types';
import { githubSourceAnalysisProvider } from '@provider';
import { retryAfterSchedule } from '@schedules';
import type { EffectResultSuccess } from '@types';

/**
 * Github documentation:
 * https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository
 */
export const getRepoDetails = (args: RepoArgs) =>
  pipe(
    githubSourceAnalysisProvider,
    Effect.flatMap((octokit) =>
      pipe(
        Effect.tryPromise({
          try: () => octokit.request('GET /repos/{owner}/{repo}', args),
          catch: handleOctokitRequestError,
        }),
        Effect.catchTag('retry-after', warnOnRetryAndFailWithApiRateLimitError),
        Effect.retry(retryAfterSchedule),
      ),
    ),
    Effect.map((response) => response.data),
    Effect.withSpan('get-repo-details', {
      attributes: args,
    }),
  );

export type RepoDetailsResult = EffectResultSuccess<typeof getRepoDetails>;
