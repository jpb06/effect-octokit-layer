import { Effect, pipe } from 'effect';

import { getAllSearchPages } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

import { searchUserCommitsPage } from './search-user-commits-page.js';

export interface SearchUserCommitsArgs {
  username: string;
  fetchOnlyFirstPage?: boolean;
  query: string;
  concurrency?: number;
}

const getPage = (args: SearchUserCommitsArgs) => (page: number) =>
  searchUserCommitsPage({
    ...args,
    page,
    perPage: 100,
  });

export const searchUserCommits = ({
  fetchOnlyFirstPage,
  ...args
}: SearchUserCommitsArgs) =>
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
    Effect.withSpan('search-user-commits', {
      attributes: { ...args },
    }),
  );

export type UserCommitsSearchResult = EffectResultSuccess<
  typeof searchUserCommits
>;
