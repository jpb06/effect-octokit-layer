import type { EffectResultSuccess } from '@types';

import { getOnePage } from '../generic/get-one-page/get-one-page.effect.js';

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
