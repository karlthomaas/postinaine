import { Mutex } from 'async-mutex';
import { getEnv } from '@/lib/utils';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { login, logout } from '@/features/auth/authSlice';
import { LoginQueryResponse, LogoutQueryResponse, NewsQueryResponse, SessionQueryResponse } from '@/types/news';
export interface LoginFetchError {
  status: number;
  data: {
    detail: string;
  };
}

const mutex = new Mutex();
const backendUrl = getEnv('VITE_BACKEND_URL');
const baseQuery = fetchBaseQuery({ baseUrl: `${backendUrl}` });

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
    login: builder.mutation<LoginQueryResponse, unknown>({
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
    logout: builder.mutation<LogoutQueryResponse, null>({
      query: () => ({
        url: '/logout',
        method: 'POST',
        credentials: 'include',
      }),
    }),
    session: builder.query<SessionQueryResponse, null>({
      query: () => ({
        url: '/session',
        method: 'GET',
        credentials: 'include',
      }),
    }),
    news: builder.query<NewsQueryResponse, null>({
      query: () => ({
        url: '/news',
        method: 'GET',
        credentials: 'include',
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useSessionQuery, useNewsQuery } = backendApi;
