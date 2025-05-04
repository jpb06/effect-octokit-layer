import { getOnePage } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

export interface GetOrgReposPageArgs {
  org: string;
  page: number;
}

export const getOrgReposPage = (args: GetOrgReposPageArgs) =>
  getOnePage('get-org-repos-page', 'GET /orgs/{org}/repos', {
    ...args,
    type: 'all',
    per_page: 100,
  });

export type OrgReposPageItems = EffectResultSuccess<typeof getOrgReposPage>;
