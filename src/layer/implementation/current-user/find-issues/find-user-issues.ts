import { Effect, pipe } from 'effect';

import { getAllSearchPages } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

import { findUserIssuesPage } from './find-user-issues-page.js';

export interface findUserIssuesArgs {
  username: string;
  fetchOnlyFirstPage?: boolean;
  concurrency?: number;
}

const getPage = (args: findUserIssuesArgs) => (page: number) =>
  findUserIssuesPage({
    ...args,
    page,
  });

export const findUserIssues = ({
  fetchOnlyFirstPage,
  ...args
}: findUserIssuesArgs) =>
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
    Effect.withSpan('find-user-issues', {
      attributes: { ...args },
    }),
  );

export type UserIssuesResult = EffectResultSuccess<typeof findUserIssues>;
