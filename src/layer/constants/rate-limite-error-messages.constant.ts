import pico from 'picocolors';

export interface WithRequestUrl {
  request: { url: string };
}

export const retryWarningMessage = (
  requestUrl: string,
  retryAfterInSeconds: string | number,
) =>
  `${pico.yellowBright('⚠️  Rate limit error on')} '${pico.underline(requestUrl)}'\n⏳ ${pico.greenBright(`retrying in ${+retryAfterInSeconds + 5} seconds.`)}`;

export const rateLimitExceededWarningMessage = (
  resource: string,
  value: string,
) =>
  pico.gray(
    `💥 Rate limit value of '${value}' exceeded for resource '${resource}'.`,
  );

export const rateLimitErrorMessage = (requestUrl: string) =>
  pico.yellowBright(`🚨 Rate limit error on '${requestUrl}'.`);
