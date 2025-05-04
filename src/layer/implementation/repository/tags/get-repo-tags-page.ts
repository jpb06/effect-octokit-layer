import { getOnePage } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

export interface GetRepoTagsPageArgs extends RepoArgs {
  page: number;
}

export const getRepoTagsPage = (args: GetRepoTagsPageArgs) =>
  getOnePage('get-repo-tags-page', 'GET /repos/{owner}/{repo}/tags', {
    ...args,
    per_page: 100,
  });

export type RepoTagsPageItems = EffectResultSuccess<typeof getRepoTagsPage>;
