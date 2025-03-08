import { defaultConcurrency } from '@constants';
import type { PullRequestReviewCreationArgs } from '@implementation';

import { tapLayer } from '../../../effects/tap-layer.effect.js';
import { OctokitLayerContext as Context } from '../../../octokit.context.js';
import type { RepoArgs } from '../types/repo-args.type.js';
import { pullRequestsReviewsCommentsApi } from './pull-requests-reviews-comments.js';

type PullRequestsReviewsApiArgs = RepoArgs & {
  pullNumber: number;
};

export const pullRequestsReviewsApi = ({
  owner,
  name,
  pullNumber,
}: PullRequestsReviewsApiArgs) => ({
  review: (reviewId: number) => ({
    comments: pullRequestsReviewsCommentsApi({
      owner,
      name,
      pullNumber,
      reviewId,
    }),
  }),
  reviews: {
    create: (
      args: Pick<PullRequestReviewCreationArgs, 'body' | 'comments' | 'event'>,
    ) =>
      tapLayer(Context, ({ createPullRequestReview }) =>
        createPullRequestReview({
          owner,
          repo: name,
          pullNumber,
          ...args,
        }),
      ),
    get: (concurrency = defaultConcurrency) =>
      tapLayer(Context, ({ getPullRequestReviews }) =>
        getPullRequestReviews({
          owner,
          repo: name,
          pullNumber,
          concurrency,
        }),
      ),
    delete: (reviewId: number) =>
      tapLayer(Context, ({ deletePullRequestReview }) =>
        deletePullRequestReview({
          owner,
          repo: name,
          pullNumber,
          reviewId,
        }),
      ),
  },
});
