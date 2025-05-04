import { getOnePage } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

export interface GetRepoPullRequestsPageArgs extends RepoArgs {
  page: number;
}

export const getRepoPullRequestsPage = (args: GetRepoPullRequestsPageArgs) =>
  getOnePage('get-repo-pull-requests-page', 'GET /repos/{owner}/{repo}/pulls', {
    ...args,
    state: 'all',
    per_page: 100,
  });

export type RepoPullRequestsPageItems = EffectResultSuccess<
  typeof getRepoPullRequestsPage
>;
