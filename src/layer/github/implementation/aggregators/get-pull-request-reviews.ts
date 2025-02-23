import { Effect } from 'effect';

import type { EffectResultSuccess } from '@types';
import { getAllPages } from '../generic/get-all-pages.effect.js';
import { getPullRequestReviewsPage } from '../paging/get-pull-request-reviews-page.js';

export interface GetPullRequestReviewsArgs {
  owner: string;
  repo: string;
  pullNumber: number;
  concurrency?: number;
}

const getPage = (args: GetPullRequestReviewsArgs) => (page: number) =>
  getPullRequestReviewsPage({
    ...args,
    page,
  });

export const getPullRequestReviews = (args: GetPullRequestReviewsArgs) =>
  Effect.withSpan('get-pull-request-reviews', {
    attributes: { ...args },
  })(getAllPages(getPage, args));

export type PullRequestReviewsResult = EffectResultSuccess<
  typeof getPullRequestReviews
>;
