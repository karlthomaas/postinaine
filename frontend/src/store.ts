import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import { backendApi } from '@/services/backend';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [backendApi.reducerPath]: backendApi.reducer,
  },

  middleware: (getDefaultMiddleware) => 
  getDefaultMiddleware().concat(backendApi.middleware),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export default store;
