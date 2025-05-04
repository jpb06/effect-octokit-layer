import { Effect, pipe } from 'effect';

import { getAllPages } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

import { getPullRequestReviewsPage } from './get-pull-request-reviews-page.js';

export interface GetPullRequestReviewsArgs extends RepoArgs {
  pullNumber: number;
  concurrency?: number;
}

const getPage = (args: GetPullRequestReviewsArgs) => (page: number) =>
  getPullRequestReviewsPage({
    ...args,
    page,
  });

export const getPullRequestReviews = (args: GetPullRequestReviewsArgs) =>
  pipe(
    getAllPages(getPage, args),
    Effect.withSpan('get-pull-request-reviews', {
      attributes: { ...args },
    }),
  );

export type PullRequestReviewsResult = EffectResultSuccess<
  typeof getPullRequestReviews
>;
