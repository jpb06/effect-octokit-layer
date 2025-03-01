import type { ConfigError, Effect } from 'effect';
import { Context } from 'effect';

import type { Logger } from '@dependencies/logger';
import type { ApiRateLimitError, GithubApiError } from '@errors';
import type {
  GetIssueArgs,
  GetPullRequestArgs,
  GetPullRequestCommentsArgs,
  GetPullRequestReviewCommentsArgs,
  GetPullRequestReviewsArgs,
  GetRepoPullRequestsArgs,
  GetRepositoriesArgs,
  GetUserEventsArgs,
  IssueResult,
  PullRequestCommentsResult,
  PullRequestResult,
  PullRequestReviewCommentsResult,
  PullRequestReviewsResult,
  RepoIssuesResult,
  RepoPullRequestsResult,
  RepositoriesResult,
  UserEventsResult,
  UserOrgsResult,
  UserProfileResult,
} from '@implementation';

type LayerErrors = GithubApiError | ApiRateLimitError | ConfigError.ConfigError;

export interface Octokit {
  readonly getUserProfile: (
    username: string,
  ) => Effect.Effect<UserProfileResult, LayerErrors, Logger>;
  readonly getUserOrgs: (
    username: string,
  ) => Effect.Effect<UserOrgsResult, LayerErrors, Logger>;
  readonly getUserEvents: (
    args: GetUserEventsArgs,
  ) => Effect.Effect<UserEventsResult, LayerErrors, Logger>;
  readonly getRepositories: (
    args: GetRepositoriesArgs,
  ) => Effect.Effect<RepositoriesResult, LayerErrors, Logger>;
  readonly getRepoPullRequests: (
    args: GetRepoPullRequestsArgs,
  ) => Effect.Effect<RepoPullRequestsResult, LayerErrors, Logger>;
  readonly getRepoIssues: (
    args: GetRepoPullRequestsArgs,
  ) => Effect.Effect<RepoIssuesResult, LayerErrors, Logger>;
  readonly getIssue: (
    args: GetIssueArgs,
  ) => Effect.Effect<IssueResult, LayerErrors, Logger>;
  readonly getPullRequest: (
    args: GetPullRequestArgs,
  ) => Effect.Effect<PullRequestResult, LayerErrors, Logger>;
  readonly getPullRequestComments: (
    args: GetPullRequestCommentsArgs,
  ) => Effect.Effect<PullRequestCommentsResult, LayerErrors, Logger>;
  readonly getPullRequestReviews: (
    args: GetPullRequestReviewsArgs,
  ) => Effect.Effect<PullRequestReviewsResult, LayerErrors, Logger>;
  readonly getPullRequestReviewComments: (
    args: GetPullRequestReviewCommentsArgs,
  ) => Effect.Effect<PullRequestReviewCommentsResult, LayerErrors, Logger>;
}

export const OctokitLayerContext = Context.GenericTag<Octokit>('Octokit');
