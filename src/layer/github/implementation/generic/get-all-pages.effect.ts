import { Effect } from 'effect';

import { defaultConcurrency } from '@constants';
import { arrayRange } from '@util';

import type { Link } from './get-one-page/logic/index.js';

interface DataWithLinks<TData> {
  links: Link | undefined;
  data: TData;
}

type GetPage<TArgs, TData, TError> = (
  args: TArgs,
) => (page: number) => Effect.Effect<DataWithLinks<TData>, TError, never>;

export const getAllPages = <
  TError,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  TArgs extends { concurrency?: number } & Record<string, any>,
  TDataItem,
  TData extends TDataItem[],
>(
  getPage: GetPage<TArgs, TData, TError>,
  args: TArgs,
) =>
  Effect.withSpan('get-all-pages', {
    attributes: { ...args },
  })(
    Effect.gen(function* (_) {
      const firstPage = yield* _(getPage(args)(1));
      if (firstPage.links?.last === undefined) {
        return firstPage.data;
      }

      const pagesResults = yield* _(
        Effect.all(arrayRange(2, firstPage.links.last).map(getPage(args)), {
          concurrency: args.concurrency ?? defaultConcurrency,
        }),
      );

      return [
        ...firstPage.data,
        ...pagesResults.flatMap((r) => r.data),
      ] as TData;
    }),
  );
