import { Effect } from 'effect';

import type { EffectResultSuccess } from '@types';
import { getAllPages } from '../generic/get-all-pages.effect.js';
import { getUserEventsPage } from '../paging/get-user-events-page.js';

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
  Effect.withSpan('get-user-events', {
    attributes: { ...args },
  })(getAllPages(getPage, args));

export type UserEventsResult = EffectResultSuccess<typeof getUserEvents>;
