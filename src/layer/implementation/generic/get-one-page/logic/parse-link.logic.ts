interface ResponseWithLinkHeaders {
  headers: {
    link?: string;
  };
}

type LinkKey = 'prev' | 'next' | 'last';

export type Link = {
  prev?: number;
  next?: number;
  last?: number;
};

export const parseLink = (response: ResponseWithLinkHeaders) =>
  response.headers.link?.split(', ').reduce<Link>((result, link) => {
    const [url, type] = link.split('; ');
    const params = new URLSearchParams(url.slice(1, -1).split('?')[1]);

    const page = params.get('page');

    return {
      ...result,
      [type.match(/^rel="(.*)"$/)?.[1] as LinkKey]: page ? +page : undefined,
    };
  }, {});
