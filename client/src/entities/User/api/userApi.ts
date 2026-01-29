import { rtkApi } from '@/shared/api/rtkApi';

// import { type JsonSettings } from '../model/types/jsonSettings';
import { type User } from '../model/types/user';

// interface setJsonSettingsArg {
//   userId: string;
//   jsonSettings: JsonSettings;
// }

const userApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    // setJsonSettings: build.mutation<User, setJsonSettingsArg>({
    //   query: ({ userId, jsonSettings }) => ({
    //     url: `/users/${userId}`,
    //     method: 'PATCH',
    //     body: { jsonSettings },
    //   }),
    // }),
    getUserDataById: build.query<User, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'GET',
      }),
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
    activate: build.query<{ success: boolean; message: string }, string>({
      query: (link) => ({
        url: `/activate/${link}`,
        method: 'GET',
      }),
    }),
  }),
});

// export const setJsonSettingsMutation = userApi.endpoints.setJsonSettings.initiate;
export const getUserDataByIdQuery = userApi.endpoints.getUserDataById.initiate;
export const logoutMutation = userApi.endpoints.logout.initiate;
export const activateQuery = userApi.endpoints.activate.initiate;

export const { useActivateQuery } = userApi;
