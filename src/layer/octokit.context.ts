import type { ConfigError, Effect } from 'effect';
import { Context } from 'effect';

import type { ApiRateLimitError, GithubApiError } from '@errors';
import type {
  CreatePullRequestCommentResult,
  CreatePullRequestReviewResult,
  DeletePullRequestCommentResult,
  DeletePullRequestReviewResult,
  GetIssueArgs,
  GetPullRequestArgs,
  GetPullRequestCommentsArgs,
  GetPullRequestReviewCommentsArgs,
  GetPullRequestReviewsArgs,
  GetRepoPullRequestsArgs,
  GetRepositoriesArgs,
  GetUserEventsArgs,
  IssueResult,
  PullRequestCommentCreationArgs,
  PullRequestCommentDeletionArgs,
  PullRequestCommentsResult,
  PullRequestResult,
  PullRequestReviewCommentsResult,
  PullRequestReviewCreationArgs,
  PullRequestReviewDeletionArgs,
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
  ) => Effect.Effect<UserProfileResult, LayerErrors, never>;
  readonly getUserOrgs: (
    username: string,
  ) => Effect.Effect<UserOrgsResult, LayerErrors, never>;
  readonly getUserEvents: (
    args: GetUserEventsArgs,
  ) => Effect.Effect<UserEventsResult, LayerErrors, never>;
  readonly getRepositories: (
    args: GetRepositoriesArgs,
  ) => Effect.Effect<RepositoriesResult, LayerErrors, never>;
  readonly getRepoPullRequests: (
    args: GetRepoPullRequestsArgs,
  ) => Effect.Effect<RepoPullRequestsResult, LayerErrors, never>;
  readonly getRepoIssues: (
    args: GetRepoPullRequestsArgs,
  ) => Effect.Effect<RepoIssuesResult, LayerErrors, never>;
  readonly getIssue: (
    args: GetIssueArgs,
  ) => Effect.Effect<IssueResult, LayerErrors, never>;
  readonly getPullRequest: (
    args: GetPullRequestArgs,
  ) => Effect.Effect<PullRequestResult, LayerErrors, never>;
  readonly getPullRequestComments: (
    args: GetPullRequestCommentsArgs,
  ) => Effect.Effect<PullRequestCommentsResult, LayerErrors, never>;
  readonly getPullRequestReviews: (
    args: GetPullRequestReviewsArgs,
  ) => Effect.Effect<PullRequestReviewsResult, LayerErrors, never>;
  readonly getPullRequestReviewComments: (
    args: GetPullRequestReviewCommentsArgs,
  ) => Effect.Effect<PullRequestReviewCommentsResult, LayerErrors, never>;
  readonly createPullRequestComment: (
    args: PullRequestCommentCreationArgs,
  ) => Effect.Effect<CreatePullRequestCommentResult, LayerErrors, never>;
  readonly createPullRequestReview: (
    args: PullRequestReviewCreationArgs,
  ) => Effect.Effect<CreatePullRequestReviewResult, LayerErrors, never>;
  readonly deletePullRequestReview: (
    args: PullRequestReviewDeletionArgs,
  ) => Effect.Effect<DeletePullRequestReviewResult, LayerErrors, never>;
  readonly deletePullRequestComment: (
    args: PullRequestCommentDeletionArgs,
  ) => Effect.Effect<DeletePullRequestCommentResult, LayerErrors, never>;
}

export const OctokitLayerContext = Context.GenericTag<Octokit>('Octokit');
