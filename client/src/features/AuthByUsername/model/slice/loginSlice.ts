import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type LoginSchema } from '../types/loginSchema';
import { loginByUserName } from '../services/loginByUserName/loginByUserName';

const initialState: LoginSchema = {
  isLoading: false,
  username: '',
  password: '',
  error: undefined,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
  },
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
        state.error = action.payload as string;
      });
  },
});

export const { actions: loginActions, reducer: loginReducer } = loginSlice;
