import { createAsyncThunk } from '@reduxjs/toolkit';
import { type ThunkConfig } from '@/app/providers/StoreProvider';
import { type User } from '../types/user';
import { USER_LOCALSTORAGE_KEY } from '@/shared/const/localStorage';
import { getUserDataByIdQuery } from '../../api/userApi';

export const initAuthData = createAsyncThunk<
  User,
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  void,
  ThunkConfig<string>
>('user/initAuthData', async (newJsonSettings, thunkApi) => {
  const { rejectWithValue, dispatch } = thunkApi;
  const userId = localStorage.getItem(USER_LOCALSTORAGE_KEY);

  if (!userId) {
    return rejectWithValue('user id is not found');
  }

  try {
    const response = await dispatch(getUserDataByIdQuery(userId)).unwrap();

    return response;
  } catch (error) {
    console.error('🚀 ~ error:', error);
    return rejectWithValue('');
  }
});
