import { Effect, pipe } from 'effect';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GithubApiError } from '@errors';
import { mockData, octokitRequestResponseHeaders } from '@tests/mock-data';
import { mockConsole, octokitMock } from '@tests/mocks';

import type { GetRepositoriesArgs } from './get-repositories.js';

vi.mock('@octokit/core');
mockConsole({
  warn: vi.fn(),
});

describe('getRepositories effect', () => {
  const args: GetRepositoriesArgs = {
    target: 'yolo',
    type: 'user',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('GITHUB_TOKEN', 'GITHUB_TOKEN_VALUE');
  });

  it('should retun user repos', async () => {
    const count = 25;
    const mock = await octokitMock.request({
      data: mockData,
      ...octokitRequestResponseHeaders(count),
    });

    const { getRepositories } = await import('./get-repositories.js');

    const result = await Effect.runPromise(getRepositories(args));

    expect(result).toStrictEqual(Array(count).fill(mockData).flat());
    expect(mock).toHaveBeenCalledTimes(count);
  });

  it('should retun org repos', async () => {
    const count = 25;
    const mock = await octokitMock.request({
      data: mockData,
      ...octokitRequestResponseHeaders(count),
    });

    const { getRepositories } = await import('./get-repositories.js');

    const result = await Effect.runPromise(
      getRepositories({ ...args, type: 'org' }),
    );

    expect(result).toStrictEqual(Array(count).fill(mockData).flat());
    expect(mock).toHaveBeenCalledTimes(count);
  });

  it('should only do one request', async () => {
    const mock = await octokitMock.request({
      data: mockData,
      headers: {},
    });

    const { getRepositories } = await import('./get-repositories.js');

    const result = await Effect.runPromise(getRepositories(args));

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

    const { getRepositories } = await import('./get-repositories.js');

    const result = await Effect.runPromise(
      pipe(getRepositories(args), Effect.flip),
    );

    expect(result).toBeInstanceOf(GithubApiError);
  });
});
