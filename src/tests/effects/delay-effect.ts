import {
  type Duration,
  Effect,
  Fiber,
  TestClock,
  TestContext,
  pipe,
} from 'effect';

export const delayEffect = <R, E>(
  effect: Effect.Effect<R, E>,
  duration: Duration.Duration,
) =>
  pipe(
    effect,
    Effect.fork,
    Effect.flatMap((f) =>
      pipe(
        TestClock.adjust(duration),
        Effect.flatMap(() => Fiber.join(f)),
      ),
    ),
    Effect.provide(TestContext.TestContext),
  );

export const delayEffectAndFlip = <R, E>(
  effect: Effect.Effect<R, E>,
  duration: Duration.Duration,
) => delayEffect(effect, duration).pipe(Effect.flip);
