import { createAsyncThunk } from '@reduxjs/toolkit';
import { type ThunkConfig } from '@/app/providers/StoreProvider';
import { type JsonSettings } from '../types/jsonSettings';
import { getUserAuthData } from '../selectors/getUserAuthData/getUserAuthData';
import { getJsonSettings } from '../selectors/jsonSettings';
import { setJsonSettingsMutation } from '../../api/userApi';

export const saveJsonSettings = createAsyncThunk<JsonSettings, JsonSettings, ThunkConfig<string>>(
  'user/saveJsonSettings',
  async (newJsonSettings, thunkApi) => {
    const { rejectWithValue, getState, dispatch } = thunkApi;
    const userData = getUserAuthData(getState());
    const currentSettings = getJsonSettings(getState());

    if (!userData) {
      return rejectWithValue('User is not authenticated');
    }

    try {
      const response = await dispatch(
        setJsonSettingsMutation({
          userId: userData.id,
          jsonSettings: {
            ...currentSettings,
            ...newJsonSettings,
          },
        }),
      ).unwrap();

      if (!response.jsonSettings) {
        return rejectWithValue('Failed to save settings');
      }

      return response.jsonSettings;
    } catch (error) {
      console.error('🚀 ~ error:', error);
      return rejectWithValue('Failed to save settings');
    }
  },
);
