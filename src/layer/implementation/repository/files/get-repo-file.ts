import { Effect, pipe } from 'effect';

import {
  handleOctokitRequestError,
  warnOnRetryAndFailWithApiRateLimitError,
} from '@errors';
import type { RepoArgs } from '@implementation/types';
import { githubSourceAnalysisProvider } from '@provider';
import { retryAfterSchedule } from '@schedules';
import type { EffectResultSuccess } from '@types';

export interface GetRepoFileArgs extends RepoArgs {
  path: string;
  ref?: string;
}

/**
 * Github documentation:
 * https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content
 */
export const getRepoFile = ({ owner, repo, path, ref }: GetRepoFileArgs) =>
  pipe(
    githubSourceAnalysisProvider,
    Effect.flatMap((octokit) =>
      pipe(
        Effect.tryPromise({
          try: () =>
            octokit.request(
              'GET /repos/{owner}/{repo}/contents/{path}?ref={ref}',
              {
                owner,
                repo,
                path,
                ref,
              },
            ),
          catch: handleOctokitRequestError,
        }),
        Effect.catchTag('retry-after', warnOnRetryAndFailWithApiRateLimitError),
        Effect.retry(retryAfterSchedule),
      ),
    ),
    Effect.map((response) => response.data),
    Effect.withSpan('get-repo-file', {
      attributes: {
        owner,
        repo,
        path,
        ref,
      },
    }),
  );

export type GetRepoFileResult = EffectResultSuccess<typeof getRepoFile>;
