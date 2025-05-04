import { Effect, pipe } from 'effect';

import { getAllPages } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

import { getPullRequestCommentsPage } from './get-pull-request-comments-page.js';

export interface GetPullRequestCommentsArgs extends RepoArgs {
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
