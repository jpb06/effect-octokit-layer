export type UserIssuesType = 'all' | 'issue' | 'pr';

export interface SearchUserIssuesArgs {
  username: string;
  type: UserIssuesType;
  query: string;
}
