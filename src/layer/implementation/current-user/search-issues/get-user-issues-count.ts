import { Effect, pipe } from 'effect';

import type { EffectResultSuccess } from '@types';

import { searchUserIssuesPage } from './search-user-issues-page.js';

export interface GetUserIssuesCountArgs {
  username: string;
}

export const getUserIssuesCount = ({ ...args }: GetUserIssuesCountArgs) =>
  pipe(
    Effect.gen(function* () {
      const { data } = yield* searchUserIssuesPage({
        ...args,
        query: '',
        page: 1,
        perPage: 1,
      });

      return data.total_count;
    }),
    Effect.withSpan('get-user-issues-count', {
      attributes: { ...args },
    }),
  );

export type UserIssuesCountResult = EffectResultSuccess<
  typeof getUserIssuesCount
>;
