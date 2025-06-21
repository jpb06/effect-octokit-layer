import { Octokit } from '@octokit/core';
import type { RequestInterface } from '@octokit/types';
import { vi } from 'vitest';

export const octokitMock = {
  requestOnce: (data: unknown) => {
    const requestMock = vi.fn();

    vi.mocked(Octokit).mockImplementationOnce(
      () =>
        ({
          request: requestMock.mockResolvedValueOnce(
            data,
          ) as unknown as RequestInterface<object>,
        }) as Octokit,
    );

    return requestMock;
  },
  request: (data: unknown) => {
    const requestMock = vi.fn();

    vi.mocked(Octokit).mockImplementation(
      () =>
        ({
          request: requestMock.mockResolvedValueOnce(
            data,
          ) as unknown as RequestInterface<object>,
        }) as Octokit,
    );

    return requestMock;
  },
  // biome-ignore lint/suspicious/noExplicitAny: /
  requestFail: (error: any) => {
    const requestMock = vi.fn();

    vi.mocked(Octokit).mockImplementation(
      () =>
        ({
          request: requestMock.mockRejectedValue(
            error,
          ) as unknown as RequestInterface<object>,
        }) as Octokit,
    );

    return requestMock;
  },
  // biome-ignore lint/suspicious/noExplicitAny: /
  requestSucceedAndFail: (error: any, data: unknown) => {
    const requestMock = vi.fn();

    vi.mocked(Octokit).mockImplementation(
      () =>
        ({
          request: requestMock
            .mockResolvedValueOnce(data)
            .mockRejectedValueOnce(
              error,
            ) as unknown as RequestInterface<object>,
        }) as Octokit,
    );

    return requestMock;
  },
  // biome-ignore lint/suspicious/noExplicitAny: /
  requestFailAndThenSucceed: (error: any, data: unknown) => {
    const requestMock = vi.fn();

    vi.mocked(Octokit).mockImplementation(
      () =>
        ({
          request: requestMock
            .mockRejectedValueOnce(error)
            .mockResolvedValueOnce(data) as unknown as RequestInterface<object>,
        }) as Octokit,
    );

    return requestMock;
  },
};
