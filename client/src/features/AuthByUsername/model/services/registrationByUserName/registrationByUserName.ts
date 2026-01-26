import { type ThunkConfig } from '@/app/providers/StoreProvider';
import { userActions, type User } from '@/entities/User';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthResponse } from '@/shared/types/auth';

interface RegistrationByNameProps {
  username: string;
  password: string;
}

export const registrationByUserName = createAsyncThunk<User, RegistrationByNameProps, ThunkConfig<string>>(
  'login/registrationByUserName',
  async (authData, thunkApi) => {
    const { dispatch, extra, rejectWithValue } = thunkApi;
    try {
      const response = await extra.api.post<AuthResponse>('/registration', authData);

      if (!response.data) {
        throw new Error();
      }

      localStorage.setItem('token', response.data.accessToken);
      dispatch(userActions.setAuthData(response.data.user));

      return response.data.user;
    } catch (error) {
      console.error('🚀 ~ error:', error);
      return rejectWithValue('Invalid data');
    }
  },
);