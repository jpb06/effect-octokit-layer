import { getOnePage } from '@implementation/generic';
import type { RepoArgs } from '@implementation/types';
import type { EffectResultSuccess } from '@types';

export interface GetIssueCommentsPageArgs extends RepoArgs {
  issueNumber: number;
  page: number;
}

export const getIssueCommentsPage = ({
  owner,
  repo,
  issueNumber,
  page,
}: GetIssueCommentsPageArgs) =>
  getOnePage(
    'get-issue-comments-page',
    'GET /repos/{owner}/{repo}/issues/{issue_number}/comments',
    {
      owner,
      repo,
      issue_number: issueNumber,
      per_page: 100,
      page,
    },
  );

export type IssueCommentsPageItems = EffectResultSuccess<
  typeof getIssueCommentsPage
>;
