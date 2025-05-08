import { Effect, pipe } from 'effect';

import type { EffectResultSuccess } from '@types';

import type { PullRequestState } from './pull-request-state.type.js';
import { searchUserPullRequestsPage } from './search-user-pull-requests-page.js';

export interface GetUserPullRequestsCountArgs {
  username: string;
  state: PullRequestState;
}

export const getUserPullRequestsCount = ({
  ...args
}: GetUserPullRequestsCountArgs) =>
  pipe(
    Effect.gen(function* () {
      const { data } = yield* searchUserPullRequestsPage({
        ...args,
        query: '',
        page: 1,
        perPage: 1,
      });

      return data.total_count;
    }),
    Effect.withSpan('get-user-pull-requests-count', {
      attributes: { ...args },
    }),
  );

export type UserPullRequestsCountResult = EffectResultSuccess<
  typeof getUserPullRequestsCount
>;
