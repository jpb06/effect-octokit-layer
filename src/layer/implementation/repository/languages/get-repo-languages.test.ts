import { Effect, pipe } from 'effect';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GithubApiError } from '@errors';
import { mockData } from '@tests/mock-data';
import { octokitMock } from '@tests/mocks';

import type { GetRepoLanguagesArgs } from './get-repo-languages.js';

vi.mock('@octokit/core');

describe('getRepoLanguages effect', () => {
  const args: GetRepoLanguagesArgs = {
    owner: 'cool',
    repo: 'yolo',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('GITHUB_TOKEN', 'GITHUB_TOKEN_VALUE');
  });

  it('should return data', async () => {
    const mock = octokitMock.request({
      data: mockData,
      headers: {},
    });

    const { getRepoLanguages } = await import('./get-repo-languages.js');

    const task = getRepoLanguages(args);
    const result = await Effect.runPromise(task);

    expect(result).toStrictEqual(mockData);
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it('should fail when request fails', async () => {
    octokitMock.requestFail(new GithubApiError({ cause: 'Oh no' }));

    const { getRepoLanguages } = await import('./get-repo-languages.js');

    const task = pipe(getRepoLanguages(args), Effect.flip);
    const result = await Effect.runPromise(task);

    expect(result).toBeInstanceOf(GithubApiError);
  });
});
