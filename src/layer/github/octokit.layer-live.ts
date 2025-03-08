import { Layer } from 'effect';

import {
  createPullRequestComment,
  createPullRequestReview,
  deletePullRequestComment,
  deletePullRequestReview,
  getIssue,
  getPullRequest,
  getPullRequestComments,
  getPullRequestReviewComments,
  getPullRequestReviews,
  getRepoIssues,
  getRepoPullRequests,
  getRepositories,
  getUserEvents,
  getUserOrgs,
  getUserProfile,
} from '@implementation';

import { OctokitLayerContext } from '../octokit.context.js';

export const OctokitLayerLive = Layer.succeed(
  OctokitLayerContext,
  OctokitLayerContext.of({
    getUserProfile,
    getUserOrgs,
    getUserEvents,
    getRepositories,
    getRepoPullRequests,
    getRepoIssues,
    getIssue,
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
