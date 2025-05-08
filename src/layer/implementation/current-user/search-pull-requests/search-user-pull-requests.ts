import { Effect, pipe } from 'effect';

import { getAllSearchPages } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

import type { PullRequestState } from './pull-request-state.type.js';
import { searchUserPullRequestsPage } from './search-user-pull-requests-page.js';

export interface SearchUserPullRequestsArgs {
  username: string;
  state: PullRequestState;
  query: string;
  fetchOnlyFirstPage?: boolean;
  concurrency?: number;
}

const getPage = (args: SearchUserPullRequestsArgs) => (page: number) =>
  searchUserPullRequestsPage({
    ...args,
    page,
    perPage: 100,
  });

export const searchUserPullRequests = ({
  fetchOnlyFirstPage,
  ...args
}: SearchUserPullRequestsArgs) =>
  pipe(
    Effect.gen(function* () {
      if (fetchOnlyFirstPage === true) {
        const { data } = yield* getPage(args)(1);

        return {
          count: data.total_count,
          data: data.items,
        };
      }

      return yield* getAllSearchPages(getPage, args);
    }),
    Effect.withSpan('search-user-pull-requests', {
      attributes: { ...args },
    }),
  );

export type UserPullRequestsSearchResult = EffectResultSuccess<
  typeof searchUserPullRequests
>;
