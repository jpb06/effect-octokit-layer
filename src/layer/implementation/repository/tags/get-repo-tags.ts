import { Effect, pipe } from 'effect';

import { getAllPages } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

import { getRepoTagsPage } from './get-repo-tags-page.js';

export interface GetRepoTagsArgs extends RepoArgs {
  concurrency?: number;
}

const getPage = (args: GetRepoTagsArgs) => (page: number) =>
  getRepoTagsPage({
    ...args,
    page,
  });

export const getRepoTags = (args: GetRepoTagsArgs) =>
  pipe(
    getAllPages(getPage, args),
    Effect.withSpan('get-repo-tags', {
      attributes: { ...args },
    }),
  );

export type RepoTagsResult = EffectResultSuccess<typeof getRepoTags>;
