import { getOnePage } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

export interface GetRepoReleasesPageArgs extends RepoArgs {
  page: number;
}

export const getRepoReleasesPage = (args: GetRepoReleasesPageArgs) =>
  getOnePage('get-repo-releases-page', 'GET /repos/{owner}/{repo}/releases', {
    ...args,
    per_page: 100,
  });

export type RepoReleasesPageItems = EffectResultSuccess<
  typeof getRepoReleasesPage
>;
