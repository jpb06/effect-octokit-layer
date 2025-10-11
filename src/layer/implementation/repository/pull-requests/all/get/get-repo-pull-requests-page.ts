import { getOnePage } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

import type { GetRepoPullRequestsArgs } from './get-repo-pull-requests.types.js';

export interface GetRepoPullRequestsPageArgs
  extends RepoArgs,
    GetRepoPullRequestsArgs {
  page: number;
}

export const getRepoPullRequestsPage = (args: GetRepoPullRequestsPageArgs) =>
  getOnePage('get-repo-pull-requests-page', 'GET /repos/{owner}/{repo}/pulls', {
    ...args,
    per_page: 100,
  });

export type RepoPullRequestsPageItems = EffectResultSuccess<
  typeof getRepoPullRequestsPage
>;
