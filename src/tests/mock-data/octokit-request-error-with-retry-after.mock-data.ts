export const octokitRequestErrorWithRetryAfter = (delay: number) => ({
  name: 'github-error',
  status: 429,
  request: {
    url: 'https://api.github.com/user',
  },
  response: {
    headers: {
      'retry-after': `${delay}`,
      'x-ratelimit-reset': '',
      'x-ratelimit-resource': 'search',
      'x-ratelimit-limit': '30',
      'x-ratelimit-used': '30',
      'x-ratelimit-remaining': '0',
    },
  },
});
