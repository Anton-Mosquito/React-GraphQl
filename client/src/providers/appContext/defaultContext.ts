import { useSearchParams } from 'react-router-dom';

import { LOCALES } from '../../const';
import { STORAGE_KEY } from '../../const';
import { getFromStorage } from '../../utils/localStorage';

export type AppState = {
  locale: string;
};

export const useDefaultContext = (): AppState => {
  const [searchParams] = useSearchParams();

  return {
    locale:
      (getFromStorage(STORAGE_KEY) as string | null) ||
      (searchParams.get('locale') as string | null) ||
      LOCALES.ENGLISH,
  };
};
