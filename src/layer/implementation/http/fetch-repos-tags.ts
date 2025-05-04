import type { HttpClient } from '@effect/platform/HttpClient';
import type { HttpClientError } from '@effect/platform/HttpClientError';
import { Effect, Schema, pipe } from 'effect';
import type { ParseError } from 'effect/ParseResult';

import type { ApiRateLimitError, GithubApiError } from '@errors';
import type { RepoArgs } from '@implementation/types';

import { fetchJsonFromGithub } from './fetch-json-from-github/fetch-json-from-github.js';

const RepoTagsSchema = Schema.Array(
  Schema.Struct({
    name: Schema.String,
    zipball_url: Schema.URL,
    tarball_url: Schema.URL,
    commit: Schema.Struct({
      sha: Schema.String,
      url: Schema.URL,
    }),
    node_id: Schema.String,
  }),
);
export type RepoTags = Schema.Schema.Type<typeof RepoTagsSchema>;

export const fetchReposTags = ({
  owner,
  repo,
}: RepoArgs): Effect.Effect<
  RepoTags,
  HttpClientError | ParseError | GithubApiError | ApiRateLimitError,
  HttpClient
> =>
  pipe(
    fetchJsonFromGithub(
      `https://api.github.com/repos/${owner}/${repo}/tags`,
      RepoTagsSchema,
    ),
    Effect.withSpan('fetch-repo-tags', { attributes: { owner, repo } }),
  );
