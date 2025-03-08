import { Effect, pipe } from 'effect';

import {
  handleOctokitRequestError,
  warnOnRetryAndFailWithApiRateLimitError,
} from '@errors';
import { githubSourceAnalysisProvider } from '@provider';
import { retryAfterSchedule } from '@schedules';
import type { EffectResultSuccess } from '@types';

export interface PullRequestCommentDeletionArgs {
  owner: string;
  repo: string;
  commentId: number;
}

// https://docs.github.com/en/rest/pulls/comments?apiVersion=2022-11-28#delete-a-review-comment-for-a-pull-request
export const deletePullRequestComment = ({
  owner,
  repo,
  commentId,
}: PullRequestCommentDeletionArgs) =>
  pipe(
    githubSourceAnalysisProvider,
    Effect.flatMap((octokit) =>
      pipe(
        Effect.tryPromise({
          try: () =>
            octokit.request(
              'DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}',
              {
                owner,
                repo,
                comment_id: commentId,
              },
            ),
          catch: handleOctokitRequestError,
        }),
        Effect.catchTag('retry-after', warnOnRetryAndFailWithApiRateLimitError),
        Effect.retry(retryAfterSchedule),
      ),
    ),
    Effect.map((response) => response.data),
    Effect.withSpan('delete-pull-request-comment', {
      attributes: { owner, repo, commentId },
    }),
  );

export type DeletePullRequestCommentResult = EffectResultSuccess<
  typeof deletePullRequestComment
>;
