import { Duration, Effect, pipe } from 'effect';
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

vi.mock('@octokit/core');

describe('getUserOrgs effect', () => {
  const username = 'yolo';

  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('GITHUB_TOKEN', 'GITHUB_TOKEN_VALUE');
  });

  it('should return data with links', async () => {
    octokitMock.requestOnce({
      data: mockData,
    });

    const { getUserOrgs } = await import('./get-user-orgs.js');

    const task = getUserOrgs(username);
    const result = await Effect.runPromise(task);

    expect(result).toStrictEqual(mockData);
  });

  it('should fail with an Octokit request error', async () => {
    octokitMock.requestFail(new GithubApiError({ cause: 'Oh no' }));

    const { getUserOrgs } = await import('./get-user-orgs.js');

    const task = pipe(getUserOrgs(username), Effect.flip);
    const result = await Effect.runPromise(task);

    expect(result).toBeInstanceOf(GithubApiError);
  });

  it('should retry three times if api rate limit is reached', async () => {
    const retryDelay = 20;
    const error = octokitRequestErrorWithRetryAfter(retryDelay);
    await octokitMock.requestFail(error);

    const { warnMock, ConsoleTestLayer } = makeConsoleTestLayer();

    const { getUserOrgs } = await import('./get-user-orgs.js');

    const task = pipe(getUserOrgs(username), ConsoleTestLayer);
    const effect = delayEffectAndFlip(task, Duration.seconds(80));
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
    await octokitMock.requestFailAndThenSucceed(error, {
      data: mockData,
      ...octokitRequestResponseHeaders(25),
    });

    const { warnMock, ConsoleTestLayer } = makeConsoleTestLayer();

    const { getUserOrgs } = await import('./get-user-orgs.js');

    const task = pipe(getUserOrgs(username), ConsoleTestLayer);
    const effect = delayEffect(task, Duration.seconds(40));
    const result = await Effect.runPromise(effect);

    expect(warnMock).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(mockData);
  });
});
