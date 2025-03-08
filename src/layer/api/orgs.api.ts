import { defaultConcurrency } from '@constants';

import { tapLayer } from '../effects/tap-layer.effect.js';
import { OctokitLayerContext as Context } from '../octokit.context.js';

export const orgsApi = (owner: string) => ({
  repos: (concurrency = defaultConcurrency) =>
    tapLayer(Context, ({ getRepositories }) =>
      getRepositories({ target: owner, type: 'org', concurrency }),
    ),
});
