import { getOnePage } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

export interface GetPullRequestCommentsPageArgs extends RepoArgs {
  pullNumber: number;
  page: number;
}

export const getPullRequestCommentsPage = ({
  owner,
  repo,
  pullNumber,
  page,
}: GetPullRequestCommentsPageArgs) =>
  getOnePage(
    'get-pull-request-comments-page',
    'GET /repos/{owner}/{repo}/pulls/{pull_number}/comments',
    {
      owner,
      repo,
      pull_number: pullNumber,
      per_page: 100,
      page,
    },
  );

export type PullRequestCommentsPageItems = EffectResultSuccess<
  typeof getPullRequestCommentsPage
>;
