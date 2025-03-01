import { Schema } from '@effect/schema';

export const OctokitApiRateLimitErrorSchema = Schema.Struct({
  request: Schema.Struct({
    url: Schema.String.pipe(Schema.pattern(/^https:\/\/api\.github\.com\//)),
  }),
  response: Schema.Struct({
    headers: Schema.Struct({
      'retry-after': Schema.String.pipe(
        Schema.nonEmptyString(),
        Schema.pattern(/^[1-9]\d*$/),
      ),
    }),
  }),
});
