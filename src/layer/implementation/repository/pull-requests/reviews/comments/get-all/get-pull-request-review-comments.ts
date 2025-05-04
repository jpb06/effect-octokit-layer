import { Effect, pipe } from 'effect';

import { getAllPages } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

import { getPullRequestReviewCommentsPage } from './get-pull-request-review-comments-page.js';

export interface GetPullRequestReviewCommentsArgs extends RepoArgs {
  pullNumber: number;
  concurrency?: number;
  reviewId: number;
}

const getPage = (args: GetPullRequestReviewCommentsArgs) => (page: number) =>
  getPullRequestReviewCommentsPage({
    ...args,
    page,
  });

export const getPullRequestReviewComments = (
  args: GetPullRequestReviewCommentsArgs,
) =>
  pipe(
    getAllPages(getPage, args),
    Effect.withSpan('get-pull-request-review-comments', {
      attributes: { ...args },
    }),
  );

export type PullRequestReviewCommentsResult = EffectResultSuccess<
  typeof getPullRequestReviewComments
>;
