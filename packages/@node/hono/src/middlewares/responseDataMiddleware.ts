import { createMiddleware } from 'hono/factory';

export const responseDataMiddleware = createMiddleware(
  async (context, next) => {
    await next();

    const response = context.res;
    const contentType = response.headers
      .get('content-type')
      ?.split(';')[0]
      ?.trim()
      .toLowerCase();

    if (
      !response.ok ||
      !response.body ||
      (contentType !== 'application/json' && !contentType?.endsWith('+json'))
    ) {
      return;
    }

    const data: unknown = await response.clone().json();

    const headers = new Headers(response.headers);
    headers.delete('content-length');

    context.res = new Response(
      JSON.stringify({
        data,
      }),
      {
        headers,
        status: response.status,
        statusText: response.statusText,
      },
    );
    context.header('content-length', undefined);
  },
);
