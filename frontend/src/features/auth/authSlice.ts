import { createSlice } from '@reduxjs/toolkit';
import { backendApi } from '../apiActions'

const initialState = {
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.
    addMatcher(backendApi.endpoints.login.matchFulfilled, (state) => {
      state.isLoggedIn = true
    })
    .addMatcher(backendApi.endpoints.login.matchRejected, (state) => {
      state.isLoggedIn = false
    })
  }
});

export default authSlice.reducer;
