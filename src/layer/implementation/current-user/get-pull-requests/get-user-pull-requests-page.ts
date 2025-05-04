import { getOnePage } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

import { Match } from 'effect';
import type { PullRequestState } from './pull-request-state.type.js';

export interface GetUserPullRequestsPageArgs {
  username: string;
  state: PullRequestState;
  page: number;
}

const getSearchParam = ({ state, username }: GetUserPullRequestsPageArgs) =>
  Match.value(state).pipe(
    Match.when(
      'closed',
      () => `type:pr author:${username} state:closed is:unmerged`,
    ),
    Match.when(
      'draft',
      () => `type:pr author:${username} state:open draft:true`,
    ),
    Match.when('merged', () => `type:pr author:${username} is:merged`),
    Match.when(
      'open',
      () => `type:pr author:${username} state:open draft:false`,
    ),
    Match.exhaustive,
  );

export const getUserPullRequestsPage = (args: GetUserPullRequestsPageArgs) =>
  getOnePage('get-user-pull-requests-page', 'GET /search/issues', {
    ...args,
    q: getSearchParam(args),
    per_page: 100,
    advanced_search: 'true',
  });

export type UserPullRequestsPageItems = EffectResultSuccess<
  typeof getUserPullRequestsPage
>;
