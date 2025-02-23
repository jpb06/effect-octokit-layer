import type { EffectResultSuccess } from '@types';

import { getOnePage } from '../generic/get-one-page/get-one-page.effect.js';

export interface GetRepoIssuesPageArgs {
  owner: string;
  repo: string;
  page: number;
}

export const getRepoIssuesPage = (args: GetRepoIssuesPageArgs) =>
  getOnePage('get-repo-issues-page', 'GET /repos/{owner}/{repo}/issues', {
    ...args,
    per_page: 100,
  });

export type IssuesPageItems = EffectResultSuccess<typeof getRepoIssuesPage>;
