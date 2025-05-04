import { getOnePage } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

export interface GetUserReposPageArgs {
  username: string;
  page: number;
}

export const getUserReposPage = (args: GetUserReposPageArgs) =>
  getOnePage('get-user-repos-page', 'GET /user/repos', {
    ...args,
    type: 'all',
    per_page: 100,
  });

export type UserReposPageItems = EffectResultSuccess<typeof getUserReposPage>;
