import { getOnePage } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

export interface findUserCommitsPageArgs {
  username: string;
  page: number;
}

export const findUserCommitsPage = ({
  page,
  username,
}: findUserCommitsPageArgs) =>
  getOnePage('find-user-commits-page', 'GET /search/commits', {
    q: `author:${username}`,
    page,
    per_page: 100,
  });

export type UserCommitsPageItems = EffectResultSuccess<
  typeof findUserCommitsPage
>;
