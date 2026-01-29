import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { USER_LOCALSTORAGE_KEY, TOKEN_LOCALSTORAGE_KEY } from '@/shared/const/localStorage';
import { saveToStorage, removeFromStorage } from '@/shared/utils/localStorage';

// import { saveJsonSettings } from '../services/saveJsonSettings';
// import { type JsonSettings } from '../types/jsonSettings';
import { initAuthData } from '../services/initAuthData';
import { logout } from '../services/logout';
import { type User, type UserSchema } from '../types/user';

const initialState: UserSchema = {
  _inited: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthData: (state, { payload }: PayloadAction<User>) => {
      state.authData = payload;
      saveToStorage(USER_LOCALSTORAGE_KEY, payload.id);
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(
    //   saveJsonSettings.fulfilled,
    //   (state, { payload }: PayloadAction<JsonSettings>) => {
    //     if (state.authData) {
    //       state.authData.jsonSettings = payload;
    //     }
    //   },
    // );
    builder.addCase(initAuthData.fulfilled, (state, { payload }: PayloadAction<User>) => {
      state.authData = payload;
      state._inited = true;
    });
    builder.addCase(initAuthData.rejected, (state) => {
      state._inited = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.authData = undefined;
      removeFromStorage(USER_LOCALSTORAGE_KEY);
      removeFromStorage(TOKEN_LOCALSTORAGE_KEY);
    });
  },
});

export const { actions: userActions, reducer: userReducer } = userSlice;
