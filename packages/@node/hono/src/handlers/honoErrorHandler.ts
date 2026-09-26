import { HonoError, onError } from '@alphacifer/hono/core';
import { ApplicationError } from '@domain/core';
import type { Context, ErrorHandler } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

interface IHandleApplicationErrorParams {
  readonly error: ApplicationError;
  readonly context: Context;
}

function handleApplicationError({
  error,
  context,
}: IHandleApplicationErrorParams): Response {
  return onError(
    new HonoError({
      cause: error,
      name: error.name,
      code: error.code,
      message: error.message,
      status: error.httpCode as ContentfulStatusCode,
    }),
    context,
  );
}

export const honoErrorHandler: ErrorHandler = (error, context) => {
  if (!(error instanceof ApplicationError)) {
    return onError(error, context);
  }

  return handleApplicationError({
    error,
    context,
  });
};
