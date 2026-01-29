import { type StateSchema } from '@/app/providers/StoreProvider';

export const getRegisterUsername = (state: StateSchema) => state.registerForm?.username || '';
