interface ResponseWithLinkHeaders {
  headers: {
    link?: string;
  };
}

type LinkKey = 'prev' | 'next' | 'last';

export const parseLink = (response: ResponseWithLinkHeaders) =>
  response.headers.link?.split(',').reduce(
    (acc, link) => {
      const [url, type] = link.split('; ');
      const params = new URLSearchParams(url.slice(1, -1));
      const page = params.get('page');

      return {
        ...acc,
        [type.match(/^rel="(.*)"$/)?.[1] as LinkKey]: page ? +page : undefined,
      };
    },
    {} as Record<LinkKey, number | undefined>,
  );
