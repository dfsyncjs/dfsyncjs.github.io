import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Analytics, GA4Provider } from './services/analytics';
import App from './App';
import { AppProviders } from './app/AppProviders';

Analytics.init(new GA4Provider());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <HashRouter>
        <App />
      </HashRouter>
    </AppProviders>
  </React.StrictMode>,
);
