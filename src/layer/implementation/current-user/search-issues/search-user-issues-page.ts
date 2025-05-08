import { getOnePage } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

export interface SearchUserIssuesPageArgs {
  username: string;
  query: string;
  page: number;
  perPage: number;
}

export const searchUserIssuesPage = ({
  query,
  username,
  page,
  perPage,
}: SearchUserIssuesPageArgs) =>
  getOnePage('search-user-issues-page', 'GET /search/issues', {
    q: `type:issue involves:${username} ${query}`,
    page,
    per_page: perPage,
    advanced_search: 'true',
  });

export type SearchUserIssuesPageItems = EffectResultSuccess<
  typeof searchUserIssuesPage
>;
