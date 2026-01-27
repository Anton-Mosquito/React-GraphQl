import { createSlice } from '@reduxjs/toolkit';

import { loginByUserName } from '../services/loginByUserName/loginByUserName';
import { type LoginSchema } from '../types/loginSchema';

const initialState: LoginSchema = {
  isLoading: false,
  error: undefined,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginByUserName.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(loginByUserName.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(loginByUserName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { actions: loginActions, reducer: loginReducer } = loginSlice;
