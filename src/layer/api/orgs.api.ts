import type { Effect } from 'effect';

import { defaultConcurrency } from '@constants';
import type { OrgRepositoriesResult } from '@implementation';

import {
  OctokitLayerContext as Context,
  type LayerErrors,
  type Octokit,
} from '../octokit.context.js';
import { tapLayer } from './effects/tap-octokit-layer.effect.js';

export const orgsApi = (owner: string) => ({
  /**
   * Github documentation:
   * https://docs.github.com/en/rest/repos/repos#list-organization-repositories
   */
  repos: (
    concurrency = defaultConcurrency,
  ): Effect.Effect<OrgRepositoriesResult, LayerErrors, Octokit> =>
    tapLayer(Context, ({ getOrgRepositories }) =>
      getOrgRepositories({ org: owner, concurrency }),
    ),
});
