import type { Effect } from 'effect';

import { defaultConcurrency } from '@constants';
import type {
  CreatePullRequestCommentResult,
  DeletePullRequestCommentResult,
  PullRequestCommentCreationArgs,
  PullRequestReviewCommentsResult,
} from '@implementation';
import type { RepoArgs } from '@implementation/types';

import {
  OctokitLayerContext as Context,
  type LayerErrors,
  type Octokit,
} from '../../../octokit.context.js';
import { tapLayer } from '../../effects/tap-octokit-layer.effect.js';

type PullRequestsReviewsCommentsApi = RepoArgs & {
  pullNumber: number;
  reviewId: number;
};

export const pullRequestsReviewsCommentsApi = ({
  owner,
  repo,
  pullNumber,
  reviewId,
}: PullRequestsReviewsCommentsApi) => ({
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/pulls/comments?apiVersion=2022-11-28#create-a-review-comment-for-a-pull-request
   */
  create: (
    args: Pick<PullRequestCommentCreationArgs, 'body' | 'commitId' | 'path'>,
  ): Effect.Effect<CreatePullRequestCommentResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ createPullRequestComment }) =>
      createPullRequestComment({
        owner,
        repo,
        pullNumber,
        ...args,
      }),
    ),
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/pulls/reviews#list-comments-for-a-pull-request-review
   */
  get: (
    concurrency = defaultConcurrency,
  ): Effect.Effect<PullRequestReviewCommentsResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ getPullRequestReviewComments }) =>
      getPullRequestReviewComments({
        owner,
        repo,
        pullNumber,
        reviewId,
        concurrency,
      }),
    ),
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/pulls/comments?apiVersion=2022-11-28#delete-a-review-comment-for-a-pull-request
   */
  delete: (
    commentId: number,
  ): Effect.Effect<DeletePullRequestCommentResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ deletePullRequestComment }) =>
      deletePullRequestComment({
        owner,
        repo,
        commentId,
      }),
    ),
});
