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

import type { GetRepoPullRequestsPageArgs } from './get-repo-pull-requests-page.js';

vi.mock('@octokit/core');
mockConsole({
  warn: vi.fn(),
});

describe('getRepoPullRequestsPage effect', () => {
  const args: GetRepoPullRequestsPageArgs = {
    owner: 'cool',
    repo: 'cool',
    page: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('GITHUB_TOKEN', 'GITHUB_TOKEN_VALUE');
  });

  it('should retun data with links', async () => {
    await octokitMock.requestOnce({
      data: mockData,
      ...octokitRequestResponseHeaders(25),
    });

    const { getRepoPullRequestsPage } = await import(
      './get-repo-pull-requests-page.js'
    );

    const result = await Effect.runPromise(getRepoPullRequestsPage(args));

    expect(result.data).toStrictEqual(mockData);
    expect(result.links).toStrictEqual({ next: 2, last: 25 });
  });

  it('should fail with an Octokit request error', async () => {
    await octokitMock.requestFail(new GithubApiError({ cause: 'Oh no' }));

    const { getRepoPullRequestsPage } = await import(
      './get-repo-pull-requests-page.js'
    );

    const result = await Effect.runPromise(
      pipe(getRepoPullRequestsPage(args), Effect.flip),
    );

    expect(result).toBeInstanceOf(GithubApiError);
  });

  it('should fail if an api rate limit error', async () => {
    const retryDelay = 20;
    const error = octokitRequestErrorWithRetryAfter(retryDelay);
    await octokitMock.requestFail(error);

    const { getRepoPullRequestsPage } = await import(
      './get-repo-pull-requests-page.js'
    );

    const effect = delayEffectAndFlip(
      getRepoPullRequestsPage(args),
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

    const { getRepoPullRequestsPage } = await import(
      './get-repo-pull-requests-page.js'
    );

    const effect = delayEffect(
      getRepoPullRequestsPage(args),
      Duration.seconds(40),
    );
    const result = await Effect.runPromise(effect);

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(result.data).toStrictEqual(mockData);
    expect(result.links).toStrictEqual({ next: 2, last: 25 });
  });
});
