import { Effect, pipe } from 'effect';

import { getAllSearchPages } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

import type { SearchUserIssuesArgs } from './search-user-issues.type.js';
import { searchUserIssuesPage } from './search-user-issues-page.js';

export interface SearchUserIssuesAggregatorArgs extends SearchUserIssuesArgs {
  fetchOnlyFirstPage?: boolean;
  concurrency?: number;
}

const getPage = (args: SearchUserIssuesAggregatorArgs) => (page: number) =>
  searchUserIssuesPage({
    ...args,
    page,
    perPage: 100,
  });

export const searchUserIssues = ({
  fetchOnlyFirstPage,
  ...args
}: SearchUserIssuesAggregatorArgs) =>
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
    Effect.withSpan('search-user-issues', {
      attributes: { ...args },
    }),
  );

export type UserIssuesSearchResult = EffectResultSuccess<
  typeof searchUserIssues
>;
