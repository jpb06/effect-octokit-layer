import type { Effect } from 'effect';

import { defaultConcurrency } from '@constants';
import type {
  PullRequestState,
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
  getIssuesCount: (): Effect.Effect<
    UserIssuesCountResult,
    LayerErrors,
    Octokit
  > =>
    tapLayer(Context, ({ getUserIssuesCount }) =>
      getUserIssuesCount({ username }),
    ),
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-issues-and-pull-requests
   */
  searchIssues: (
    query: string,
    fetchOnlyFirstPage = false,
    concurrency = defaultConcurrency,
  ): Effect.Effect<UserIssuesSearchResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ searchUserIssues }) =>
      searchUserIssues({ username, query, fetchOnlyFirstPage, concurrency }),
    ),
  getCommitsCount: (): Effect.Effect<
    UserCommitsCountResult,
    LayerErrors,
    Octokit
  > =>
    tapLayer(Context, ({ getUserCommitsCount }) =>
      getUserCommitsCount({ username }),
    ),
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-commits
   */
  searchCommits: (
    query: string,
    fetchOnlyFirstPage = false,
    concurrency = defaultConcurrency,
  ): Effect.Effect<UserCommitsSearchResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ searchUserCommits }) =>
      searchUserCommits({ username, query, fetchOnlyFirstPage, concurrency }),
    ),
  getPullRequestsCount: (
    state: PullRequestState,
  ): Effect.Effect<UserPullRequestsCountResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ getUserPullRequestsCount }) =>
      getUserPullRequestsCount({ username, state }),
    ),
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-issues-and-pull-requests
   */
  searchPullRequests: (
    state: PullRequestState,
    query: string,
    fetchOnlyFirstPage = false,
    concurrency = defaultConcurrency,
  ): Effect.Effect<UserPullRequestsSearchResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ searchUserPullRequests }) =>
      searchUserPullRequests({
        username,
        state,
        query,
        fetchOnlyFirstPage,
        concurrency,
      }),
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
    type: UserReposType,
    concurrency = defaultConcurrency,
  ): Effect.Effect<UserRepositoriesResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ getUserRepositories }) =>
      getUserRepositories({ username, type, concurrency }),
    ),
});
