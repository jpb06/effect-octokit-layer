import type { Octokit } from '@octokit/core';
import type { Endpoints } from '@octokit/types';
import type { RequestParameters } from '@octokit/types/dist-types/RequestParameters.js';

export const octokitRequest =
  ({ request }: Octokit) =>
  <TRoute extends keyof Endpoints>(
    route: TRoute,
    options?: Endpoints[TRoute]['parameters'] & RequestParameters,
  ): Promise<Endpoints[TRoute]['response']> =>
    request<TRoute>(route, options as never) as Promise<
      Endpoints[TRoute]['response']
    >;
