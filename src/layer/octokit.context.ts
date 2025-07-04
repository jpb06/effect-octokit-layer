import type { ConfigError, Effect } from 'effect';
import { Context } from 'effect';

import type { ApiRateLimitError, GithubApiError } from '@errors';
import type {
  CreatePullRequestCommentResult,
  CreatePullRequestReviewResult,
  DeletePullRequestCommentResult,
  DeletePullRequestReviewResult,
  GetIssueArgs,
  GetIssueCommentsArgs,
  GetOrgRepositoriesArgs,
  GetPullRequestArgs,
  GetPullRequestCommentsArgs,
  GetPullRequestReviewCommentsArgs,
  GetPullRequestReviewsArgs,
  GetRepoFileArgs,
  GetRepoFileResult,
  GetRepoIssuesArgs,
  GetRepoLanguagesArgs,
  GetRepoPullRequestsArgs,
  GetRepoPullRequestsCommentsArgs,
  GetRepoReleasesArgs,
  GetRepoTagsArgs,
  GetUserCommitsCountArgs,
  GetUserEventsArgs,
  GetUserIssuesCountArgs,
  GetUserPullRequestsCountArgs,
  GetUserRepositoriesArgs,
  IssueCommentsResult,
  IssueResult,
  OrgRepositoriesResult,
  PullRequestCommentCreationArgs,
  PullRequestCommentDeletionArgs,
  PullRequestCommentsResult,
  PullRequestResult,
  PullRequestReviewCommentsResult,
  PullRequestReviewCreationArgs,
  PullRequestReviewDeletionArgs,
  PullRequestReviewsResult,
  RepoArgs,
  RepoDetailsResult,
  RepoIssuesResult,
  RepoLanguagesResult,
  RepoPullRequestsCommentsResult,
  RepoPullRequestsResult,
  RepoReleasesResult,
  RepoTagsResult,
  SearchUserCommitsArgs,
  SearchUserIssuesArgs,
  SearchUserPullRequestsArgs,
  UserCommitsCountResult,
  UserCommitsSearchResult,
  UserEventsResult,
  UserIssuesCountResult,
  UserIssuesSearchResult,
  UserOrgsResult,
  UserProfileResult,
  UserPullRequestsCountResult,
  UserPullRequestsSearchResult,
  UserRepositoriesResult,
} from '@implementation';

export type LayerErrors =
  | GithubApiError
  | ApiRateLimitError
  | ConfigError.ConfigError;

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
  readonly searchUserCommits: (
    args: SearchUserCommitsArgs,
  ) => Effect.Effect<UserCommitsSearchResult, LayerErrors, never>;
  readonly searchUserIssues: (
    args: SearchUserIssuesArgs,
  ) => Effect.Effect<UserIssuesSearchResult, LayerErrors, never>;
  readonly searchUserPullRequests: (
    args: SearchUserPullRequestsArgs,
  ) => Effect.Effect<UserPullRequestsSearchResult, LayerErrors, never>;
  readonly getUserCommitsCount: (
    args: GetUserCommitsCountArgs,
  ) => Effect.Effect<UserCommitsCountResult, LayerErrors, never>;
  readonly getUserIssuesCount: (
    args: GetUserIssuesCountArgs,
  ) => Effect.Effect<UserIssuesCountResult, LayerErrors, never>;
  readonly getUserPullRequestsCount: (
    args: GetUserPullRequestsCountArgs,
  ) => Effect.Effect<UserPullRequestsCountResult, LayerErrors, never>;
  readonly getOrgRepositories: (
    args: GetOrgRepositoriesArgs,
  ) => Effect.Effect<OrgRepositoriesResult, LayerErrors, never>;
  readonly getUserRepositories: (
    args: GetUserRepositoriesArgs,
  ) => Effect.Effect<UserRepositoriesResult, LayerErrors, never>;
  readonly getRepoDetails: (
    args: RepoArgs,
  ) => Effect.Effect<RepoDetailsResult, LayerErrors, never>;
  readonly getRepoTags: (
    args: GetRepoTagsArgs,
  ) => Effect.Effect<RepoTagsResult, LayerErrors, never>;
  readonly getRepoReleases: (
    args: GetRepoReleasesArgs,
  ) => Effect.Effect<RepoReleasesResult, LayerErrors, never>;
  readonly getRepoLanguages: (
    args: GetRepoLanguagesArgs,
  ) => Effect.Effect<RepoLanguagesResult, LayerErrors, never>;
  readonly getRepoPullRequests: (
    args: GetRepoPullRequestsArgs,
  ) => Effect.Effect<RepoPullRequestsResult, LayerErrors, never>;
  readonly getRepoPullRequestsComments: (
    args: GetRepoPullRequestsCommentsArgs,
  ) => Effect.Effect<RepoPullRequestsCommentsResult, LayerErrors, never>;
  readonly getRepoIssues: (
    args: GetRepoIssuesArgs,
  ) => Effect.Effect<RepoIssuesResult, LayerErrors, never>;
  readonly getIssue: (
    args: GetIssueArgs,
  ) => Effect.Effect<IssueResult, LayerErrors, never>;
  readonly getIssueComments: (
    args: GetIssueCommentsArgs,
  ) => Effect.Effect<IssueCommentsResult, LayerErrors, never>;
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
  readonly getRepoFile: (
    args: GetRepoFileArgs,
  ) => Effect.Effect<GetRepoFileResult, LayerErrors, never>;
}

export const OctokitLayerContext = Context.GenericTag<Octokit>('Octokit');
