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

import type { GetPullRequestReviewsPageArgs } from './get-pull-request-reviews-page.js';

vi.mock('@octokit/core');

describe('getPullRequestReviewsPage effect', () => {
  const args: GetPullRequestReviewsPageArgs = {
    owner: 'cool',
    repo: 'cool',
    pullNumber: 1,
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

    const { getPullRequestReviewsPage } = await import(
      './get-pull-request-reviews-page.js'
    );

    const task = getPullRequestReviewsPage(args);
    const result = await Effect.runPromise(task);

    expect(result.data).toStrictEqual(mockData);
    expect(result.links).toStrictEqual({ next: 2, last: 25 });
  });

  it('should fail with an Octokit request error', async () => {
    await octokitMock.requestFail(new GithubApiError({ cause: 'Oh no' }));

    const { getPullRequestReviewsPage } = await import(
      './get-pull-request-reviews-page.js'
    );

    const task = pipe(getPullRequestReviewsPage(args), Effect.flip);
    const result = await Effect.runPromise(task);

    expect(result).toBeInstanceOf(GithubApiError);
  });

  it('should fail if an api rate limit error', async () => {
    const retryDelay = 20;
    const error = octokitRequestErrorWithRetryAfter(retryDelay);
    await octokitMock.requestFail(error);
    const { warnMock, ConsoleTestLayer } = makeConsoleTestLayer();

    const { getPullRequestReviewsPage } = await import(
      './get-pull-request-reviews-page.js'
    );

    const task = pipe(getPullRequestReviewsPage(args), ConsoleTestLayer);
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
    await octokitMock.requestFailAndThenSucceed(error, {
      data: mockData,
      ...octokitRequestResponseHeaders(25),
    });
    const { warnMock, ConsoleTestLayer } = makeConsoleTestLayer();

    const { getPullRequestReviewsPage } = await import(
      './get-pull-request-reviews-page.js'
    );

    const task = pipe(getPullRequestReviewsPage(args), ConsoleTestLayer);
    const effect = delayEffect(task, Duration.seconds(40));
    const result = await Effect.runPromise(effect);

    expect(warnMock).toHaveBeenCalledTimes(1);
    expect(result.data).toStrictEqual(mockData);
    expect(result.links).toStrictEqual({ next: 2, last: 25 });
  });
});
