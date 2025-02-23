import { Effect, pipe } from 'effect';

import { handleOctokitRequestError } from '@errors';
import { githubSourceAnalysisProvider } from '@provider';
import { retryAfterSchedule } from '@schedules';
import type { EffectResultSuccess } from '@types';

export interface GetPullRequestArgs {
  owner: string;
  repo: string;
  number: number;
}

export const getPullRequest = ({ owner, repo, number }: GetPullRequestArgs) =>
  Effect.withSpan('get-pull-request', {
    attributes: { owner, repo, number },
  })(
    pipe(
      githubSourceAnalysisProvider,
      Effect.flatMap((octokit) =>
        pipe(
          Effect.tryPromise({
            try: () =>
              octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
                owner,
                repo,
                pull_number: number,
              }),
            catch: handleOctokitRequestError,
          }),
          Effect.retry(retryAfterSchedule),
        ),
      ),
      Effect.map((response) => response.data),
    ),
  );

export type PullRequestResult = EffectResultSuccess<typeof getPullRequest>;
