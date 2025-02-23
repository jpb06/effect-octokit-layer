import { Effect, pipe } from 'effect';

import { handleOctokitRequestError } from '@errors';
import { githubSourceAnalysisProvider } from '@provider';
import { retryAfterSchedule } from '@schedules';
import type { EffectResultSuccess } from '@types';

export interface GetIssueArgs {
  owner: string;
  repo: string;
  number: number;
}

export const getIssue = ({ owner, repo, number }: GetIssueArgs) =>
  Effect.withSpan('get-issue', {
    attributes: { owner, repo, number },
  })(
    pipe(
      githubSourceAnalysisProvider,
      Effect.flatMap((octokit) =>
        pipe(
          Effect.tryPromise({
            try: () =>
              octokit.request(
                'GET /repos/{owner}/{repo}/issues/{issue_number}',
                {
                  owner,
                  repo,
                  issue_number: number,
                },
              ),
            catch: handleOctokitRequestError,
          }),
          Effect.retry(retryAfterSchedule),
        ),
      ),
      Effect.map((response) => response.data),
    ),
  );

export type IssueResult = EffectResultSuccess<typeof getIssue>;
