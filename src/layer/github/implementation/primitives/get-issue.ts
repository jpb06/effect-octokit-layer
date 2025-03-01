import { Effect, pipe } from 'effect';

import {
  handleOctokitRequestError,
  warnOnRetryAndFailWithApiRateLimitError,
} from '@errors';
import { githubSourceAnalysisProvider } from '@provider';
import { retryAfterSchedule } from '@schedules';
import type { EffectResultSuccess } from '@types';

export interface GetIssueArgs {
  owner: string;
  repo: string;
  number: number;
}

export const getIssue = ({ owner, repo, number }: GetIssueArgs) =>
  pipe(
    githubSourceAnalysisProvider,
    Effect.flatMap((octokit) =>
      pipe(
        Effect.tryPromise({
          try: () =>
            octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
              owner,
              repo,
              issue_number: number,
            }),
          catch: handleOctokitRequestError,
        }),
        Effect.catchTag('retry-after', warnOnRetryAndFailWithApiRateLimitError),
        Effect.retry(retryAfterSchedule),
      ),
    ),
    Effect.map((response) => response.data),
    Effect.withSpan('get-issue', {
      attributes: { owner, repo, number },
    }),
  );

export type IssueResult = EffectResultSuccess<typeof getIssue>;
