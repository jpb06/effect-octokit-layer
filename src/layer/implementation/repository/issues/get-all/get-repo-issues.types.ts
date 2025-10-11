import type { IssueState, SortDirection } from '../../../types/common.types.js';

export type GetRepoIssuesSorting = 'updated' | 'created' | 'comments';

export type GetRepoIssuesArgs = {
  state: IssueState;
  assignee?: string;
  creator?: string;
  mentioned?: string;
  since?: string;
  sort?: GetRepoIssuesSorting;
  direction?: SortDirection;
  excludePulls?: boolean;
};
