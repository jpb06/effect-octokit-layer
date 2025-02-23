import { Octokit } from '@octokit/core';
import { Config, Effect } from 'effect';

import { GithubApiError } from '@errors';

const unsetTokenValue = 'github-token-not-set';

const githubConfig = Config.withDefault(
  Config.string('GITHUB_TOKEN'),
  unsetTokenValue,
);

export const githubSourceAnalysisProvider = Effect.gen(function* () {
  const token = yield* githubConfig;
  if (token === unsetTokenValue) {
    return yield* Effect.fail(
      new GithubApiError({ message: 'GITHUB_TOKEN not set' }),
    );
  }

  return yield* Effect.try({
    try: () =>
      new Octokit({
        auth: token,
      }),
    catch: (e) => new GithubApiError({ cause: e }),
  });
});
