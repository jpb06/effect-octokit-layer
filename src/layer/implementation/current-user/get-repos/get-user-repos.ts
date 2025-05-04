import { Effect, pipe } from 'effect';

import { getAllPages } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

import { getUserReposPage } from './get-user-repos-page.js';
import type { UserReposType } from './user-repos-type.type.js';

export interface GetUserRepositoriesArgs {
  username: string;
  type: UserReposType;
  concurrency?: number;
}

const getUserPage =
  ({ username, type }: GetUserRepositoriesArgs) =>
  (page: number) =>
    getUserReposPage({
      username,
      type,
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
