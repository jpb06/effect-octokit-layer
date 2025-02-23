import { Duration, Effect, pipe } from 'effect';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiRateLimitError, GithubApiError } from '@errors';
import { expectApiRateLimitMessages } from '@tests/assertions';
import { delayEffect, delayEffectAndFlip } from '@tests/effects';
import {
  mockData,
  octokitRequestErrorWithRetryAfter,
  octokitRequestResponseHeaders,
} from '@tests/mock-data';
import { mockConsole, octokitMock } from '@tests/mocks';

vi.mock('@octokit/core');
mockConsole({
  warn: vi.fn(),
});

describe('getUserOrgs effect', () => {
  const username = 'yolo';

  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('GITHUB_TOKEN', 'GITHUB_TOKEN_VALUE');
  });

  it('should retun data with links', async () => {
    octokitMock.requestOnce({
      data: mockData,
    });

    const { getUserOrgs } = await import('./get-user-orgs.js');

    const result = await Effect.runPromise(getUserOrgs(username));

    expect(result).toStrictEqual(mockData);
  });

  it('should fail with an Octokit request error', async () => {
    octokitMock.requestFail(new GithubApiError({ cause: 'Oh no' }));

    const { getUserOrgs } = await import('./get-user-orgs.js');

    const result = await Effect.runPromise(
      pipe(getUserOrgs(username), Effect.flip),
    );

    expect(result).toBeInstanceOf(GithubApiError);
  });

  it('should retry three times if api rate limit is reached', async () => {
    const retryDelay = 20;
    const error = octokitRequestErrorWithRetryAfter(retryDelay);
    await octokitMock.requestFail(error);

    const { getUserOrgs } = await import('./get-user-orgs.js');

    const effect = delayEffectAndFlip(
      getUserOrgs(username),
      Duration.seconds(80),
    );
    const result = await Effect.runPromise(effect);

    expect(result).toBeInstanceOf(ApiRateLimitError);
    expectApiRateLimitMessages(error, retryDelay);
  });

  it('should retry one time and then succeed', async () => {
    const retryDelay = 20;
    const error = octokitRequestErrorWithRetryAfter(retryDelay);
    await octokitMock.requestFailAndThenSucceed(error, {
      data: mockData,
      ...octokitRequestResponseHeaders(25),
    });

    const { getUserOrgs } = await import('./get-user-orgs.js');
    const effect = delayEffect(getUserOrgs(username), Duration.seconds(40));
    const result = await Effect.runPromise(effect);

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(mockData);
  });
});
