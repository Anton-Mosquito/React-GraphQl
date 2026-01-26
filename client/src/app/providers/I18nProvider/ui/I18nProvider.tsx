import { flatten } from 'flat';
import type { ReactNode } from 'react';
import React, { Fragment, useContext } from 'react';
import { IntlProvider } from 'react-intl';

import { LOCALES } from '@/shared/const';
import messages from '@/messages';
import { AppContext } from '@/providers/appContext';

type I18nProviderProps = {
  children: ReactNode;
  locale?: string;
};

const I18nProvider = ({ children, locale: propLocale }: I18nProviderProps) => {
  const { state } = useContext(AppContext) as any;
  const lang = propLocale ?? state.locale ?? LOCALES.ENGLISH;
  return (
    <IntlProvider
      textComponent={Fragment}
      locale={lang}
      messages={flatten(messages[lang as keyof typeof messages])}
    >
      {children}
    </IntlProvider>
  );
};
I18nProvider.displayName = 'I18nProvider';

export default I18nProvider;
