import { Effect, pipe } from 'effect';

import {
  handleOctokitRequestError,
  warnOnRetryAndFailWithApiRateLimitError,
} from '@errors';
import type { RepoArgs } from '@implementation/types';
import { githubSourceAnalysisProvider } from '@provider';
import { retryAfterSchedule } from '@schedules';
import type { EffectResultSuccess } from '@types';

export interface PullRequestReviewComment {
  path: string;
  position?: number;
  body: string;
  line?: number;
  side?: string;
  start_line?: number;
  start_side?: string;
}

export interface PullRequestReviewCreationArgs extends RepoArgs {
  pullNumber: number;
  event: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT' | undefined;
  body: string;
  comments: PullRequestReviewComment[];
}

export const createPullRequestReview = ({
  owner,
  repo,
  pullNumber,
  body,
  event,
  comments,
}: PullRequestReviewCreationArgs) =>
  pipe(
    githubSourceAnalysisProvider,
    Effect.flatMap((octokit) =>
      pipe(
        Effect.tryPromise({
          try: () => {
            const commonProps = {
              owner,
              repo,
              pull_number: pullNumber,
              body,
              comments,
            };
            return event === undefined
              ? octokit.request(
                  'POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews',
                  commonProps,
                )
              : octokit.request(
                  'POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews',
                  {
                    ...commonProps,
                    event,
                  },
                );
          },
          catch: handleOctokitRequestError,
        }),
        Effect.catchTag('retry-after', warnOnRetryAndFailWithApiRateLimitError),
        Effect.retry(retryAfterSchedule),
      ),
    ),
    Effect.map((response) => response.data),
    Effect.withSpan('create-pull-request-review', {
      attributes: { owner, repo, pullNumber, event },
    }),
  );

export type CreatePullRequestReviewResult = EffectResultSuccess<
  typeof createPullRequestReview
>;
