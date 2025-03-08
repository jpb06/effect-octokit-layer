import { defaultConcurrency } from '@constants';

import { tapLayer } from '../../../effects/tap-layer.effect.js';
import { OctokitLayerContext as Context } from '../../../octokit.context.js';
import type { RepoArgs } from '../types/repo-args.type.js';
import { pullRequestsReviewsApi } from './pull-requests-reviews.js';

export const repoPullRequestsApi = ({ owner, name }: RepoArgs) => ({
  pulls: (concurrency = defaultConcurrency) =>
    tapLayer(Context, ({ getRepoPullRequests }) =>
      getRepoPullRequests({ owner, repo: name, concurrency }),
    ),
  pull: (number: number) => ({
    details: () =>
      tapLayer(Context, ({ getPullRequest }) =>
        getPullRequest({ owner, repo: name, number }),
      ),
    comments: (concurrency = defaultConcurrency) =>
      tapLayer(Context, ({ getPullRequestComments }) =>
        getPullRequestComments({
          owner,
          repo: name,
          pullNumber: number,
          concurrency,
        }),
      ),
    ...pullRequestsReviewsApi({ owner, name, pullNumber: number }),
  }),
});
