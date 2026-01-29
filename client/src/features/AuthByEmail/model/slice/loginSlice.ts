import { createSlice } from '@reduxjs/toolkit';

import { loginByUserEmail } from '../services/loginByUserEmail/loginByUserEmail';
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
      .addCase(loginByUserEmail.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(loginByUserEmail.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(loginByUserEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { actions: loginActions, reducer: loginReducer } = loginSlice;
