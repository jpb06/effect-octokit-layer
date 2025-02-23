import { retryWarningMessage } from '@constants';

import { ApiRateLimitError, GithubApiError } from './index.js';

interface WithMaybeRetryAfter {
  response?: { headers?: { 'retry-after'?: number } };
}

export const handleOctokitRequestError = (e: unknown) => {
  const retryAfter = (e as WithMaybeRetryAfter)?.response?.headers?.[
    'retry-after'
  ];
  if (retryAfter) {
    console.warn(retryWarningMessage(e, retryAfter));

    return new ApiRateLimitError({
      retryAfter,
    });
  }

  return new GithubApiError({ cause: e });
};
