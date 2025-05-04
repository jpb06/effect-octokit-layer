import { Effect } from 'effect';

import { defaultConcurrency } from '@constants';
import { arrayRange } from '@util';

import type { Link } from './../get-one-page/logic/index.js';

interface DataWithLinks<TDataItem> {
  links: Link | undefined;
  data: {
    total_count: number;
    incomplete_results: boolean;
    items: TDataItem[];
  };
}

type GetPage<TArgs, TDataItem, TError> = (
  args: TArgs,
) => (page: number) => Effect.Effect<DataWithLinks<TDataItem>, TError, never>;

export const getAllSearchPages = <
  TError,
  // biome-ignore lint/suspicious/noExplicitAny: /
  TArgs extends { concurrency?: number } & Record<string, any>,
  TDataItem,
>(
  getPage: GetPage<TArgs, TDataItem, TError>,
  args: TArgs,
) =>
  Effect.withSpan('get-all-pages', {
    attributes: { ...args },
  })(
    Effect.gen(function* (_) {
      const firstPage = yield* _(getPage(args)(1));
      if (firstPage.links?.last === undefined) {
        return {
          count: firstPage.data.total_count,
          data: firstPage.data.items,
        };
      }

      const pagesResults = yield* _(
        Effect.all(arrayRange(2, firstPage.links.last).map(getPage(args)), {
          concurrency: args.concurrency ?? defaultConcurrency,
        }),
      );

      return {
        count: firstPage.data.total_count,
        data: [
          ...firstPage.data.items,
          ...pagesResults.flatMap((r) => r.data.items),
        ],
      };
    }),
  );
