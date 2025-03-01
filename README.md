# effect-octokit-layer

[![Open in Visual Studio Code](https://img.shields.io/static/v1?logo=visualstudiocode&label=&message=Open%20in%20Visual%20Studio%20Code&labelColor=2c2c32&color=007acc&logoColor=007acc)](https://github.dev/jpb06/effect-octokit-layer)
![npm bundle size](https://img.shields.io/bundlephobia/min/effect-octokit-layer)
![Github workflow](https://img.shields.io/github/actions/workflow/status/jpb06/effect-octokit-layer/ci.yml?branch=main&logo=github-actions&label=last%20workflow)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-octokit-layer&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jpb06_effect-octokit-layer)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-octokit-layer&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=jpb06_effect-octokit-layer)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-octokit-layer&metric=security_rating)](https://sonarcloud.io/dashboard?id=jpb06_effect-octokit-layer)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-octokit-layer&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=jpb06_effect-octokit-layer)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-octokit-layer&metric=coverage)](https://sonarcloud.io/dashboard?id=jpb06_effect-octokit-layer)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-octokit-layer&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jpb06_effect-octokit-layer)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-octokit-layer&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jpb06_effect-octokit-layer)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-octokit-layer&metric=code_smells)](https://sonarcloud.io/dashboard?id=jpb06_effect-octokit-layer)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-octokit-layer&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jpb06_effect-octokit-layer)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-octokit-layer&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jpb06_effect-octokit-layer)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-octokit-layer&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=jpb06_effect-octokit-layer)
![Last commit](https://img.shields.io/github/last-commit/jpb06/effect-octokit-layer?logo=git)

An [Effect](https://effect.website/) layer to interact with Github Octokit api.

<!-- readme-package-icons start -->

<p align="left"><a href="https://docs.github.com/en/actions" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/GithubActions-Dark.svg" /></a>&nbsp;<a href="https://www.typescriptlang.org/docs/" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/TypeScript.svg" /></a>&nbsp;<a href="https://nodejs.org/en/docs/" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/NodeJS-Dark.svg" /></a>&nbsp;<a href="https://bun.sh/docs" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Bun-Dark.svg" /></a>&nbsp;<a href="https://biomejs.dev/guides/getting-started/" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Biome-Dark.svg" /></a>&nbsp;<a href="https://vitest.dev/guide/" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Vitest-Dark.svg" /></a>&nbsp;<a href="https://www.effect.website/docs/quickstart" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Effect-Dark.svg" /></a></p>

<!-- readme-package-icons end -->

## ⚡ Access to github api

You first need to [create a github token](https://github.com/settings/tokens) with a scope related to your needs.

```bash
GITHUB_TOKEN="my-github-token"
```

## ⚡ Layer Api

### 🔶 Layer functions Types

The layer exposes functions with the following type:

```ts
import type { ConfigError, Effect } from 'effect';

type LayerErrors = GithubApiError | ApiRateLimitError | ConfigError.ConfigError;
type LoggerLayer = {
  warn: (
    message?: unknown,
    ...optionalParams: unknown[]
  ) => Effect.Effect<void>;
};

type LayerFunction<TArgs, TResult> = (
  args: TArgs
) => Effect<TResult, LayerErrors, LoggerLayer>;
```

For example, getting user profile can be done with this function:

```ts
type GetUserProfile = (
  username: string
) => Effect<UserProfileResult, LayerErrors, Logger>;
```

### 🔶 Users

```typescript
import {
  OctokitLayer,
  OctokitLayerLive,
  LoggerConsoleLive,
} from 'effect-octokit-layer';

const username = 'jpb06';

const [profile, repos, orgs, events] = await Effect.runPromise(
  pipe(
    Effect.all(
      [
        // Get user profile
        OctokitLayer.user(username).profile(),
        // Get user repos
        OctokitLayer.user(username).repos(),
        // Get user organizations
        OctokitLayer.user(username).orgs(),
        // Get user events
        OctokitLayer.user(username).events(),
      ],
      // Fetch all these in parallel
      { concurrency: 'unbounded' }
    ),
    Effect.provide(Layer.mergeAll(OctokitLayerLive, LoggerConsoleLive))
  )
);
```

### 🔶 Organizations

```typescript
import {
  OctokitLayer,
  OctokitLayerLive,
  LoggerConsoleLive,
} from 'effect-octokit-layer';

const orgs = await Effect.runPromise(
  pipe(
    // Get organization repos
    OctokitLayer.org('my-org').repos(),
    Effect.provide(Layer.mergeAll(OctokitLayerLive, LoggerConsoleLive))
  )
);
```

### 🔶 Repositories

```typescript
import {
  RepoArgs,
  OctokitLayer,
  OctokitLayerLive,
  LoggerConsoleLive,
} from 'effect-octokit-layer';

const reactRepo: RepoArgs = {
  owner: 'facebook',
  name: 'react',
};

const [issues, pulls, issue34] = await Effect.runPromise(
  pipe(
    Effect.all(
      [
        // Get all issues
        OctokitLayer.repo(reactRepo).issues(),
        // Get all pull requests
        OctokitLayer.repo(reactRepo).pulls(),
        // Get issue #34
        OctokitLayer.repo(reactRepo).issue(34),
      ],
      // Fetch all these in parallel
      { concurrency: 'unbounded' }
    ),
    Effect.provide(Layer.mergeAll(OctokitLayerLive, LoggerConsoleLive))
  )
);
```

### 🔶 Pull requests

```typescript
import {
  RepoArgs,
  OctokitLayer,
  OctokitLayerLive,
  LoggerConsoleLive,
} from 'effect-octokit-layer';

const reactRepo: RepoArgs = {
  owner: 'facebook',
  name: 'react',
};
const pull = repo.pull(39);

const [details, reviews, comments] = await Effect.runPromise(
  pipe(
    Effect.all(
      [
        // Pull request details
        pull.details(),
        // Pull request #39 reviews
        pull.reviews(),
        // All the comments made on the pull request #39
        pull.comments(),
      ],
      { concurrency: 'unbounded' }
    ),
    Effect.provide(Layer.mergeAll(OctokitLayerLive, LoggerConsoleLive))
  )
);
```

### 🔶 Pull request reviews

```typescript
import {
  RepoArgs,
  OctokitLayer,
  OctokitLayerLive,
  LoggerConsoleLive,
} from 'effect-octokit-layer';

const reactRepo: RepoArgs = {
  owner: 'facebook',
  name: 'react',
};
const pull = repo.pull(39);
const review = pull.review(2593339077);

const comments = await Effect.runPromise(
  pipe(
    // Review #2593339077 comments
    review.comments(),
    Effect.provide(Layer.mergeAll(OctokitLayerLive, LoggerConsoleLive))
  )
);
```

### 🔶 Parallelism and resilience

#### 🧿 Concurrency

> Default: `10`

You can specify the `concurrency` parameter on calls doing several requests in parallel (paginated data). For example:

```typescript
// Will fetch the first page and then 100 pages concurrently
OctokitLayer.repo({
  owner: 'facebook',
  name: 'react',
}).pulls(100);
```

Note that github api enforces [api rate limits](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api?apiVersion=2022-11-28#dealing-with-secondary-rate-limits). Fetching too many results concurrently will cause an api rate limit. In that case, a warning will be displayed and the call will be attempted again after the time window provided by github api (typically 60 seconds).
