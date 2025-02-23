import { Effect, pipe } from 'effect';

import { handleOctokitRequestError } from '@errors';
import { githubSourceAnalysisProvider } from '@provider';
import { retryAfterSchedule } from '@schedules';
import type { EffectResultSuccess } from '@types';

export const getUserProfile = (username: string) =>
  Effect.withSpan('get-user-profile', {
    attributes: { username },
  })(
    pipe(
      githubSourceAnalysisProvider,
      Effect.flatMap((octokit) =>
        pipe(
          Effect.tryPromise({
            try: () => octokit.request('GET /user'),
            catch: handleOctokitRequestError,
          }),
          Effect.retry(retryAfterSchedule),
        ),
      ),
      Effect.map((response) => response.data),
    ),
  );

export type UserProfileResult = EffectResultSuccess<typeof getUserProfile>;
