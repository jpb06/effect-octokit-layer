import { Effect, pipe } from 'effect';

import { getAllSearchPages } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

import { getUserCommitsPage } from './get-user-commits-page.js';

export interface GetUserCommitsArgs {
  username: string;
  concurrency?: number;
}

const getPage = (args: GetUserCommitsArgs) => (page: number) =>
  getUserCommitsPage({
    ...args,
    page,
  });

export const getUserCommits = (args: GetUserCommitsArgs) =>
  pipe(
    getAllSearchPages(getPage, args),
    Effect.withSpan('get-user-commits', {
      attributes: { ...args },
    }),
  );

export type UserCommitsResult = EffectResultSuccess<typeof getUserCommits>;
