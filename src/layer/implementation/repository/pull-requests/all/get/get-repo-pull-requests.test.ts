import { Effect, pipe } from 'effect';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GithubApiError } from '@errors';
import { mockData, octokitRequestResponseHeaders } from '@tests/mock-data';
import { octokitMock } from '@tests/mocks';

import type { GetRepoPullRequestsArgs } from './get-repo-pull-requests.js';

vi.mock('@octokit/core');

describe('getRepoPullRequests effect', () => {
  const args: GetRepoPullRequestsArgs = {
    owner: 'cool',
    repo: 'yolo',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('GITHUB_TOKEN', 'GITHUB_TOKEN_VALUE');
  });

  it('should return multiple pages data', async () => {
    const count = 25;
    const mock = await octokitMock.request({
      data: mockData,
      ...octokitRequestResponseHeaders(count),
    });

    const { getRepoPullRequests } = await import('./get-repo-pull-requests.js');

    const task = getRepoPullRequests(args);
    const result = await Effect.runPromise(task);

    expect(result).toStrictEqual(Array(count).fill(mockData).flat());
    expect(mock).toHaveBeenCalledTimes(count);
  });

  it('should only do one request', async () => {
    const mock = await octokitMock.request({
      data: mockData,
      headers: {},
    });

    const { getRepoPullRequests } = await import('./get-repo-pull-requests.js');

    const task = getRepoPullRequests(args);
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

    const { getRepoPullRequests } = await import('./get-repo-pull-requests.js');

    const task = pipe(getRepoPullRequests(args), Effect.flip);
    const result = await Effect.runPromise(task);

    expect(result).toBeInstanceOf(GithubApiError);
  });
});
