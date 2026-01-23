import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './providers/appContext';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

const root = ReactDOM.createRoot(rootEl as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
