import type { EffectResultSuccess } from '@types';
import { getOnePage } from '../generic/get-one-page/get-one-page.effect.js';

export interface GetPullRequestCommentsPageArgs {
  owner: string;
  repo: string;
  pullNumber: number;
  page: number;
}

export const getPullRequestCommentsPage = ({
  owner,
  repo,
  pullNumber,
  page,
}: GetPullRequestCommentsPageArgs) =>
  getOnePage(
    'get-pull-request-comments-page',
    'GET /repos/{owner}/{repo}/pulls/{pull_number}/comments',
    {
      owner,
      repo,
      pull_number: pullNumber,
      per_page: 100,
      page,
    },
  );

export type PullRequestCommentsPageItems = EffectResultSuccess<
  typeof getPullRequestCommentsPage
>;
