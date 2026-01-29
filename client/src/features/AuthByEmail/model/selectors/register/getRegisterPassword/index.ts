import { type StateSchema } from '@/app/providers/StoreProvider';

export const getRegisterPassword = (state: StateSchema) => state.registerForm?.password || '';
