import type { SortDirection } from '../../../types/common.types.js';

export type GetRepoIssuesState = 'all' | 'open' | 'closed';
export type GetRepoIssuesSorting = 'updated' | 'created' | 'comments';

export type GetRepoIssuesArgs = {
  state: GetRepoIssuesState;
  assignee?: string;
  creator?: string;
  mentioned?: string;
  since?: string;
  sort?: GetRepoIssuesSorting;
  direction?: SortDirection;
  excludePulls?: boolean;
};
