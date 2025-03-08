import { Effect, pipe } from 'effect';

import {
  handleOctokitRequestError,
  warnOnRetryAndFailWithApiRateLimitError,
} from '@errors';
import { githubSourceAnalysisProvider } from '@provider';
import { retryAfterSchedule } from '@schedules';
import type { EffectResultSuccess } from '@types';

export interface PullRequestCommentCreationArgs {
  owner: string;
  repo: string;
  pullNumber: number;
  body: string;
  commitId: string;
  path: string;
}

// https://docs.github.com/en/rest/pulls/comments?apiVersion=2022-11-28#create-a-review-comment-for-a-pull-request
export const createPullRequestComment = ({
  owner,
  repo,
  pullNumber,
  body,
  commitId,
  path,
}: PullRequestCommentCreationArgs) =>
  pipe(
    githubSourceAnalysisProvider,
    Effect.flatMap((octokit) =>
      pipe(
        Effect.tryPromise({
          try: () =>
            octokit.request(
              'POST /repos/{owner}/{repo}/pulls/{pull_number}/comments',
              {
                owner,
                repo,
                pull_number: pullNumber,
                body,
                commit_id: commitId,
                path,
              },
            ),
          catch: handleOctokitRequestError,
        }),
        Effect.catchTag('retry-after', warnOnRetryAndFailWithApiRateLimitError),
        Effect.retry(retryAfterSchedule),
      ),
    ),
    Effect.map((response) => response.data),
    Effect.withSpan('create-pull-request-comment', {
      attributes: { owner, repo, pullNumber, commitId, path },
    }),
  );

export type CreatePullRequestCommentResult = EffectResultSuccess<
  typeof createPullRequestComment
>;
