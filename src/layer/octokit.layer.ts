import {
  httpApi,
  orgsApi,
  repoIssuesApi,
  repoPullRequestsApi,
  usersApi,
} from '@api';
import type { RepoArgs } from '@implementation/types';

export const OctokitLayer = {
  http: httpApi,
  user: usersApi,
  org: orgsApi,
  repo: (args: RepoArgs) => ({
    ...repoIssuesApi(args),
    ...repoPullRequestsApi(args),
  }),
};
