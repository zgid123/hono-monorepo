import { AxiosClient } from '@alphacifer/axios';

export interface ICreateApiClientParams {
  cookie?: string;
}

export function createApiClient({
  cookie,
}: ICreateApiClientParams = {}): AxiosClient {
  const baseURL = import.meta.env.VITE_API;

  if (!baseURL) {
    throw new Error('VITE_API must point to the server API');
  }

  return AxiosClient.create({
    baseURL,
    withCredentials: true,
    headers: cookie
      ? {
          cookie,
        }
      : undefined,
  });
}

export const apiClient = createApiClient();
