import { Effect, Match } from 'effect';

import type { EffectResultSuccess } from '@types';
import { getAllPages } from '../generic/get-all-pages.effect.js';
import { getOrgReposPage } from '../paging/get-org-repos-page.js';
import { getUserReposPage } from '../paging/get-user-repos-page.js';

export interface GetRepositoriesArgs {
  target: string;
  type: 'org' | 'user';
  concurrency?: number;
}

const getPage =
  ({ target, type }: GetRepositoriesArgs) =>
  (page: number) =>
    Match.value(type).pipe(
      Match.when('org', () =>
        getOrgReposPage({
          org: target,
          page,
        }),
      ),
      Match.when('user', () =>
        getUserReposPage({
          username: target,
          page,
        }),
      ),
      Match.exhaustive,
    );

export const getRepositories = (args: GetRepositoriesArgs) =>
  Effect.withSpan('get-repositories', {
    attributes: { ...args },
  })(getAllPages(getPage, args));

export type RepositoriesResult = EffectResultSuccess<typeof getRepositories>;
