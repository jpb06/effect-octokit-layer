import { Effect, pipe } from 'effect';

import { getAllSearchPages } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

import { getUserPullRequestsPage } from './get-user-pull-requests-page.js';
import type { PullRequestState } from './pull-request-state.type.js';

export interface GetUserPullRequestsArgs {
  username: string;
  state: PullRequestState;
  concurrency?: number;
}

const getPage = (args: GetUserPullRequestsArgs) => (page: number) =>
  getUserPullRequestsPage({
    ...args,
    page,
  });

export const getUserPullRequests = (args: GetUserPullRequestsArgs) =>
  pipe(
    getAllSearchPages(getPage, args),
    Effect.withSpan('get-user-pull-requests', {
      attributes: { ...args },
    }),
  );

export type UserPullRequestsResult = EffectResultSuccess<
  typeof getUserPullRequests
>;
