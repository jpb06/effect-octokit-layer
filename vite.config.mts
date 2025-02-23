import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// biome-ignore lint/style/noDefaultExport: vite config
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov', 'json-summary'],
      all: true,
      include: ['src/**/*.ts'],
      exclude: [
        'src/layer/octokit.context.ts',
        'src/layer/octokit.layer.ts',
        'src/layer/effects/tap-layer.effect.ts',
        'src/layer/github/octokit.layer-live.ts',
        'src/temp',
        'src/tests',
        'src/**/*.type.ts',
        'src/types',
        '**/index.ts',
      ],
    },
  },
});
