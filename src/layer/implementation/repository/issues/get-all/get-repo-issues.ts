import { Effect, pipe } from 'effect';

import { getAllPages } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

import type { GetRepoIssuesArgs } from './get-repo-issues.types.js';
import { getRepoIssuesPage } from './get-repo-issues-page.js';

export interface GetRepoIssuesAggregatorArgs
  extends RepoArgs,
    GetRepoIssuesArgs {
  concurrency?: number;
}

const getPage = (args: GetRepoIssuesAggregatorArgs) => (page: number) =>
  getRepoIssuesPage({
    ...args,
    page,
  });

export const getRepoIssues = (args: GetRepoIssuesAggregatorArgs) =>
  pipe(
    getAllPages(getPage, args),
    Effect.map((results) =>
      args.excludePulls === true
        ? results.filter(({ pull_request }) => pull_request === undefined)
        : results,
    ),
    Effect.withSpan('get-repo-issues', {
      attributes: { ...args },
    }),
  );

export type RepoIssuesResult = EffectResultSuccess<typeof getRepoIssues>;
