import { createAsyncThunk } from '@reduxjs/toolkit';

import { type ThunkConfig } from '@/app/providers/StoreProvider';
import { USER_LOCALSTORAGE_KEY } from '@/shared/const/localStorage';
import { getFromStorage } from '@/shared/utils/localStorage';

import { getUserDataByIdQuery } from '../../api/userApi';
import { type User } from '../types/user';

export const initAuthData = createAsyncThunk<User, void, ThunkConfig<string>>(
  'user/initAuthData',
  async (newJsonSettings, thunkApi) => {
    const { rejectWithValue, dispatch } = thunkApi;
    const userId = getFromStorage<string>(USER_LOCALSTORAGE_KEY);

    if (!userId) {
      return rejectWithValue('user id is not found');
    }

    try {
      const response = await dispatch(getUserDataByIdQuery(userId)).unwrap();
      return response;
    } catch (error) {
      console.error('🚀 ~ error:', error);
      return rejectWithValue('failed to load user data');
    }
  },
);
