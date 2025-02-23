export const octokitRequestErrorWithRetryAfter = (delay: number) => ({
  request: {
    url: 'https://api.github.com/user',
  },
  response: {
    headers: {
      'retry-after': `${delay}`,
    },
  },
});
