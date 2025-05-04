import { Effect, pipe } from 'effect';

import { getAllPages } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

import { getOrgReposPage } from './get-org-repos-page.js';

export interface GetOrgRepositoriesArgs {
  org: string;
  concurrency?: number;
}

const getOrgPage =
  ({ org }: GetOrgRepositoriesArgs) =>
  (page: number) =>
    getOrgReposPage({
      org,
      page,
    });

export const getOrgRepositories = (args: GetOrgRepositoriesArgs) =>
  pipe(
    getAllPages(getOrgPage, args),
    Effect.withSpan('get-org-repositories', {
      attributes: { ...args },
    }),
  );

export type OrgRepositoriesResult = EffectResultSuccess<
  typeof getOrgRepositories
>;
