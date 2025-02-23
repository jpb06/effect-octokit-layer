export const octokitRequestResponseHeaders = (pagesCount: number) => ({
  headers: {
    link: `<https://api.github.com/repositories/10270250/pulls?state=all&per_page=100&concurrency=1000&page=2>; rel="next", <https://api.github.com/repositories/10270250/pulls?state=all&per_page=100&concurrency=1000&page=${pagesCount}>; rel="last"`,
  },
});
