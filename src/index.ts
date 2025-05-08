import type {
  CreatePullRequestCommentResult,
  CreatePullRequestReviewResult,
  DeletePullRequestCommentResult,
  DeletePullRequestReviewResult,
  IssueCommentsResult,
  IssueResult,
  OrgRepositoriesResult,
  PullRequestCommentDeletionArgs,
  PullRequestCommentsResult,
  PullRequestResult,
  PullRequestReviewCommentsResult,
  PullRequestReviewDeletionArgs,
  PullRequestReviewsResult,
  PullRequestState,
  RepoIssuesResult,
  RepoLanguagesResult,
  RepoPullRequestsCommentsResult,
  RepoPullRequestsResult,
  RepoReleasesResult,
  RepoTagsResult,
  UserCommitsCountResult,
  UserCommitsSearchResult,
  UserEventsResult,
  UserIssuesCountResult,
  UserIssuesSearchResult,
  UserOrgsResult,
  UserProfileResult,
  UserPullRequestsCountResult,
  UserPullRequestsSearchResult,
  UserReposType,
  UserRepositoriesResult,
} from '@implementation';
import type { RepoArgs } from '@implementation/types';

import { OctokitLayerLive } from './layer/octokit.layer-live.js';
import { OctokitLayer } from './layer/octokit.layer.js';

export { OctokitLayer, OctokitLayerLive };
export type { RepoArgs };
export type {
  CreatePullRequestCommentResult,
  CreatePullRequestReviewResult,
  DeletePullRequestCommentResult,
  DeletePullRequestReviewResult,
  IssueCommentsResult,
  IssueResult,
  PullRequestCommentDeletionArgs,
  PullRequestCommentsResult,
  PullRequestResult,
  PullRequestReviewCommentsResult,
  PullRequestReviewDeletionArgs,
  PullRequestReviewsResult,
  RepoIssuesResult,
  RepoPullRequestsResult,
  UserRepositoriesResult,
  OrgRepositoriesResult,
  UserEventsResult,
  UserOrgsResult,
  UserProfileResult,
  PullRequestState,
  UserReposType,
  RepoTagsResult,
  UserCommitsSearchResult,
  UserIssuesSearchResult,
  UserPullRequestsSearchResult,
  RepoReleasesResult,
  RepoLanguagesResult,
  UserIssuesCountResult,
  UserCommitsCountResult,
  RepoPullRequestsCommentsResult,
  UserPullRequestsCountResult,
};

export * from './types/effect.types.js';
export * from './layer/errors/github-api.error.js';
export * from './layer/errors/api-rate-limit.error.js';

export type { LayerErrors, Octokit } from './layer/octokit.context.js';
export { OctokitApiRateLimitErrorSchema } from './layer/errors/octokit-api-rate-limit-error.schema.js';
