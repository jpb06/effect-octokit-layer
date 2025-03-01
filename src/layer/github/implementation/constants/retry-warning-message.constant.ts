import pico from 'picocolors';

export interface WithRequestUrl {
  request: { url: string };
}

export const retryWarningMessage = (
  requestUrl: string,
  retryAfter: string | number,
) =>
  pico.yellowBright(
    `⚠️ Rate limit error on '${requestUrl}' ⏳ retrying in ${retryAfter} seconds.`,
  );
