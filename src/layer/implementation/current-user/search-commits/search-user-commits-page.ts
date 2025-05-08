import { getOnePage } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

export interface SearchUserCommitsPageArgs {
  username: string;
  query: string;
  page: number;
  perPage: number;
}

export const searchUserCommitsPage = ({
  username,
  query,
  page,
  perPage,
}: SearchUserCommitsPageArgs) =>
  getOnePage('search-user-commits-page', 'GET /search/commits', {
    q: `author:${username} ${query}`,
    page,
    per_page: perPage,
  });

export type SearchUserCommitsPageItems = EffectResultSuccess<
  typeof searchUserCommitsPage
>;
