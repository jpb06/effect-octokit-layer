import type { HttpClient } from '@effect/platform/HttpClient';
import type { HttpClientError } from '@effect/platform/HttpClientError';
import type { Effect } from 'effect';
import type { ParseError } from 'effect/ParseResult';

import type { ApiRateLimitError, GithubApiError } from '@errors';
import type { RepoLanguages, RepoTags } from '@implementation';
import { fetchRepoLanguages, fetchReposTags } from '@implementation';
import type { RepoArgs } from '@implementation/types';

export const httpApi = {
  fetchRepoLanguages: (
    args: RepoArgs,
  ): Effect.Effect<
    RepoLanguages,
    HttpClientError | ParseError | GithubApiError | ApiRateLimitError,
    HttpClient
  > => fetchRepoLanguages(args),
  fetchRepoTags: (
    args: RepoArgs,
  ): Effect.Effect<
    RepoTags,
    HttpClientError | ParseError | GithubApiError | ApiRateLimitError,
    HttpClient
  > => fetchReposTags(args),
};
