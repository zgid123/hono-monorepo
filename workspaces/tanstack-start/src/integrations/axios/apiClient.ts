import { AxiosClient } from '@alphacifer/axios';

export interface ICreateApiClientParams {
  readonly cookie?: string;
  readonly baseUrl?: string;
}

export function createApiClient({
  cookie,
  baseUrl,
}: ICreateApiClientParams = {}): AxiosClient {
  return AxiosClient.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: cookie
      ? {
          cookie,
        }
      : undefined,
  });
}
