import { Effect, pipe } from 'effect';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GithubApiError } from '@errors';
import {
  mockData,
  octokitRequestResponseHeaders,
  searchResultmockData,
} from '@tests/mock-data';
import { octokitMock } from '@tests/mocks';

import type { SearchUserIssuesArgs } from './search-user-issues.js';

vi.mock('@octokit/core');

describe('searchUserIssues effect', () => {
  const args: SearchUserIssuesArgs = {
    username: 'cool',
    query: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('GITHUB_TOKEN', 'GITHUB_TOKEN_VALUE');
  });

  it('should return multiple pages data', async () => {
    const count = 25;
    const mock = await octokitMock.request({
      data: { ...searchResultmockData, total_count: count },
      ...octokitRequestResponseHeaders(count),
    });

    const { searchUserIssues } = await import('./search-user-issues.js');

    const task = searchUserIssues(args);
    const result = await Effect.runPromise(task);

    expect(result.count).toBe(count);
    expect(result.data).toStrictEqual(Array(count).fill(mockData).flat());
    expect(mock).toHaveBeenCalledTimes(count);
  });

  it('should only do one request', async () => {
    const mock = await octokitMock.request({
      data: searchResultmockData,
      headers: {},
    });

    const { searchUserIssues } = await import('./search-user-issues.js');

    const task = searchUserIssues(args);
    const result = await Effect.runPromise(task);

    expect(result).toStrictEqual({
      count: searchResultmockData.total_count,
      data: searchResultmockData.items,
    });
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

    const { searchUserIssues } = await import('./search-user-issues.js');

    const task = pipe(searchUserIssues(args), Effect.flip);
    const result = await Effect.runPromise(task);

    expect(result).toBeInstanceOf(GithubApiError);
  });
});
