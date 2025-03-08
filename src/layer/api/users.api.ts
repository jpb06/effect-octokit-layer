import { defaultConcurrency } from '@constants';

import { tapLayer } from '../effects/tap-layer.effect.js';
import { OctokitLayerContext as Context } from '../octokit.context.js';

export const usersApi = (username: string) => ({
  profile: () =>
    tapLayer(Context, ({ getUserProfile }) => getUserProfile(username)),
  orgs: () => tapLayer(Context, ({ getUserOrgs }) => getUserOrgs(username)),
  events: (concurrency = defaultConcurrency) =>
    tapLayer(Context, ({ getUserEvents }) =>
      getUserEvents({ username, concurrency }),
    ),
  repos: (concurrency = defaultConcurrency) =>
    tapLayer(Context, ({ getRepositories }) =>
      getRepositories({ target: username, type: 'user', concurrency }),
    ),
});
