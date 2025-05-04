import { getOnePage } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

export interface GetUserCommitsPageArgs {
  username: string;
  page: number;
}

export const getUserCommitsPage = ({
  page,
  username,
}: GetUserCommitsPageArgs) =>
  getOnePage('get-user-commits-page', 'GET /search/commits', {
    q: `author:${username}`,
    page,
    per_page: 100,
  });

export type UserCommitsPageItems = EffectResultSuccess<
  typeof getUserCommitsPage
>;
