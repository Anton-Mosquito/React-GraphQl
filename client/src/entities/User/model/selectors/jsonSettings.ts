import { type StateSchema } from '@/app/providers/StoreProvider';
import { buildSelector } from '@/shared/lib/store/buildSelector';

export const [useJsonSettings, getJsonSettings] = buildSelector(
  (state: StateSchema) => state.user.authData?.jsonSettings,
);