import { Effect, pipe } from 'effect';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GithubApiError } from '@errors';
import { mockData, octokitRequestResponseHeaders } from '@tests/mock-data';
import { octokitMock } from '@tests/mocks';

import type { GetRepoIssuesArgs } from './get-repo-issues.js';

vi.mock('@octokit/core');

describe('getRepoIssues effect', () => {
  const args: GetRepoIssuesArgs = {
    owner: 'cool',
    repo: 'yolo',
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

    const { getRepoIssues } = await import('./get-repo-issues.js');

    const task = getRepoIssues(args);
    const result = await Effect.runPromise(task);

    expect(result).toStrictEqual(Array(count).fill(mockData).flat());
    expect(mock).toHaveBeenCalledTimes(count);
  });

  it('should only do one request', async () => {
    const mock = await octokitMock.request({
      data: mockData,
      headers: {},
    });

    const { getRepoIssues } = await import('./get-repo-issues.js');

    const task = getRepoIssues(args);
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

    const { getRepoIssues } = await import('./get-repo-issues.js');

    const task = pipe(getRepoIssues(args), Effect.flip);
    const result = await Effect.runPromise(task);

    expect(result).toBeInstanceOf(GithubApiError);
  });
});
