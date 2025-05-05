import { Effect, pipe } from 'effect';

import { getAllSearchPages } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

import { findUserCommitsPage } from './find-user-commits-page.js';

export interface FindUserCommitsArgs {
  username: string;
  fetchOnlyFirstPage?: boolean;
  concurrency?: number;
}

const getPage = (args: FindUserCommitsArgs) => (page: number) =>
  findUserCommitsPage({
    ...args,
    page,
  });

export const findUserCommits = ({
  fetchOnlyFirstPage,
  ...args
}: FindUserCommitsArgs) =>
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
    Effect.withSpan('find-user-commits', {
      attributes: { ...args },
    }),
  );

export type UserCommitsSearchResult = EffectResultSuccess<
  typeof findUserCommits
>;
