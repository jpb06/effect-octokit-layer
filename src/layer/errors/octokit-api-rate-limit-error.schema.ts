import { Schema, pipe } from 'effect';

export const OctokitApiRateLimitErrorSchema = Schema.Struct({
  name: Schema.String,
  status: Schema.Number,
  request: Schema.Struct({
    url: pipe(Schema.String, Schema.pattern(/^https:\/\/api\.github\.com\//)),
  }),
  response: Schema.Struct({
    data: pipe(
      Schema.Struct({
        message: pipe(Schema.String, Schema.optional),
      }),
      Schema.optional,
    ),
    headers: Schema.Struct({
      'retry-after': pipe(
        Schema.String,
        Schema.nonEmptyString(),
        Schema.pattern(/^[1-9]\d*$/),
        Schema.optional,
      ),
      'x-ratelimit-reset': pipe(Schema.String, Schema.optional),
      'x-ratelimit-resource': pipe(Schema.String, Schema.optional),
      'x-ratelimit-limit': pipe(Schema.String, Schema.optional),
      'x-ratelimit-used': pipe(Schema.String, Schema.optional),
      'x-ratelimit-remaining': pipe(Schema.String, Schema.optional),
    }),
  }),
});
