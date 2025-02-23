import { Effect, pipe } from 'effect';

import { handleOctokitRequestError } from '@errors';
import { githubSourceAnalysisProvider } from '@provider';
import { retryAfterSchedule } from '@schedules';
import type { EffectResultSuccess } from '@types';

export const getUserOrgs = (username: string) =>
  Effect.withSpan('get-user-orgs', {
    attributes: { username },
  })(
    pipe(
      githubSourceAnalysisProvider,
      Effect.flatMap((octokit) =>
        pipe(
          Effect.tryPromise({
            try: () =>
              octokit.request('GET /user/orgs', {
                username,
                per_page: 100,
              }),
            catch: handleOctokitRequestError,
          }),
          Effect.retry(retryAfterSchedule),
        ),
      ),
      Effect.map((response) => response.data),
    ),
  );

export type UserOrgsResult = EffectResultSuccess<typeof getUserOrgs>;
