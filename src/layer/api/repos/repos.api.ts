import type { Effect } from 'effect';

import { defaultConcurrency } from '@constants';
import type {
  GetRepoFileResult,
  RepoDetailsResult,
  RepoLanguagesResult,
  RepoReleasesResult,
  RepoTagsResult,
} from '@implementation';
import type { RepoArgs } from '@implementation/types';

import {
  OctokitLayerContext as Context,
  type LayerErrors,
  type Octokit,
} from '../../octokit.context.js';
import { tapLayer } from '../effects/tap-octokit-layer.effect.js';
import { repoIssuesApi } from './issues/issues.api.js';
import { repoPullRequestsApi } from './pull-requests/pull-requests.api.js';

export const reposApi = (args: RepoArgs) => ({
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository
   */
  details: (): Effect.Effect<RepoDetailsResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ getRepoDetails }) => getRepoDetails(args)),
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content
   */
  getFile: (getFileArgs: {
    path: string;
    ref?: string;
  }): Effect.Effect<GetRepoFileResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ getRepoFile }) =>
      getRepoFile({ ...args, ...getFileArgs }),
    ),
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repository-tags
   */
  tags: (
    concurrency = defaultConcurrency,
  ): Effect.Effect<RepoTagsResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ getRepoTags }) =>
      getRepoTags({ ...args, concurrency }),
    ),
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/repos/repos#list-repository-languages
   */
  languages: (): Effect.Effect<RepoLanguagesResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ getRepoLanguages }) => getRepoLanguages(args)),
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/releases/releases?apiVersion=2022-11-28#list-releases
   */
  releases: (
    concurrency = defaultConcurrency,
  ): Effect.Effect<RepoReleasesResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ getRepoReleases }) =>
      getRepoReleases({ ...args, concurrency }),
    ),
  ...repoIssuesApi(args),
  ...repoPullRequestsApi(args),
});
