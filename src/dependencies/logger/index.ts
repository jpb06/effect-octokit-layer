import { Context, Effect, Layer, pipe } from 'effect';

export class Logger extends Context.Tag('Logger')<
  Logger,
  {
    readonly warn: (
      message?: unknown,
      ...optionalParams: unknown[]
    ) => Effect.Effect<void>;
  }
>() {}
export type LoggerLayer = (typeof Logger)['Service'];

export const LoggerConsoleLive = Layer.succeed(Logger, {
  warn: (message?: unknown, ...optionalParams: unknown[]) =>
    pipe(
      Effect.succeed(console.warn(message, ...optionalParams)),
      Effect.withSpan('logger-console/warn'),
    ),
});
