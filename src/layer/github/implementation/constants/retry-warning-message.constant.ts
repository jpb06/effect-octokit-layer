import pico from 'picocolors';

export interface WithRequestUrl {
  request: { url: string };
}

export const retryWarningMessage = (e: unknown, retryAfter: number) =>
  pico.yellowBright(
    `⚠️ Rate limit error on '${(e as WithRequestUrl).request.url.replace(
      'https://api.github.com',
      '',
    )}' ⏳ retrying in ${retryAfter} seconds.`,
  );
