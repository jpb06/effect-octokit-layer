import { getOnePage } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

import type { UserReposType } from './user-repos-type.type.js';

export interface GetUserReposPageArgs {
  username: string;
  page: number;
  type: UserReposType;
}

export const getUserReposPage = (args: GetUserReposPageArgs) =>
  getOnePage('get-user-repos-page', 'GET /user/repos', {
    ...args,
    per_page: 100,
  });

export type UserReposPageItems = EffectResultSuccess<typeof getUserReposPage>;
