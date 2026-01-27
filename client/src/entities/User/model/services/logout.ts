import { createAsyncThunk } from '@reduxjs/toolkit';

import { type ThunkConfig } from '@/app/providers/StoreProvider';

import { logoutMutation } from '../../api/userApi';

export const logout = createAsyncThunk<void, void, ThunkConfig<string>>(
  'user/logout',
  async (_, thunkApi) => {
    const { rejectWithValue, dispatch } = thunkApi;

    try {
      await dispatch(logoutMutation()).unwrap();
    } catch (error) {
      console.error('🚀 ~ error:', error);
      return rejectWithValue('Logout failed');
    }
  },
);
