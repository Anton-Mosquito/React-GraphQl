import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { TOKEN_LOCALSTORAGE_KEY } from '@/shared/const/localStorage';

export const rtkApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY) ?? '';
      if (token) {
        headers.set('Authorization', token);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({}),
});
