import { defaultConcurrency } from '@constants';
import type { PullRequestCommentCreationArgs } from '@implementation';

import { tapLayer } from '../../../effects/tap-layer.effect.js';
import { OctokitLayerContext as Context } from '../../../octokit.context.js';
import type { RepoArgs } from '../types/repo-args.type.js';

type PullRequestsReviewsCommentsApi = RepoArgs & {
  pullNumber: number;
  reviewId: number;
};

export const pullRequestsReviewsCommentsApi = ({
  owner,
  name,
  pullNumber,
  reviewId,
}: PullRequestsReviewsCommentsApi) => ({
  create: (
    args: Pick<PullRequestCommentCreationArgs, 'body' | 'commitId' | 'path'>,
  ) =>
    tapLayer(Context, ({ createPullRequestComment }) =>
      createPullRequestComment({
        owner,
        repo: name,
        pullNumber,
        ...args,
      }),
    ),
  get: (concurrency = defaultConcurrency) =>
    tapLayer(Context, ({ getPullRequestReviewComments }) =>
      getPullRequestReviewComments({
        owner,
        repo: name,
        pullNumber,
        reviewId,
        concurrency,
      }),
    ),
  delete: (commentId: number) =>
    tapLayer(Context, ({ deletePullRequestComment }) =>
      deletePullRequestComment({
        owner,
        repo: name,
        commentId,
      }),
    ),
});
