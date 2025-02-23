import { Duration, Effect, pipe } from 'effect';
import { runPromise } from 'effect-errors';
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

import type { GetUserEventsPageArgs } from './get-user-events-page.js';

vi.mock('@octokit/core');
mockConsole({
  warn: vi.fn(),
});

describe('getUserEventsPage effect', () => {
  const args: GetUserEventsPageArgs = {
    username: 'cool',
    page: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('GITHUB_TOKEN', 'GITHUB_TOKEN_VALUE');
  });

  it('should fail if github token env variable is not set', async () => {
    vi.unstubAllEnvs();

    const { getUserEventsPage } = await import('./get-user-events-page.js');

    const result = await Effect.runPromise(
      pipe(getUserEventsPage(args), Effect.flip),
    );

    expect(result).toBeInstanceOf(GithubApiError);
    expect((result as Error).message).toBe('GITHUB_TOKEN not set');
  });

  it('should retun data with links', async () => {
    await octokitMock.requestOnce({
      data: mockData,
      ...octokitRequestResponseHeaders(25),
    });

    const { getUserEventsPage } = await import('./get-user-events-page.js');

    const result = await runPromise(getUserEventsPage(args));

    expect(result.data).toStrictEqual(mockData);
    expect(result.links).toStrictEqual({ next: 2, last: 25 });
  });

  it('should fail with an Octokit request error', async () => {
    await octokitMock.requestFail(new GithubApiError({ cause: 'Oh no' }));

    const { getUserEventsPage } = await import('./get-user-events-page.js');

    const result = await Effect.runPromise(
      pipe(getUserEventsPage(args), Effect.flip),
    );

    expect(result).toBeInstanceOf(GithubApiError);
  });

  it('should fail with an api rate limit error', async () => {
    const retryDelay = 20;
    const error = octokitRequestErrorWithRetryAfter(retryDelay);
    await octokitMock.requestFail(error);

    const { getUserEventsPage } = await import('./get-user-events-page.js');

    const effect = delayEffectAndFlip(
      getUserEventsPage(args),
      Duration.seconds(40),
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

    const { getUserEventsPage } = await import('./get-user-events-page.js');

    const effect = delayEffect(getUserEventsPage(args), Duration.seconds(40));
    const result = await runPromise(effect);

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(result.data).toStrictEqual(mockData);
    expect(result.links).toStrictEqual({ next: 2, last: 25 });
  });
});
