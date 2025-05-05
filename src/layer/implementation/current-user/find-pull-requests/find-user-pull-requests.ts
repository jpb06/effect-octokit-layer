import { Effect, pipe } from 'effect';

import { getAllSearchPages } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

import { findUserPullRequestsPage } from './find-user-pull-requests-page.js';
import type { PullRequestState } from './pull-request-state.type.js';

export interface FindUserPullRequestsArgs {
  username: string;
  state: PullRequestState;
  fetchOnlyFirstPage?: boolean;
  concurrency?: number;
}

const getPage = (args: FindUserPullRequestsArgs) => (page: number) =>
  findUserPullRequestsPage({
    ...args,
    page,
  });

export const findUserPullRequests = ({
  fetchOnlyFirstPage,
  ...args
}: FindUserPullRequestsArgs) =>
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
    Effect.withSpan('find-user-pull-requests', {
      attributes: { ...args },
    }),
  );

export type UserPullRequestsSearchResult = EffectResultSuccess<
  typeof findUserPullRequests
>;
