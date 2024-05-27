import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import { backendApi } from './features/apiActions';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [backendApi.reducerPath]: backendApi.reducer,
  },

  middleware: (getDefaultMiddleware) => 
  getDefaultMiddleware().concat(backendApi.middleware),
});

export default store;
