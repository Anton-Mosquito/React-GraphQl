import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type User, type UserSchema } from '../types/user';
import { USER_LOCALSTORAGE_KEY } from '@/shared/const/localStorage';
import { saveJsonSettings } from '../services/saveJsonSettings';
import { type JsonSettings } from '../types/jsonSettings';
import { initAuthData } from '../services/initAuthData';

const initialState: UserSchema = {
  _inited: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthData: (state, { payload }: PayloadAction<User>) => {
      state.authData = payload;
      localStorage.setItem(USER_LOCALSTORAGE_KEY, payload.id);
    },
    logout: (state) => {
      state.authData = undefined;
      localStorage.removeItem(USER_LOCALSTORAGE_KEY);
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      saveJsonSettings.fulfilled,
      (state, { payload }: PayloadAction<JsonSettings>) => {
        if (state.authData) {
          state.authData.jsonSettings = payload;
        }
      },
    );
    builder.addCase(initAuthData.fulfilled, (state, { payload }: PayloadAction<User>) => {
      state.authData = payload;
      state._inited = true;
    });
    builder.addCase(initAuthData.rejected, (state) => {
      state._inited = true;
    });
  },
});

export const { actions: userActions, reducer: userReducer } = userSlice;
