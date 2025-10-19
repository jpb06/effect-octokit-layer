import { getOnePage } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

import type { SearchUserIssuesArgs } from './search-user-issues.type.js';

export interface SearchUserIssuesPageArgs extends SearchUserIssuesArgs {
  page: number;
  perPage: number;
}

export const searchUserIssuesPage = ({
  query,
  username,
  type,
  page,
  perPage,
}: SearchUserIssuesPageArgs) => {
  const typeQuery = type === 'all' ? '' : `type:${type}`;

  return getOnePage('search-user-issues-page', 'GET /search/issues', {
    q: `${typeQuery} involves:${username} ${query}`,
    page,
    per_page: perPage,
    advanced_search: 'true',
  });
};

export type SearchUserIssuesPageItems = EffectResultSuccess<
  typeof searchUserIssuesPage
>;
