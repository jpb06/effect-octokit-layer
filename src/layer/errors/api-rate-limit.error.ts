import { TaggedError } from 'effect/Data';

export class ApiRateLimitError extends TaggedError('ApiRateLimitError')<{
  retryAfterInSeconds: string | number;
}> {}

export const isApiRateLimitError = (e: unknown): e is ApiRateLimitError =>
  typeof e === 'object' &&
  e !== null &&
  '_tag' in e &&
  e._tag === 'ApiRateLimitError';
