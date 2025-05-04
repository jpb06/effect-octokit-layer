import { Effect, pipe } from 'effect';

import { getAllPages } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

import type { GetIssuesState } from './get-issues.types.js';
import { getRepoIssuesPage } from './get-repo-issues-page.js';

export interface GetRepoIssuesArgs extends RepoArgs {
  concurrency?: number;
  state: GetIssuesState;
}

const getPage = (args: GetRepoIssuesArgs) => (page: number) =>
  getRepoIssuesPage({
    ...args,
    page,
  });

export const getRepoIssues = (args: GetRepoIssuesArgs) =>
  pipe(
    getAllPages(getPage, args),
    Effect.withSpan('get-repo-issues', {
      attributes: { ...args },
    }),
  );

export type RepoIssuesResult = EffectResultSuccess<typeof getRepoIssues>;
