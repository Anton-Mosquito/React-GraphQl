import axios from 'axios';
import { TOKEN_LOCALSTORAGE_KEY } from '@/shared/const/localStorage';
import type { AxiosResponse } from 'axios';
import type { AxiosRequestConfig } from 'axios';

import type { AuthResponse } from '@/shared/types/auth';

export const $api = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.API_URL,
});

$api.interceptors.request.use((config) => {
  if (config.headers) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return config;
});

$api.interceptors.response.use(
  (config: AxiosResponse) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.config && !error.config?._isRetry) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get<AuthResponse>(`${import.meta.env.API_URL}/refresh`, {
          withCredentials: true,
        });
        localStorage.setItem('token', response.data.accessToken);
        return $api.request(originalRequest);
      } catch (error) {
        console.log('Not authorized', error);
      }
    }
    throw error;
  },
);
