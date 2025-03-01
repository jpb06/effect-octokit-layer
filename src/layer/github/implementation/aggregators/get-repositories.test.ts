import { Effect, pipe } from 'effect';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GithubApiError } from '@errors';
import { makeLoggerTestLayer } from '@tests/layers';
import { mockData, octokitRequestResponseHeaders } from '@tests/mock-data';
import { octokitMock } from '@tests/mocks';

import type { GetRepositoriesArgs } from './get-repositories.js';

vi.mock('@octokit/core');

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
    const { LoggerTestLayer } = makeLoggerTestLayer({});

    const { getRepositories } = await import('./get-repositories.js');

    const task = pipe(getRepositories(args), Effect.provide(LoggerTestLayer));
    const result = await Effect.runPromise(task);

    expect(result).toStrictEqual(Array(count).fill(mockData).flat());
    expect(mock).toHaveBeenCalledTimes(count);
  });

  it('should retun org repos', async () => {
    const count = 25;
    const mock = await octokitMock.request({
      data: mockData,
      ...octokitRequestResponseHeaders(count),
    });
    const { LoggerTestLayer } = makeLoggerTestLayer({});

    const { getRepositories } = await import('./get-repositories.js');

    const task = pipe(
      getRepositories({ ...args, type: 'org' }),
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

    const { getRepositories } = await import('./get-repositories.js');

    const task = pipe(getRepositories(args), Effect.provide(LoggerTestLayer));
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

    const { getRepositories } = await import('./get-repositories.js');

    const task = pipe(
      getRepositories(args),
      Effect.flip,
      Effect.provide(LoggerTestLayer),
    );
    const result = await Effect.runPromise(task);

    expect(result).toBeInstanceOf(GithubApiError);
  });
});
