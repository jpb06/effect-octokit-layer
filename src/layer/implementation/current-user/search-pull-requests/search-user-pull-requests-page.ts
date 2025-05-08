import { getOnePage } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

import { Match } from 'effect';
import type { PullRequestState } from './pull-request-state.type.js';

export interface SearchUserPullRequestsPageArgs {
  username: string;
  state: PullRequestState;
  query: string;
  page: number;
  perPage: number;
}

const getSearchParam = ({
  state,
  username,
  query,
}: Omit<SearchUserPullRequestsPageArgs, 'page' | 'perPage'>) =>
  Match.value(state).pipe(
    Match.when(
      'closed',
      () => `type:pr author:${username} state:closed is:unmerged ${query}`,
    ),
    Match.when(
      'draft',
      () => `type:pr author:${username} state:open draft:true ${query}`,
    ),
    Match.when('merged', () => `type:pr author:${username} is:merged ${query}`),
    Match.when(
      'open',
      () => `type:pr author:${username} state:open draft:false ${query}`,
    ),
    Match.when('reviewed', () => `type:pr reviewed-by:${username} ${query}`),
    Match.exhaustive,
  );

export const searchUserPullRequestsPage = ({
  page,
  perPage,
  ...args
}: SearchUserPullRequestsPageArgs) =>
  getOnePage('search-user-pull-requests-page', 'GET /search/issues', {
    q: getSearchParam(args),
    page,
    per_page: perPage,
    advanced_search: 'true',
  });

export type SearchUserPullRequestsPageItems = EffectResultSuccess<
  typeof searchUserPullRequestsPage
>;
