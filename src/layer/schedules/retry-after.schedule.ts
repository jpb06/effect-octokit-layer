import { Duration, Effect, Schedule, pipe } from 'effect';

import { isApiRateLimitError } from '@errors';

export const retryAfterSchedule = pipe(
  Schedule.forever,
  Schedule.whileOutput((retries) => retries < 1),
  Schedule.whileInputEffect((e) => {
    const isApiRateLimit = isApiRateLimitError(e);
    if (isApiRateLimit) {
      return Effect.delay(Duration.seconds(+e.retryAfter))(
        Effect.succeed(true),
      );
    }

    return Effect.succeed(false);
  }),
);
