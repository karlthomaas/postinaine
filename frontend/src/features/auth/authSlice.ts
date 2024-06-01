import { createSlice } from '@reduxjs/toolkit';
import { backendApi } from '@/services/backend';
import { RootState } from '@/store';

interface AuthState {
  userId: string | null;
}

const initialState: AuthState = {
  userId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userId = '';
    },
    login: (state, action) => {
      state.userId = action.payload.id;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(backendApi.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.userId = payload.id;
      })
      .addMatcher(backendApi.endpoints.session.matchFulfilled, (state, { payload }) => {
        state.userId = payload.id;
      })
      .addMatcher(backendApi.endpoints.logout.matchFulfilled, (state) => {
        state.userId = null;
      });
  },
});

export const selectSession = (state: RootState) => state.auth;

export const { logout, login } = authSlice.actions;

export default authSlice.reducer;
