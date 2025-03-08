import { orgsApi, repoIssuesApi, repoPullRequestsApi, usersApi } from '@api';

import type { RepoArgs } from './api/repos/types/repo-args.type.js';

export const OctokitLayer = {
  user: usersApi,
  org: orgsApi,
  repo: (args: RepoArgs) => ({
    ...repoIssuesApi(args),
    ...repoPullRequestsApi(args),
  }),
};
