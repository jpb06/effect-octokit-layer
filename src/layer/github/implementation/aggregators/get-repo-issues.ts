import { Effect, pipe } from 'effect';

import type { EffectResultSuccess } from '@types';

import { getAllPages } from '../generic/get-all-pages.effect.js';
import { getRepoIssuesPage } from '../paging/get-repo-issues-page.js';

export interface GetRepoIssuesArgs {
  owner: string;
  repo: string;
  concurrency?: number;
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
