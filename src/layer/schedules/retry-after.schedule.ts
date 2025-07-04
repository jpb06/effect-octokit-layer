import { Duration, Effect, pipe, Schedule } from 'effect';

import { isApiRateLimitError } from '@errors';

export const retryAfterSchedule = pipe(
  Schedule.forever,
  Schedule.whileOutput((retries) => retries < 1),
  Schedule.whileInputEffect((e) => {
    const isApiRateLimit = isApiRateLimitError(e);
    if (isApiRateLimit) {
      return Effect.delay(Duration.seconds(+e.retryAfterInSeconds + 5))(
        Effect.succeed(true),
      );
    }

    return Effect.succeed(false);
  }),
);
