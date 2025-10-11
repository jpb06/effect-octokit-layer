import type { SortDirection } from '../../../../types/common.types.js';

export type GetRepoPullRequestState = 'open' | 'closed' | 'all';

export type GetRepoPullRequestsSorting =
  | 'updated'
  | 'created'
  | 'popularity'
  | 'long-running';

export type GetRepoPullRequestsArgs = {
  state: GetRepoPullRequestState;
  head?: string;
  direction?: SortDirection;
  sort?: GetRepoPullRequestsSorting;
};
