import { TaggedError } from 'effect/Data';

export class GithubApiError extends TaggedError('GithubApiError')<{
  cause?: unknown;
  message?: string;
}> {}
