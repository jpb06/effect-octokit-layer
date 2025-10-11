import { Effect, pipe } from 'effect';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GithubApiError } from '@errors';
import { mockData, octokitRequestResponseHeaders } from '@tests/mock-data';
import { octokitMock } from '@tests/mocks';

import type { GetUserRepositoriesArgs } from './get-user-repos.js';

vi.mock('@octokit/core');

describe('getUserRepositories effect', () => {
  const args: GetUserRepositoriesArgs = {
    username: 'yolo',
    type: 'all',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('GITHUB_TOKEN', 'GITHUB_TOKEN_VALUE');
  });

  it('should return user repos', async () => {
    const count = 25;
    const mock = octokitMock.request({
      data: mockData,
      ...octokitRequestResponseHeaders(count),
    });

    const { getUserRepositories } = await import('./get-user-repos.js');

    const task = getUserRepositories(args);
    const result = await Effect.runPromise(task);

    expect(result).toStrictEqual(Array(count).fill(mockData).flat());
    expect(mock).toHaveBeenCalledTimes(count);
  });

  it('should return org repos', async () => {
    const count = 25;
    const mock = octokitMock.request({
      data: mockData,
      ...octokitRequestResponseHeaders(count),
    });

    const { getUserRepositories } = await import('./get-user-repos.js');

    const task = getUserRepositories(args);
    const result = await Effect.runPromise(task);

    expect(result).toStrictEqual(Array(count).fill(mockData).flat());
    expect(mock).toHaveBeenCalledTimes(count);
  });

  it('should only do one request', async () => {
    const mock = octokitMock.request({
      data: mockData,
      headers: {},
    });

    const { getUserRepositories } = await import('./get-user-repos.js');

    const task = getUserRepositories(args);
    const result = await Effect.runPromise(task);

    expect(result).toStrictEqual(mockData);
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it('should fail when one request fails', async () => {
    octokitMock.requestSucceedAndFail(new GithubApiError({ cause: 'oh no' }), {
      data: mockData,
      ...octokitRequestResponseHeaders(3),
    });

    const { getUserRepositories } = await import('./get-user-repos.js');

    const task = pipe(getUserRepositories(args), Effect.flip);
    const result = await Effect.runPromise(task);

    expect(result).toBeInstanceOf(GithubApiError);
  });
});
