import type { ConfigError, Effect } from 'effect';
import { Context } from 'effect';

import type { ApiRateLimitError, GithubApiError } from '@errors';
import type {
  GetIssueArgs,
  GetPullRequestArgs,
  GetPullRequestReviewsArgs,
  GetRepoPullRequestsArgs,
  GetRepositoriesArgs,
  GetUserEventsArgs,
  IssueResult,
  PullRequestResult,
  PullRequestReviewsResult,
  RepoIssuesResult,
  RepoPullRequestsResult,
  RepositoriesResult,
  UserEventsResult,
  UserOrgsResult,
  UserProfileResult,
} from '@implementation';

export interface Octokit {
  readonly getUserProfile: (
    username: string,
  ) => Effect.Effect<
    UserProfileResult,
    GithubApiError | ApiRateLimitError | ConfigError.ConfigError,
    never
  >;
  readonly getUserOrgs: (
    username: string,
  ) => Effect.Effect<
    UserOrgsResult,
    GithubApiError | ApiRateLimitError | ConfigError.ConfigError,
    never
  >;
  readonly getUserEvents: (
    args: GetUserEventsArgs,
  ) => Effect.Effect<
    UserEventsResult,
    GithubApiError | ApiRateLimitError | ConfigError.ConfigError,
    never
  >;
  readonly getRepositories: (
    args: GetRepositoriesArgs,
  ) => Effect.Effect<
    RepositoriesResult,
    GithubApiError | ApiRateLimitError | ConfigError.ConfigError,
    never
  >;
  readonly getRepoPullRequests: (
    args: GetRepoPullRequestsArgs,
  ) => Effect.Effect<
    RepoPullRequestsResult,
    GithubApiError | ApiRateLimitError | ConfigError.ConfigError,
    never
  >;
  readonly getRepoIssues: (
    args: GetRepoPullRequestsArgs,
  ) => Effect.Effect<
    RepoIssuesResult,
    GithubApiError | ApiRateLimitError | ConfigError.ConfigError,
    never
  >;
  readonly getIssue: (
    args: GetIssueArgs,
  ) => Effect.Effect<
    IssueResult,
    GithubApiError | ApiRateLimitError | ConfigError.ConfigError,
    never
  >;
  readonly getPullRequest: (
    args: GetPullRequestArgs,
  ) => Effect.Effect<
    PullRequestResult,
    GithubApiError | ApiRateLimitError | ConfigError.ConfigError,
    never
  >;
  readonly getPullRequestReviews: (
    args: GetPullRequestReviewsArgs,
  ) => Effect.Effect<
    PullRequestReviewsResult,
    GithubApiError | ApiRateLimitError | ConfigError.ConfigError,
    never
  >;
}

export const OctokitLayerContext = Context.GenericTag<Octokit>('Octokit');
