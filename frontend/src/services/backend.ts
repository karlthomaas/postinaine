import { Mutex } from 'async-mutex';
import { getEnv } from '@/lib/utils';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { login, logout } from '@/features/auth/authSlice';
import { NewsArticle } from '@/components/atoms/article';
import { LoginFormProps } from '@/components/molecules/login-panel';

const mutex = new Mutex();
const backendUrl = getEnv('VITE_BACKEND_URL');
const baseQuery = fetchBaseQuery({ baseUrl: `${backendUrl}` });

export type BackendError = { status: number, data: { detail: string } };

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  /* Additional request is sent to attempt refreshing auth token */

  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery({ url: '/refresh', method: 'POST', credentials: 'include' }, api, extraOptions);
        if (refreshResult.data) {
          api.dispatch(login(refreshResult.data));

          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const backendApi = createApi({
  reducerPath: 'backendApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<{ id: string }, LoginFormProps>({
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
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
        credentials: 'include',
      }),
    }),
    session: builder.query<{ id: string }, undefined>({
      query: () => ({
        url: '/session',
        method: 'GET',
        credentials: 'include',
      }),
    }),
    news: builder.query<{ articles: NewsArticle[] }, void>({
      query: () => ({
        url: '/news',
        method: 'GET',
        credentials: 'include',
      }),
      transformResponse: (response: { status: string; totalResults: string; articles: NewsArticle[] }) => {
        return { articles: response.articles };
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useSessionQuery, useNewsQuery } = backendApi;
