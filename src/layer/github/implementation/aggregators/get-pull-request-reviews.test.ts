import { Effect, pipe } from 'effect';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GithubApiError } from '@errors';
import { makeLoggerTestLayer } from '@tests/layers';
import { mockData, octokitRequestResponseHeaders } from '@tests/mock-data';
import { octokitMock } from '@tests/mocks';

import type { GetPullRequestReviewsArgs } from './get-pull-request-reviews.js';

vi.mock('@octokit/core');

describe('getPullRequestReviews effect', () => {
  const args: GetPullRequestReviewsArgs = {
    owner: 'cool',
    repo: 'yolo',
    pullNumber: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('GITHUB_TOKEN', 'GITHUB_TOKEN_VALUE');
  });

  it('should retun multiple pages data', async () => {
    const count = 25;
    const mock = await octokitMock.request({
      data: mockData,
      ...octokitRequestResponseHeaders(count),
    });
    const { LoggerTestLayer } = makeLoggerTestLayer({});

    const { getPullRequestReviews } = await import(
      './get-pull-request-reviews.js'
    );

    const task = pipe(
      getPullRequestReviews(args),
      Effect.provide(LoggerTestLayer),
    );
    const result = await Effect.runPromise(task);

    expect(result).toStrictEqual(Array(count).fill(mockData).flat());
    expect(mock).toHaveBeenCalledTimes(count);
  });

  it('should only do one request', async () => {
    const mock = await octokitMock.request({
      data: mockData,
      headers: {},
    });
    const { LoggerTestLayer } = makeLoggerTestLayer({});

    const { getPullRequestReviews } = await import(
      './get-pull-request-reviews.js'
    );

    const task = pipe(
      getPullRequestReviews(args),
      Effect.provide(LoggerTestLayer),
    );
    const result = await Effect.runPromise(task);

    expect(result).toStrictEqual(mockData);
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it('should fail when one request fails', async () => {
    await octokitMock.requestSucceedAndFail(
      new GithubApiError({ cause: 'oh no' }),
      {
        data: mockData,
        ...octokitRequestResponseHeaders(3),
      },
    );
    const { LoggerTestLayer } = makeLoggerTestLayer({});

    const { getPullRequestReviews } = await import(
      './get-pull-request-reviews.js'
    );

    const task = pipe(
      getPullRequestReviews(args),
      Effect.flip,
      Effect.provide(LoggerTestLayer),
    );
    const result = await Effect.runPromise(task);

    expect(result).toBeInstanceOf(GithubApiError);
  });
});
