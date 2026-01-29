import { createAsyncThunk } from '@reduxjs/toolkit';

import { type ThunkConfig } from '@/app/providers/StoreProvider';
import { userActions, type User } from '@/entities/User';
import { TOKEN_LOCALSTORAGE_KEY } from '@/shared/const/localStorage';
import type { AuthResponse } from '@/shared/types/auth';
import { saveToStorage } from '@/shared/utils/localStorage';

interface LoginByNameProps {
  email: string;
  password: string;
}

export const loginByUserEmail = createAsyncThunk<User, LoginByNameProps, ThunkConfig<string>>(
  'login/loginByUserEmail',
  async (authData, thunkApi) => {
    const { dispatch, extra, rejectWithValue } = thunkApi;
    try {
      const response = await extra.api.post<AuthResponse>('/login', authData);

      if (!response.data) {
        throw new Error();
      }

      saveToStorage(TOKEN_LOCALSTORAGE_KEY, response.data.accessToken);
      dispatch(userActions.setAuthData(response.data.user));

      // extra.navigate('/profile')

      return response.data.user;
    } catch (error: unknown) {
      console.error('🚀 ~ error:', error);
      const message = error?.response?.data?.message || 'invalidData';
      return rejectWithValue(message);
    }
  },
);
