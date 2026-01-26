import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import React, { useContext, useMemo } from 'react';

import { AppContext } from '@/providers/appContext';

type ApolloProviderProps = {
  children: React.ReactNode;
};

const ApolloProviderComponent = ({ children }: ApolloProviderProps) => {
  const { state } = useContext(AppContext) as any;
  const client = useMemo(() => {
    const httpLink = new HttpLink({ uri: `http://localhost:5000/graphql` });
    const localeMiddleware = new ApolloLink((operation, forward) => {
      const customHeaders = Object.hasOwn(operation.getContext(), 'headers')
        ? operation.getContext().headers
        : {};

      operation.setContext({
        headers: {
          ...customHeaders,
          locale: state.locale,
        },
      });
      return forward(operation);
    });
    return new ApolloClient({
      link: ApolloLink.from([localeMiddleware, httpLink]),
      cache: new InMemoryCache(),
    });
  }, [state.locale]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

ApolloProviderComponent.displayName = 'ApolloProvider';

export default ApolloProviderComponent;
