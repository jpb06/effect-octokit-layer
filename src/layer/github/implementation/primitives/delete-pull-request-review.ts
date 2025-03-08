import { Effect, pipe } from 'effect';

import {
  handleOctokitRequestError,
  warnOnRetryAndFailWithApiRateLimitError,
} from '@errors';
import { githubSourceAnalysisProvider } from '@provider';
import { retryAfterSchedule } from '@schedules';
import type { EffectResultSuccess } from '@types';

export interface PullRequestReviewDeletionArgs {
  owner: string;
  repo: string;
  pullNumber: number;
  reviewId: number;
}

export const deletePullRequestReview = ({
  owner,
  repo,
  pullNumber,
  reviewId,
}: PullRequestReviewDeletionArgs) =>
  pipe(
    githubSourceAnalysisProvider,
    Effect.flatMap((octokit) =>
      pipe(
        Effect.tryPromise({
          try: () =>
            octokit.request(
              'DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}',
              {
                owner,
                repo,
                pull_number: pullNumber,
                review_id: reviewId,
              },
            ),
          catch: handleOctokitRequestError,
        }),
        Effect.catchTag('retry-after', warnOnRetryAndFailWithApiRateLimitError),
        Effect.retry(retryAfterSchedule),
      ),
    ),
    Effect.map((response) => response.data),
    Effect.withSpan('delete-pull-request-review', {
      attributes: { owner, repo, pullNumber, reviewId },
    }),
  );

export type DeletePullRequestReviewResult = EffectResultSuccess<
  typeof deletePullRequestReview
>;
