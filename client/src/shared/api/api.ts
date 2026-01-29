import axios from 'axios';
import type { AxiosResponse } from 'axios';

import { TOKEN_LOCALSTORAGE_KEY } from '@/shared/const/localStorage';
import type { AuthResponse } from '@/shared/types/auth';
import { getFromStorage, saveToStorage } from '@/shared/utils/localStorage';

export const $api = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL,
});

$api.interceptors.request.use((config) => {
  if (config.headers) {
    config.headers.Authorization = `Bearer ${getFromStorage<string>(TOKEN_LOCALSTORAGE_KEY)}`;
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
        const response = await axios.get<AuthResponse>(`${import.meta.env.VITE_API_URL}/refresh`, {
          withCredentials: true,
        });
        saveToStorage(TOKEN_LOCALSTORAGE_KEY, response.data.accessToken);
        return $api.request(originalRequest);
      } catch (error) {
        console.error('Not authorized', error);
      }
    }
    throw error;
  },
);
