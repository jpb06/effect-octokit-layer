import type { Endpoints } from '@octokit/types';
import type { RequestParameters } from '@octokit/types/dist-types/RequestParameters.js';
import { Effect, pipe } from 'effect';

import { handleOctokitRequestError } from '@errors';
import { githubSourceAnalysisProvider } from '@provider';
import { retryAfterSchedule } from '@schedules';

import { octokitRequest, parseLink } from './logic/index.js';

export const getOnePage = <E extends keyof Endpoints>(
  span: string,
  route: E,
  options?: Endpoints[E]['parameters'] & RequestParameters,
) =>
  Effect.withSpan(span, {
    attributes: {
      ...options,
    },
  })(
    pipe(
      githubSourceAnalysisProvider,
      Effect.flatMap((octokit) =>
        pipe(
          Effect.tryPromise({
            try: () => octokitRequest(octokit)<E>(route, options),
            catch: handleOctokitRequestError,
          }),
          Effect.retry(retryAfterSchedule),
        ),
      ),
      Effect.map((response) => ({
        data: response.data as Endpoints[E]['response']['data'],
        links: parseLink(response),
      })),
    ),
  );
