import { Effect, pipe } from 'effect';

import { getAllPages } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

import { getIssueCommentsPage } from './get-issue-comments-page.js';

export interface GetIssueCommentsArgs extends RepoArgs {
  issueNumber: number;
  concurrency?: number;
}

const getPage = (args: GetIssueCommentsArgs) => (page: number) =>
  getIssueCommentsPage({
    ...args,
    page,
  });

export const getIssueComments = (args: GetIssueCommentsArgs) =>
  pipe(
    getAllPages(getPage, args),
    Effect.withSpan('get-issue-comments', {
      attributes: { ...args },
    }),
  );

export type IssueCommentsResult = EffectResultSuccess<typeof getIssueComments>;
