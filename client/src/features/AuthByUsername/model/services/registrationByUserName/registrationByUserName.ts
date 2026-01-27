import { createAsyncThunk } from '@reduxjs/toolkit';


import { type ThunkConfig } from '@/app/providers/StoreProvider';
import { userActions, type User } from '@/entities/User';
import { TOKEN_LOCALSTORAGE_KEY } from '@/shared/const/localStorage';
import type { AuthResponse } from '@/shared/types/auth';

interface RegistrationByNameProps {
  email: string;
  username: string;
  password: string;
}

export const registrationByUserName = createAsyncThunk<
  User,
  RegistrationByNameProps,
  ThunkConfig<string>
>('register/registrationByUserName', async (authData, thunkApi) => {
  const { dispatch, extra, rejectWithValue } = thunkApi;
  try {
    const response = await extra.api.post<AuthResponse>('/registration', authData);

    if (!response.data) {
      throw new Error();
    }

    localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, response.data.accessToken);
    dispatch(userActions.setAuthData(response.data.user));

    return response.data.user;
  } catch (error) {
    console.error('🚀 ~ error:', error);
    const message = error?.response?.data?.message || 'serverError';
    return rejectWithValue(message);
  }
});
