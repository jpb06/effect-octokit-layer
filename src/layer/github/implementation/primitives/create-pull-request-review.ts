import { Effect, pipe } from 'effect';

import {
  handleOctokitRequestError,
  warnOnRetryAndFailWithApiRateLimitError,
} from '@errors';
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

export interface PullRequestReviewCreationArgs {
  owner: string;
  repo: string;
  pullNumber: number;
  event: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT' | undefined;
  body: string;
  comments: PullRequestReviewComment[];
}

// https://docs.github.com/en/rest/pulls/reviews?apiVersion=2022-11-28#create-a-review-for-a-pull-request
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
