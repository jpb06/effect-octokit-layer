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

import type { PullRequestCommentDeletionArgs } from './delete-pull-request-comment.js';

vi.mock('@octokit/core');

describe('deletePullRequestComment effect', () => {
  const args: PullRequestCommentDeletionArgs = {
    owner: 'cool',
    repo: 'cool',
    commentId: 1,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('GITHUB_TOKEN', 'GITHUB_TOKEN_VALUE');
  });

  it('should create a comment', async () => {
    octokitMock.requestOnce({
      data: mockData,
    });

    const { deletePullRequestComment } = await import(
      './delete-pull-request-comment.js'
    );

    const task = deletePullRequestComment(args);
    const result = await Effect.runPromise(task);

    expect(result).toStrictEqual(mockData);
  });

  it('should fail with an Octokit request error', async () => {
    octokitMock.requestFail(new GithubApiError({ cause: 'Oh no' }));

    const { deletePullRequestComment } = await import(
      './delete-pull-request-comment.js'
    );

    const task = pipe(deletePullRequestComment(args), Effect.flip);
    const result = await Effect.runPromise(task);

    expect(result).toBeInstanceOf(GithubApiError);
  });

  it('should fail with an api rate limit error', async () => {
    const retryDelay = 20;
    const error = octokitRequestErrorWithRetryAfter(retryDelay);

    await octokitMock.requestFail(error);

    const { warnMock, ConsoleTestLayer } = makeConsoleTestLayer();

    const { deletePullRequestComment } = await import(
      './delete-pull-request-comment.js'
    );

    const task = pipe(deletePullRequestComment(args), ConsoleTestLayer);
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

    const { deletePullRequestComment } = await import(
      './delete-pull-request-comment.js'
    );

    const task = pipe(deletePullRequestComment(args), ConsoleTestLayer);
    const effect = delayEffect(task, Duration.seconds(40));
    const result = await Effect.runPromise(effect);

    expect(warnMock).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(mockData);
  });
});
