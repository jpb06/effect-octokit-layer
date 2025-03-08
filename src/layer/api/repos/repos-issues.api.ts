import { defaultConcurrency } from '@constants';

import { tapLayer } from '../../effects/tap-layer.effect.js';
import { OctokitLayerContext as Context } from '../../octokit.context.js';
import type { RepoArgs } from './types/repo-args.type.js';

export const repoIssuesApi = ({ owner, name }: RepoArgs) => ({
  issues: (concurrency = defaultConcurrency) =>
    tapLayer(Context, ({ getRepoIssues }) =>
      getRepoIssues({ owner, repo: name, concurrency }),
    ),
  issue: (number: number) =>
    tapLayer(Context, ({ getIssue }) =>
      getIssue({ owner, repo: name, number }),
    ),
});
