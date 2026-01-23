import { flatten } from 'flat';
import type { ReactNode } from 'react';
import React, { Fragment } from 'react';
import { IntlProvider } from 'react-intl';

import { LOCALES } from '../../const';
import messages from '../../messages';

type I18nProviderProps = {
  children: ReactNode;
  locale?: string;
};

const I18nProvider: React.FC<I18nProviderProps> = ({ children, locale = LOCALES.ENGLISH }) => (
  <IntlProvider textComponent={Fragment} locale={locale} messages={flatten(messages[locale])}>
    {children}
  </IntlProvider>
);

I18nProvider.displayName = 'I18nProvider';

export default I18nProvider;
