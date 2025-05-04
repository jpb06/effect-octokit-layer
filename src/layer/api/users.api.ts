import type { Effect } from 'effect';

import { defaultConcurrency } from '@constants';
import type {
  PullRequestState,
  UserCommitsResult,
  UserEventsResult,
  UserIssuesResult,
  UserOrgsResult,
  UserProfileResult,
  UserPullRequestsResult,
  UserRepositoriesResult,
} from '@implementation';

import {
  OctokitLayerContext as Context,
  type LayerErrors,
  type Octokit,
} from '../octokit.context.js';
import { tapLayer } from './effects/tap-octokit-layer.effect.js';

export const usersApi = (username: string) => ({
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user
   */
  profile: (): Effect.Effect<UserProfileResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ getUserProfile }) => getUserProfile(username)),
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/orgs/orgs#list-organizations-for-the-authenticated-user
   */
  orgs: (): Effect.Effect<UserOrgsResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ getUserOrgs }) => getUserOrgs(username)),
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-issues-and-pull-requests
   */
  issues: (
    concurrency = defaultConcurrency,
  ): Effect.Effect<UserIssuesResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ getUserIssues }) =>
      getUserIssues({ username, concurrency }),
    ),
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-commits
   */
  commits: (
    concurrency = defaultConcurrency,
  ): Effect.Effect<UserCommitsResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ getUserCommits }) =>
      getUserCommits({ username, concurrency }),
    ),
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-issues-and-pull-requests
   */
  pullRequests: (
    state: PullRequestState,
    concurrency = defaultConcurrency,
  ): Effect.Effect<UserPullRequestsResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ getUserPullRequests }) =>
      getUserPullRequests({ username, state, concurrency }),
    ),
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/activity/events?apiVersion=2022-11-28#list-events-for-the-authenticated-user
   */
  events: (
    concurrency = defaultConcurrency,
  ): Effect.Effect<UserEventsResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ getUserEvents }) =>
      getUserEvents({ username, concurrency }),
    ),
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user
   */
  repos: (
    concurrency = defaultConcurrency,
  ): Effect.Effect<UserRepositoriesResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ getUserRepositories }) =>
      getUserRepositories({ username, concurrency }),
    ),
});
