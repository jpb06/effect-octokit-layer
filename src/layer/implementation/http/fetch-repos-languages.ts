import type { HttpClient } from '@effect/platform/HttpClient';
import type { HttpClientError } from '@effect/platform/HttpClientError';
import { Effect, Schema, pipe } from 'effect';
import type { ParseError } from 'effect/ParseResult';

import type { ApiRateLimitError, GithubApiError } from '@errors';
import type { RepoArgs } from '@implementation/types';

import { fetchJsonFromGithub } from './fetch-json-from-github/fetch-json-from-github.js';

const RepoLanguagesSchema = Schema.Record({
  key: Schema.String,
  value: Schema.Number,
});
export type RepoLanguages = Schema.Schema.Type<typeof RepoLanguagesSchema>;

export const fetchRepoLanguages = ({
  owner,
  repo,
}: RepoArgs): Effect.Effect<
  RepoLanguages,
  HttpClientError | ParseError | GithubApiError | ApiRateLimitError,
  HttpClient
> =>
  pipe(
    fetchJsonFromGithub(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      RepoLanguagesSchema,
    ),
    Effect.withSpan('fetch-repo-languages', { attributes: { owner, repo } }),
  );
