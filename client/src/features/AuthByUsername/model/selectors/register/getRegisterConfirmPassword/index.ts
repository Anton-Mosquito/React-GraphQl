import { type StateSchema } from '@/app/providers/StoreProvider';

export const getRegisterConfirmPassword = (state: StateSchema) =>
  state.registerForm?.confirmPassword || '';
