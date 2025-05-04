import type { Effect } from 'effect';

import { defaultConcurrency } from '@constants';
import type {
  CreatePullRequestReviewResult,
  DeletePullRequestReviewResult,
  PullRequestReviewCreationArgs,
  PullRequestReviewsResult,
} from '@implementation';
import type { RepoArgs } from '@implementation/types';

import {
  OctokitLayerContext as Context,
  type LayerErrors,
  type Octokit,
} from '../../../octokit.context.js';
import { tapLayer } from '../../effects/tap-octokit-layer.effect.js';
import { pullRequestsReviewsCommentsApi } from './pull-requests-reviews-comments.api.js';

type PullRequestsReviewsApiArgs = RepoArgs & {
  pullNumber: number;
};

export const pullRequestsReviewsApi = ({
  owner,
  repo,
  pullNumber,
}: PullRequestsReviewsApiArgs) => ({
  review: (reviewId: number) => ({
    comments: pullRequestsReviewsCommentsApi({
      owner,
      repo,
      pullNumber,
      reviewId,
    }),
  }),
  reviews: {
    /**
     * Github documentation:
     * https://docs.github.com/en/rest/pulls/reviews?apiVersion=2022-11-28#create-a-review-for-a-pull-request
     */
    create: (
      args: Pick<PullRequestReviewCreationArgs, 'body' | 'comments' | 'event'>,
    ): Effect.Effect<CreatePullRequestReviewResult, LayerErrors, Octokit> =>
      tapLayer(Context, ({ createPullRequestReview }) =>
        createPullRequestReview({
          owner,
          repo,
          pullNumber,
          ...args,
        }),
      ),
    /**
     * Github documentation:
     * https://docs.github.com/en/rest/pulls/reviews?apiVersion=2022-11-28#list-reviews-for-a-pull-request
     */
    get: (
      concurrency = defaultConcurrency,
    ): Effect.Effect<PullRequestReviewsResult, LayerErrors, Octokit> =>
      tapLayer(Context, ({ getPullRequestReviews }) =>
        getPullRequestReviews({
          owner,
          repo,
          pullNumber,
          concurrency,
        }),
      ),
    /**
     * Github documentation:
     * https://docs.github.com/en/rest/pulls/reviews?apiVersion=2022-11-28#delete-a-pending-review-for-a-pull-request
     */
    delete: (
      reviewId: number,
    ): Effect.Effect<DeletePullRequestReviewResult, LayerErrors, Octokit> =>
      tapLayer(Context, ({ deletePullRequestReview }) =>
        deletePullRequestReview({
          owner,
          repo,
          pullNumber,
          reviewId,
        }),
      ),
  },
});
