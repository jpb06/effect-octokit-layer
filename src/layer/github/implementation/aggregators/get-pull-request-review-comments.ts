import { Effect, pipe } from 'effect';

import type { EffectResultSuccess } from '@types';

import { getAllPages } from '../generic/get-all-pages.effect.js';
import { getPullRequestReviewCommentsPage } from '../paging/get-pull-request-review-comments-page.js';

export interface GetPullRequestReviewCommentsArgs {
  owner: string;
  repo: string;
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
