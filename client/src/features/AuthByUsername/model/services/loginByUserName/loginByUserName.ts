import { createAsyncThunk } from '@reduxjs/toolkit';


import { type ThunkConfig } from '@/app/providers/StoreProvider';
import { userActions, type User } from '@/entities/User';
import { TOKEN_LOCALSTORAGE_KEY } from '@/shared/const/localStorage';
import type { AuthResponse } from '@/shared/types/auth';


interface LoginByNameProps {
  username: string;
  password: string;
}

export const loginByUserName = createAsyncThunk<User, LoginByNameProps, ThunkConfig<string>>(
  'login/loginByUserName',
  async (authData, thunkApi) => {
    const { dispatch, extra, rejectWithValue } = thunkApi;
    try {
      const response = await extra.api.post<AuthResponse>('/login', authData);

      if (!response.data) {
        throw new Error();
      }

      localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, response.data.accessToken);
      dispatch(userActions.setAuthData(response.data.user));

      // extra.navigate('/profile')

      return response.data.user;
    } catch (error) {
      console.error('🚀 ~ error:', error);
      const message = error?.response?.data?.message || 'invalidData';
      return rejectWithValue(message);
    }
  },
);
