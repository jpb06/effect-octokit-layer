import type { Effect } from 'effect';

export type EffectResultRequirement<
  // biome-ignore lint/suspicious/noExplicitAny: /
  T extends (...args: any) => Effect.Effect<unknown, unknown, unknown>,
> = Effect.Effect.Context<ReturnType<T>>;

export type EffectResultSuccess<
  // biome-ignore lint/suspicious/noExplicitAny: /
  T extends (...args: any) => Effect.Effect<unknown, unknown, unknown>,
> = Effect.Effect.Success<ReturnType<T>>;

export type EffectResultError<
  // biome-ignore lint/suspicious/noExplicitAny: /
  T extends (...args: any) => Effect.Effect<unknown, unknown, unknown>,
> = Effect.Effect.Error<ReturnType<T>>;

export type EffectResultWithoutRequirement<
  // biome-ignore lint/suspicious/noExplicitAny: /
  T extends (...args: any) => Effect.Effect<unknown, unknown, unknown>,
> = Effect.Effect<EffectResultSuccess<T>, EffectResultError<T>, never>;
