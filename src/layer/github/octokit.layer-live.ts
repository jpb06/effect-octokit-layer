import { Layer } from 'effect';

import {
  getIssue,
  getPullRequest,
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
  }),
);
