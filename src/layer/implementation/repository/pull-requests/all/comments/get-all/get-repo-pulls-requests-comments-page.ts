import { getOnePage } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

export interface GetRepoPullRequestsCommentsPageArgs extends RepoArgs {
  page: number;
}

export const getRepoPullRequestsCommentsPage = ({
  owner,
  repo,
  page,
}: GetRepoPullRequestsCommentsPageArgs) =>
  getOnePage(
    'get-repo-pull-requests-comments-page',
    'GET /repos/{owner}/{repo}/pulls/comments',
    {
      owner,
      repo,
      per_page: 100,
      page,
    },
  );

export type PullRequestCommentsPageItems = EffectResultSuccess<
  typeof getRepoPullRequestsCommentsPage
>;
