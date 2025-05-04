import { getOnePage } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

export interface GetPullRequestReviewsPageArgs extends RepoArgs {
  pullNumber: number;
  page: number;
}

export const getPullRequestReviewsPage = ({
  owner,
  repo,
  pullNumber,
  page,
}: GetPullRequestReviewsPageArgs) =>
  getOnePage(
    'get-pull-request-reviews-page',
    'GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews',
    {
      owner,
      repo,
      pull_number: pullNumber,
      per_page: 100,
      page,
    },
  );

export type PullRequestReviewsPageItems = EffectResultSuccess<
  typeof getPullRequestReviewsPage
>;
