import type { Octokit } from '@octokit/core';
import type { Endpoints } from '@octokit/types';
import type { RequestParameters } from '@octokit/types/dist-types/RequestParameters.js';

export const octokitRequest =
  (octokit: Octokit) =>
  <E extends keyof Endpoints>(
    route: E,
    options?: Endpoints[E]['parameters'] & RequestParameters,
  ): Promise<Endpoints[E]['response']> =>
    octokit.request<E>(route, options as never);
