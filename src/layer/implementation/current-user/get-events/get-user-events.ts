import { Effect, pipe } from 'effect';

import { getAllPages } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

import { getUserEventsPage } from './get-user-events-page.js';

export interface GetUserEventsArgs {
  username: string;
  concurrency?: number;
}

const getPage = (args: GetUserEventsArgs) => (page: number) =>
  getUserEventsPage({
    ...args,
    page,
  });

export const getUserEvents = (args: GetUserEventsArgs) =>
  pipe(
    getAllPages(getPage, args),
    Effect.withSpan('get-user-events', {
      attributes: { ...args },
    }),
  );

export type UserEventsResult = EffectResultSuccess<typeof getUserEvents>;
