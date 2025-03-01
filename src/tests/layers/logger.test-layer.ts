import { type Effect, Layer } from 'effect';
import { vi } from 'vitest';

import { Logger, type LoggerLayer } from '@dependencies/logger';

type LoggerTestLayerInput = {
  warn?: Effect.Effect<void>;
};

export const makeLoggerTestLayer = ({ warn }: LoggerTestLayerInput) => {
  const warnMock = vi.fn().mockReturnValue(warn);

  const make: Partial<LoggerLayer> = {
    warn: warnMock,
  };

  return {
    LoggerTestLayer: Layer.succeed(Logger, Logger.of(make as never)),
    warnMock,
  };
};
