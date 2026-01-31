import { Octokit } from '@octokit/core';
import { vi } from 'vitest';

export const octokitMock = {
  requestOnce: (data: unknown) => {
    const requestMock = vi.fn();

    vi.mocked(Octokit).mockImplementationOnce(function mock() {
      return {
        request: requestMock.mockResolvedValueOnce(data),
      };
    });

    return requestMock;
  },
  request: (data: unknown) => {
    const requestMock = vi.fn();

    vi.mocked(Octokit).mockImplementation(function mock() {
      return {
        request: requestMock.mockResolvedValueOnce(data),
      };
    });

    return requestMock;
  },
  requestFail: (error: unknown) => {
    const requestMock = vi.fn();

    vi.mocked(Octokit).mockImplementation(function mock() {
      return {
        request: requestMock.mockRejectedValue(error),
      };
    });

    return requestMock;
  },
  requestSucceedAndFail: (error: unknown, data: unknown) => {
    const requestMock = vi.fn();

    vi.mocked(Octokit).mockImplementation(function mock() {
      return {
        request: requestMock
          .mockResolvedValueOnce(data)
          .mockRejectedValueOnce(error),
      };
    });

    return requestMock;
  },
  requestFailAndThenSucceed: (error: unknown, data: unknown) => {
    const requestMock = vi.fn();

    vi.mocked(Octokit).mockImplementation(function mock() {
      return {
        request: requestMock
          .mockRejectedValueOnce(error)
          .mockResolvedValueOnce(data),
      };
    });

    return requestMock;
  },
};
