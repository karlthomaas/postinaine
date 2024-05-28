import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import authReducer from '@/features/auth/authSlice';
import { backendApi } from '@/features/apiActions';
import type { AppStore, RootState } from '@/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function renderWithProviders(ui: React.ReactElement, extendedRenderOptions: ExtendedRenderOptions = {}) {
  const {
    store = configureStore({
      reducer: {
        auth: authReducer,
        [backendApi.reducerPath]: backendApi.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(backendApi.middleware),
    }),
    ...renderOptions
  } = extendedRenderOptions;

  const Wrapper = ({ children }: PropsWithChildren) => <Provider store={store}>{children}</Provider>;

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
