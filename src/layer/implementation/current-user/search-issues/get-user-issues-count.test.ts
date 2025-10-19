import { Duration, Effect, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { retryWarningMessage } from '@constants';
import { ApiRateLimitError, GithubApiError } from '@errors';
import { delayEffect, delayEffectAndFlip } from '@tests/effects';
import { makeConsoleTestLayer } from '@tests/layers';
import {
  octokitRequestErrorWithRetryAfter,
  octokitRequestResponseHeaders,
} from '@tests/mock-data';
import { octokitMock } from '@tests/mocks';

import type { GetUserIssuesCountArgs } from './get-user-issues-count.js';

vi.mock('@octokit/core');

describe('getUserIssuesCount effect', () => {
  const count = 2000;
  const args: GetUserIssuesCountArgs = {
    username: 'cool',
    type: 'all',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('GITHUB_TOKEN', 'GITHUB_TOKEN_VALUE');
  });

  it('should fail if github token env variable is not set', async () => {
    vi.unstubAllEnvs();

    const { getUserIssuesCount } = await import('./get-user-issues-count.js');

    const task = pipe(getUserIssuesCount(args), Effect.flip);
    const result = await Effect.runPromise(task);

    expect(result).toBeInstanceOf(GithubApiError);
    expect((result as Error).message).toBe('GITHUB_TOKEN not set');
  });

  it('should return count', async () => {
    octokitMock.requestOnce({
      data: {
        total_count: count,
      },
      ...octokitRequestResponseHeaders(25),
    });

    const { getUserIssuesCount } = await import('./get-user-issues-count.js');

    const task = getUserIssuesCount(args);
    const result = await runPromise(task);

    expect(result).toStrictEqual(count);
  });

  it('should fail with an Octokit request error', async () => {
    octokitMock.requestFail(new GithubApiError({ cause: 'Oh no' }));

    const { getUserIssuesCount } = await import('./get-user-issues-count.js');

    const task = pipe(getUserIssuesCount(args), Effect.flip);
    const result = await Effect.runPromise(pipe(task));

    expect(result).toBeInstanceOf(GithubApiError);
  });

  it('should fail with an api rate limit error', async () => {
    const retryDelay = 20;
    const error = octokitRequestErrorWithRetryAfter(retryDelay);
    octokitMock.requestFail(error);

    const { warnMock, ConsoleTestLayer } = makeConsoleTestLayer();

    const { getUserIssuesCount } = await import('./get-user-issues-count.js');

    const task = pipe(getUserIssuesCount(args), ConsoleTestLayer);
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
      data: {
        total_count: count,
      },
      ...octokitRequestResponseHeaders(25),
    });

    const { warnMock, ConsoleTestLayer } = makeConsoleTestLayer();

    const { getUserIssuesCount } = await import('./get-user-issues-count.js');

    const task = pipe(getUserIssuesCount(args), ConsoleTestLayer);
    const effect = delayEffect(task, Duration.seconds(40));
    const result = await runPromise(effect);

    expect(warnMock).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(count);
  });
});
