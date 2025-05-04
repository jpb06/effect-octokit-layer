import { Effect, pipe } from 'effect';

import { getAllSearchPages } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

import { getUserIssuesPage } from './get-user-issues-page.js';

export interface GetUserIssuesArgs {
  username: string;
  concurrency?: number;
}

const getPage = (args: GetUserIssuesArgs) => (page: number) =>
  getUserIssuesPage({
    ...args,
    page,
  });

export const getUserIssues = (args: GetUserIssuesArgs) =>
  pipe(
    getAllSearchPages(getPage, args),
    Effect.withSpan('get-user-issues', {
      attributes: { ...args },
    }),
  );

export type UserIssuesResult = EffectResultSuccess<typeof getUserIssues>;
