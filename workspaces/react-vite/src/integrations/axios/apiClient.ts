import { AxiosClient } from '@alphacifer/axios';

export const apiClient = AxiosClient.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API,
});
