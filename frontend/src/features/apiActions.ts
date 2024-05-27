import { getEnv } from '@/lib/utils';
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface FetchError {
  status: number;
  data: {
    detail: string;
  };
}

interface LoginCredentials {
  email: string;
  api_token: string;
}

const backendUrl = getEnv('VITE_BACKEND_URL');

export const backendApi = createApi({
  reducerPath: 'backendApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${backendUrl}` }) as BaseQueryFn<LoginCredentials | FetchArgs, unknown, FetchError>,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
});

export const { useLoginMutation } = backendApi;
