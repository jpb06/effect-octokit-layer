import type { Effect } from 'effect';

import { defaultConcurrency } from '@constants';
import type {
  GetIssuesState,
  IssueCommentsResult,
  IssueResult,
  RepoIssuesResult,
} from '@implementation';
import type { RepoArgs } from '@implementation/types';

import {
  OctokitLayerContext as Context,
  type LayerErrors,
  type Octokit,
} from '../../../octokit.context.js';
import { tapLayer } from '../../effects/tap-octokit-layer.effect.js';

export const repoIssuesApi = ({ owner, repo }: RepoArgs) => ({
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#list-repository-issues
   */
  issues: (
    state: GetIssuesState,
    concurrency = defaultConcurrency,
  ): Effect.Effect<RepoIssuesResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ getRepoIssues }) =>
      getRepoIssues({ owner, repo, concurrency, state }),
    ),
  issue: (number: number) => ({
    /**
     * Github documentation:
     * https://docs.github.com/en/rest/issues/issues#get-an-issue
     */
    details: (): Effect.Effect<IssueResult, LayerErrors, Octokit> =>
      tapLayer(Context, ({ getIssue }) => getIssue({ owner, repo, number })),
    /**
     * Github documentation:
     * https://docs.github.com/en/rest/issues/comments#list-issue-comments-for-a-repository
     */
    comments: (
      concurrency = defaultConcurrency,
    ): Effect.Effect<IssueCommentsResult, LayerErrors, Octokit> =>
      tapLayer(Context, ({ getIssueComments }) =>
        getIssueComments({
          owner,
          repo,
          issueNumber: number,
          concurrency,
        }),
      ),
  }),
});
