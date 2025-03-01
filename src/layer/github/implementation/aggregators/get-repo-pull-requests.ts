import { Effect, pipe } from 'effect';

import type { EffectResultSuccess } from '@types';
import { getAllPages } from '../generic/get-all-pages.effect.js';
import { getRepoPullRequestsPage } from '../paging/get-repo-pull-requests-page.js';

export interface GetRepoPullRequestsArgs {
  owner: string;
  repo: string;
  concurrency?: number;
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
