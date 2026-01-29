import { type StateSchema } from '@/app/providers/StoreProvider';

export const getLoginUserName = (state: StateSchema): string => state.loginForm?.username ?? '';
