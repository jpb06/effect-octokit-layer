import { Effect } from 'effect';

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
  Effect.withSpan('get-repo-pull-requests', {
    attributes: { ...args },
  })(getAllPages(getPage, args));

export type RepoPullRequestsResult = EffectResultSuccess<
  typeof getRepoPullRequests
>;
