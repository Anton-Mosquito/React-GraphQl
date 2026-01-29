import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { registrationByUserEmail } from '../services/registrationByUserEmail/registrationByUserEmail';

export interface RegisterSchema {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  error?: string;
}

const initialState: RegisterSchema = {
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  isLoading: false,
};

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registrationByUserEmail.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(registrationByUserEmail.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registrationByUserEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { actions: registerActions, reducer: registerReducer } = registerSlice;
