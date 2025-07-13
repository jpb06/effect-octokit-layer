import type { Effect } from 'effect';

import { defaultConcurrency } from '@constants';
import type {
  GetRepoPullRequestState,
  PullRequestCommentsResult,
  PullRequestResult,
  RepoPullRequestsResult,
} from '@implementation';
import type { RepoArgs } from '@implementation/types';

import {
  OctokitLayerContext as Context,
  type LayerErrors,
  type Octokit,
} from '../../../octokit.context.js';
import { tapLayer } from '../../effects/tap-octokit-layer.effect.js';
import { pullRequestsReviewsApi } from './pull-requests-reviews.api.js';

export const repoPullRequestsApi = ({ owner, repo }: RepoArgs) => ({
  pulls: {
    /**
     * Github documentation:
     * https://docs.github.com/en/rest/pulls/pulls#list-pull-requests
     */
    getAll: (
      state: GetRepoPullRequestState = 'all',
      concurrency = defaultConcurrency,
    ): Effect.Effect<RepoPullRequestsResult, LayerErrors, Octokit> =>
      tapLayer(Context, ({ getRepoPullRequests }) =>
        getRepoPullRequests({ owner, repo, state, concurrency }),
      ),
    /**
     * Github documentation:
     * https://docs.github.com/en/rest/pulls/comments?apiVersion=2022-11-28#list-review-comments-in-a-repository
     */
    comments: (
      concurrency = defaultConcurrency,
    ): Effect.Effect<PullRequestCommentsResult, LayerErrors, Octokit> =>
      tapLayer(Context, ({ getRepoPullRequestsComments }) =>
        getRepoPullRequestsComments({
          owner,
          repo,
          concurrency,
        }),
      ),
  },
  pull: (number: number) => ({
    /**
     * Github documentation:
     * https://docs.github.com/en/rest/pulls/pulls#get-a-pull-request
     */
    details: (): Effect.Effect<PullRequestResult, LayerErrors, Octokit> =>
      tapLayer(Context, ({ getPullRequest }) =>
        getPullRequest({ owner, repo, number }),
      ),
    /**
     * Github documentation:
     * https://docs.github.com/en/rest/pulls/comments#list-review-comments-on-a-pull-request
     */
    comments: (
      concurrency = defaultConcurrency,
    ): Effect.Effect<PullRequestCommentsResult, LayerErrors, Octokit> =>
      tapLayer(Context, ({ getPullRequestComments }) =>
        getPullRequestComments({
          owner,
          repo,
          pullNumber: number,
          concurrency,
        }),
      ),
    ...pullRequestsReviewsApi({ owner, repo, pullNumber: number }),
  }),
});
