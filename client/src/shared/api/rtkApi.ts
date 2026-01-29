import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { TOKEN_LOCALSTORAGE_KEY } from '@/shared/const/localStorage';
import { getFromStorage, saveToStorage, removeFromStorage } from '@/shared/utils/localStorage';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = getFromStorage<string>(TOKEN_LOCALSTORAGE_KEY) ?? '';
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery({ url: '/refresh', method: 'GET' }, api, extraOptions);

    if (refreshResult.data) {
      const authData = refreshResult.data as { accessToken: string };
      saveToStorage(TOKEN_LOCALSTORAGE_KEY, authData.accessToken);

      return await baseQuery(args, api, extraOptions);
    }

    removeFromStorage(TOKEN_LOCALSTORAGE_KEY);
  }

  return result;
};

export const rtkApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: (_builder) => ({}),
});
