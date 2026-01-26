import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type ApolloProviderProps = {
  children: React.ReactNode;
};

const ApolloProviderComponent = ({ children }: ApolloProviderProps) => {
  const { i18n } = useTranslation();
  const client = useMemo(() => {
    const httpLink = new HttpLink({ uri: `http://localhost:5000/graphql` });
    const localeMiddleware = new ApolloLink((operation, forward) => {
      const customHeaders = Object.hasOwn(operation.getContext(), 'headers')
        ? operation.getContext().headers
        : {};

      operation.setContext({
        headers: {
          ...customHeaders,
          locale: i18n.language,
        },
      });
      return forward(operation);
    });
    return new ApolloClient({
      link: ApolloLink.from([localeMiddleware, httpLink]),
      cache: new InMemoryCache(),
    });
  }, [i18n.language]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

ApolloProviderComponent.displayName = 'ApolloProvider';

export default ApolloProviderComponent;
