import { Effect, pipe } from 'effect';

import { getAllPages } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

import { getUserReposPage } from './get-user-repos-page.js';

export interface GetUserRepositoriesArgs {
  username: string;
  concurrency?: number;
}

const getUserPage =
  ({ username }: GetUserRepositoriesArgs) =>
  (page: number) =>
    getUserReposPage({
      username,
      page,
    });

export const getUserRepositories = (args: GetUserRepositoriesArgs) =>
  pipe(
    getAllPages(getUserPage, args),
    Effect.withSpan('get-user-repositories', {
      attributes: { ...args },
    }),
  );
export type UserRepositoriesResult = EffectResultSuccess<
  typeof getUserRepositories
>;
