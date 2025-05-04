import { getOnePage } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

export interface GetPullRequestReviewCommentsPageArgs extends RepoArgs {
  pullNumber: number;
  page: number;
  reviewId: number;
}

export const getPullRequestReviewCommentsPage = ({
  owner,
  repo,
  pullNumber,
  page,
  reviewId,
}: GetPullRequestReviewCommentsPageArgs) =>
  getOnePage(
    'get-pull-request-review-comments-page',
    'GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments',
    {
      owner,
      repo,
      pull_number: pullNumber,
      per_page: 100,
      page,
      review_id: reviewId,
    },
  );

export type PullRequestReviewCommentsPageItems = EffectResultSuccess<
  typeof getPullRequestReviewCommentsPage
>;
