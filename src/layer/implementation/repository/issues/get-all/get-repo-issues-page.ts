import { getOnePage } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

import type { GetRepoIssuesArgs } from './get-repo-issues.types.js';

export interface GetRepoIssuesPageArgs extends RepoArgs, GetRepoIssuesArgs {
  page: number;
}

export const getRepoIssuesPage = (args: GetRepoIssuesPageArgs) =>
  getOnePage('get-repo-issues-page', 'GET /repos/{owner}/{repo}/issues', {
    ...args,
    per_page: 100,
  });

export type IssuesPageItems = EffectResultSuccess<typeof getRepoIssuesPage>;
