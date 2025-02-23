import { Effect, pipe } from 'effect';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GithubApiError } from '@errors';
import { mockData, octokitRequestResponseHeaders } from '@tests/mock-data';
import { mockConsole, octokitMock } from '@tests/mocks';

import type { GetPullRequestReviewsArgs } from './get-pull-request-reviews.js';

vi.mock('@octokit/core');
mockConsole({
  warn: vi.fn(),
});

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

    const { getPullRequestReviews } = await import(
      './get-pull-request-reviews.js'
    );

    const result = await Effect.runPromise(getPullRequestReviews(args));

    expect(result).toStrictEqual(Array(count).fill(mockData).flat());
    expect(mock).toHaveBeenCalledTimes(count);
  });

  it('should only do one request', async () => {
    const mock = await octokitMock.request({
      data: mockData,
      headers: {},
    });

    const { getPullRequestReviews } = await import(
      './get-pull-request-reviews.js'
    );

    const result = await Effect.runPromise(getPullRequestReviews(args));

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

    const { getPullRequestReviews } = await import(
      './get-pull-request-reviews.js'
    );

    const result = await Effect.runPromise(
      pipe(getPullRequestReviews(args), Effect.flip),
    );

    expect(result).toBeInstanceOf(GithubApiError);
  });
});
