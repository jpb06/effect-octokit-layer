import { orgsApi, reposApi, usersApi } from '@api';

export const OctokitLayer = {
  user: usersApi,
  org: orgsApi,
  repo: reposApi,
};
