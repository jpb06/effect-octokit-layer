import { Effect, pipe } from 'effect';

import { getAllPages } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

import type { GetRepoPullRequestsArgs } from './get-repo-pull-requests.types.js';
import { getRepoPullRequestsPage } from './get-repo-pull-requests-page.js';

export interface GetRepoPullRequestsAggregatorArgs
  extends RepoArgs,
    GetRepoPullRequestsArgs {
  concurrency?: number;
}

const getPage = (args: GetRepoPullRequestsAggregatorArgs) => (page: number) =>
  getRepoPullRequestsPage({
    ...args,
    page,
  });

export const getRepoPullRequests = (args: GetRepoPullRequestsAggregatorArgs) =>
  pipe(
    getAllPages(getPage, args),
    Effect.withSpan('get-repo-pull-requests', {
      attributes: { ...args },
    }),
  );

export type RepoPullRequestsResult = EffectResultSuccess<
  typeof getRepoPullRequests
>;
