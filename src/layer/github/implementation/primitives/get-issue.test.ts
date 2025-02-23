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

import type { GetIssueArgs } from './get-issue.js';

vi.mock('@octokit/core');
mockConsole({
  warn: vi.fn(),
});

describe('getIssue effect', () => {
  const args: GetIssueArgs = {
    owner: 'cool',
    repo: 'cool',
    number: 1,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('GITHUB_TOKEN', 'GITHUB_TOKEN_VALUE');
  });

  it('should retun data with links', async () => {
    octokitMock.requestOnce({
      data: mockData,
    });

    const { getIssue } = await import('./get-issue.js');

    const result = await Effect.runPromise(getIssue(args));

    expect(result).toStrictEqual(mockData);
  });

  it('should fail with an Octokit request error', async () => {
    octokitMock.requestFail(new GithubApiError({ cause: 'Oh no' }));

    const { getIssue } = await import('./get-issue.js');

    const result = await Effect.runPromise(pipe(getIssue(args), Effect.flip));

    expect(result).toBeInstanceOf(GithubApiError);
  });

  it('should fail if an api rate limit error', async () => {
    const retryDelay = 20;
    const error = octokitRequestErrorWithRetryAfter(retryDelay);
    await octokitMock.requestFail(error);

    const { getIssue } = await import('./get-issue.js');

    const effect = delayEffectAndFlip(getIssue(args), Duration.seconds(40));
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

    const { getIssue } = await import('./get-issue.js');

    const effect = delayEffect(getIssue(args), Duration.seconds(40));
    const result = await Effect.runPromise(effect);

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(mockData);
  });
});
