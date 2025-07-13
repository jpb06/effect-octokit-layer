import { getOnePage } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

import type { GetRepoPullRequestState } from './get-repo-pull-requests-state.type.js';

export interface GetRepoPullRequestsPageArgs extends RepoArgs {
  page: number;
  state?: GetRepoPullRequestState;
}

export const getRepoPullRequestsPage = (args: GetRepoPullRequestsPageArgs) =>
  getOnePage('get-repo-pull-requests-page', 'GET /repos/{owner}/{repo}/pulls', {
    ...args,
    per_page: 100,
  });

export type RepoPullRequestsPageItems = EffectResultSuccess<
  typeof getRepoPullRequestsPage
>;
