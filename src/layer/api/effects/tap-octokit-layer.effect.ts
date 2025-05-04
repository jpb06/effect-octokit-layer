import type { Context } from 'effect';
import { Effect, pipe } from 'effect';

import type { Octokit } from '../../octokit.context.js';

export const tapLayer = <A, E>(
  context: Context.Tag<Octokit, Octokit>,
  effect: (layer: Octokit) => Effect.Effect<A, E>,
) => pipe(context, Effect.flatMap(effect));
