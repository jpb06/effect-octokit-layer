import { Effect, pipe } from 'effect';

import type { EffectResultSuccess } from '@types';

import { searchUserCommitsPage } from './search-user-commits-page.js';

export interface GetUserCommitsCountArgs {
  username: string;
}

export const getUserCommitsCount = ({ ...args }: GetUserCommitsCountArgs) =>
  pipe(
    Effect.gen(function* () {
      const { data } = yield* searchUserCommitsPage({
        ...args,
        query: '',
        page: 1,
        perPage: 1,
      });

      return data.total_count;
    }),
    Effect.withSpan('get-user-commits-count', {
      attributes: { ...args },
    }),
  );

export type UserCommitsCountResult = EffectResultSuccess<
  typeof getUserCommitsCount
>;
