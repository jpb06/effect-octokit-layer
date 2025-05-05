import { getOnePage } from '@implementation/generic';
import type { EffectResultSuccess } from '@types';

export interface FindUserIssuesPageArgs {
  username: string;
  page: number;
}

export const findUserIssuesPage = (args: FindUserIssuesPageArgs) =>
  getOnePage('find-user-issues-page', 'GET /search/issues', {
    ...args,
    q: `type:issue involves:${args.username}`,
    per_page: 100,
    advanced_search: 'true',
  });

export type UserIssuesPageItems = EffectResultSuccess<
  typeof findUserIssuesPage
>;
