import { createAsyncThunk } from '@reduxjs/toolkit';
import { type ThunkConfig } from '@/app/providers/StoreProvider';
import { userActions } from '../slice/userSlice';

export const logout = createAsyncThunk<void, void, ThunkConfig<string>>(
  'user/logout',
  async (_, thunkApi) => {
    const { extra, rejectWithValue, dispatch } = thunkApi;

    try {
      await extra.api.post('/logout');
      dispatch(userActions.logout());
    } catch (error) {
      console.error('🚀 ~ error:', error);
      return rejectWithValue('Logout failed');
    }
  },
);
