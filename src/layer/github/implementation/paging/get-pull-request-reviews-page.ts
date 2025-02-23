import type { EffectResultSuccess } from '@types';
import { getOnePage } from '../generic/get-one-page/get-one-page.effect.js';

export interface GetPullRequestReviewsPageArgs {
  owner: string;
  repo: string;
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
