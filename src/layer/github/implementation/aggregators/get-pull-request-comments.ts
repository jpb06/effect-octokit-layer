import { Effect, pipe } from 'effect';

import type { EffectResultSuccess } from '@types';

import { getAllPages } from '../generic/get-all-pages.effect.js';
import { getPullRequestCommentsPage } from '../paging/get-pull-request-comments-page.js';

export interface GetPullRequestCommentsArgs {
  owner: string;
  repo: string;
  pullNumber: number;
  concurrency?: number;
}

const getPage = (args: GetPullRequestCommentsArgs) => (page: number) =>
  getPullRequestCommentsPage({
    ...args,
    page,
  });

export const getPullRequestComments = (args: GetPullRequestCommentsArgs) =>
  pipe(
    getAllPages(getPage, args),
    Effect.withSpan('get-pull-request-comments', {
      attributes: { ...args },
    }),
  );

export type PullRequestCommentsResult = EffectResultSuccess<
  typeof getPullRequestComments
>;
