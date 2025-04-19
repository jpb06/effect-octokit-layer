import { Effect } from 'effect';
import { vi } from 'vitest';

type ConsoleTestLayerInput = {
  warn?: Effect.Effect<void>;
};

export const makeConsoleTestLayer = (
  { warn }: ConsoleTestLayerInput = { warn: Effect.void },
) => {
  const warnMock = vi.fn().mockReturnValue(warn);

  return {
    ConsoleTestLayer: Effect.withConsole({
      warn: warnMock,
    } as never),
    warnMock,
  };
};
