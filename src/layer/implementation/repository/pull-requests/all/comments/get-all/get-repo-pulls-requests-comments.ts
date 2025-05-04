import { Effect, pipe } from 'effect';

import { getAllPages } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

import { getRepoPullRequestsCommentsPage } from './get-repo-pulls-requests-comments-page.js';

export interface GetRepoPullRequestsCommentsArgs extends RepoArgs {
  concurrency?: number;
}

const getPage = (args: GetRepoPullRequestsCommentsArgs) => (page: number) =>
  getRepoPullRequestsCommentsPage({
    ...args,
    page,
  });

export const getRepoPullRequestsComments = (
  args: GetRepoPullRequestsCommentsArgs,
) =>
  pipe(
    getAllPages(getPage, args),
    Effect.withSpan('get-repo-pull-requests-comments', {
      attributes: { ...args },
    }),
  );

export type RepoPullRequestsCommentsResult = EffectResultSuccess<
  typeof getRepoPullRequestsComments
>;
