import { Effect, pipe } from 'effect';

import { getAllPages } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

import { getRepoReleasesPage } from './get-repo-releases-page.js';

export interface GetRepoReleasesArgs extends RepoArgs {
  concurrency?: number;
}

const getPage = (args: GetRepoReleasesArgs) => (page: number) =>
  getRepoReleasesPage({
    ...args,
    page,
  });

export const getRepoReleases = (args: GetRepoReleasesArgs) =>
  pipe(
    getAllPages(getPage, args),
    Effect.withSpan('get-repo-releases', {
      attributes: { ...args },
    }),
  );

export type RepoReleasesResult = EffectResultSuccess<typeof getRepoReleases>;
