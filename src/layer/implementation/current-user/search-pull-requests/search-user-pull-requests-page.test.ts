import { Duration, Effect, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { retryWarningMessage } from '@constants';
import { ApiRateLimitError, GithubApiError } from '@errors';
import { delayEffect, delayEffectAndFlip } from '@tests/effects';
import { makeConsoleTestLayer } from '@tests/layers';
import {
  mockData,
  octokitRequestErrorWithRetryAfter,
  octokitRequestResponseHeaders,
} from '@tests/mock-data';
import { octokitMock } from '@tests/mocks';

import type { SearchUserPullRequestsPageArgs } from './search-user-pull-requests-page.js';

vi.mock('@octokit/core');

describe('searchUserPullRequestsPage effect', () => {
  const args: SearchUserPullRequestsPageArgs = {
    username: 'cool',
    query: '',
    state: 'merged',
    page: 1,
    perPage: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('GITHUB_TOKEN', 'GITHUB_TOKEN_VALUE');
  });

  it('should fail if github token env variable is not set', async () => {
    vi.unstubAllEnvs();

    const { searchUserPullRequestsPage } = await import(
      './search-user-pull-requests-page.js'
    );

    const task = pipe(searchUserPullRequestsPage(args), Effect.flip);
    const result = await Effect.runPromise(task);

    expect(result).toBeInstanceOf(GithubApiError);
    expect((result as Error).message).toBe('GITHUB_TOKEN not set');
  });

  it('should return data with links', async () => {
    octokitMock.requestOnce({
      data: mockData,
      ...octokitRequestResponseHeaders(25),
    });

    const { searchUserPullRequestsPage } = await import(
      './search-user-pull-requests-page.js'
    );

    const task = searchUserPullRequestsPage(args);
    const result = await runPromise(task);

    expect(result.data).toStrictEqual(mockData);
    expect(result.links).toStrictEqual({ next: 2, last: 25 });
  });

  it('should fail with an Octokit request error', async () => {
    octokitMock.requestFail(new GithubApiError({ cause: 'Oh no' }));

    const { searchUserPullRequestsPage } = await import(
      './search-user-pull-requests-page.js'
    );

    const task = pipe(searchUserPullRequestsPage(args), Effect.flip);
    const result = await Effect.runPromise(pipe(task));

    expect(result).toBeInstanceOf(GithubApiError);
  });

  it('should fail with an api rate limit error', async () => {
    const retryDelay = 20;
    const error = octokitRequestErrorWithRetryAfter(retryDelay);
    octokitMock.requestFail(error);

    const { warnMock, ConsoleTestLayer } = makeConsoleTestLayer();

    const { searchUserPullRequestsPage } = await import(
      './search-user-pull-requests-page.js'
    );

    const task = pipe(searchUserPullRequestsPage(args), ConsoleTestLayer);
    const effect = delayEffectAndFlip(task, Duration.seconds(40));
    const result = await Effect.runPromise(effect);

    expect(result).toBeInstanceOf(ApiRateLimitError);
    expect(warnMock).toHaveBeenCalledTimes(2);

    const warnMessage = retryWarningMessage('/user', retryDelay);
    expect(warnMock).toHaveBeenNthCalledWith(1, warnMessage);
    expect(warnMock).toHaveBeenNthCalledWith(2, warnMessage);
  });

  it('should retry one time and then succeed', async () => {
    const retryDelay = 20;
    const error = octokitRequestErrorWithRetryAfter(retryDelay);
    octokitMock.requestFailAndThenSucceed(error, {
      data: mockData,
      ...octokitRequestResponseHeaders(25),
    });

    const { warnMock, ConsoleTestLayer } = makeConsoleTestLayer();

    const { searchUserPullRequestsPage } = await import(
      './search-user-pull-requests-page.js'
    );

    const task = pipe(searchUserPullRequestsPage(args), ConsoleTestLayer);
    const effect = delayEffect(task, Duration.seconds(40));
    const result = await runPromise(effect);

    expect(warnMock).toHaveBeenCalledTimes(1);
    expect(result.data).toStrictEqual(mockData);
    expect(result.links).toStrictEqual({ next: 2, last: 25 });
  });
});
