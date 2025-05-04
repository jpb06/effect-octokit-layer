import { HttpClient } from '@effect/platform';
import { Effect, Schema, pipe } from 'effect';

import { getFromGithub } from './logic/index.js';

export const fetchJsonFromGithub = <A, I, R>(
  url: string,
  expectedOutputSchema: Schema.Schema<A, I, R>,
) =>
  pipe(
    HttpClient.HttpClient,
    Effect.andThen(getFromGithub(url)),
    Effect.andThen((response) => response.json),
    Effect.andThen((json) => Schema.decodeUnknown(expectedOutputSchema)(json)),
    Effect.withSpan('fetch-json-from-github', { attributes: { url } }),
  );
