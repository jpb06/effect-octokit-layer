import { Effect, pipe } from 'effect';

import { getAllPages } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

import { getRepoPullRequestsPage } from './get-repo-pull-requests-page.js';
import type { GetRepoPullRequestState } from './get-repo-pull-requests-state.type.js';

export interface GetRepoPullRequestsArgs extends RepoArgs {
  concurrency?: number;
  state?: GetRepoPullRequestState;
}

const getPage = (args: GetRepoPullRequestsArgs) => (page: number) =>
  getRepoPullRequestsPage({
    ...args,
    page,
  });

export const getRepoPullRequests = (args: GetRepoPullRequestsArgs) =>
  pipe(
    getAllPages(getPage, args),
    Effect.withSpan('get-repo-pull-requests', {
      attributes: { ...args },
    }),
  );

export type RepoPullRequestsResult = EffectResultSuccess<
  typeof getRepoPullRequests
>;
