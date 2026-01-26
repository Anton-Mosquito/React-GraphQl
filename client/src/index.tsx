import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app/App';
import { ApolloProvider } from './app/providers/ApolloProvider';
import { ErrorBoundary } from './app/providers/ErrorBoundary';
import './shared/config/i18n/i18';
import { StoreProvider } from './app/providers/StoreProvider';

const rootEl = document.getElementById('root');

if (!rootEl) throw new Error('Root element not found');

const root = ReactDOM.createRoot(rootEl as HTMLElement);
root.render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <StoreProvider>
          <ApolloProvider>
            <App />
          </ApolloProvider>
        </StoreProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
);
