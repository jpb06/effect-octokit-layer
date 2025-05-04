import { Layer } from 'effect';

import {
  createPullRequestComment,
  createPullRequestReview,
  deletePullRequestComment,
  deletePullRequestReview,
  getIssue,
  getIssueComments,
  getOrgRepositories,
  getPullRequest,
  getPullRequestComments,
  getPullRequestReviewComments,
  getPullRequestReviews,
  getRepoIssues,
  getRepoPullRequests,
  getRepoPullRequestsComments,
  getUserCommits,
  getUserEvents,
  getUserIssues,
  getUserOrgs,
  getUserProfile,
  getUserPullRequests,
  getUserRepositories,
} from '@implementation';

import { OctokitLayerContext } from './octokit.context.js';

export const OctokitLayerLive = Layer.succeed(
  OctokitLayerContext,
  OctokitLayerContext.of({
    getUserProfile,
    getUserOrgs,
    getUserEvents,
    getUserCommits,
    getUserIssues,
    getUserPullRequests,
    getOrgRepositories,
    getUserRepositories,
    getRepoPullRequests,
    getRepoPullRequestsComments,
    getRepoIssues,
    getIssue,
    getIssueComments,
    getPullRequest,
    getPullRequestReviews,
    getPullRequestComments,
    getPullRequestReviewComments,
    createPullRequestComment,
    createPullRequestReview,
    deletePullRequestReview,
    deletePullRequestComment,
  }),
);
