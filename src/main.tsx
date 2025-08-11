import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
//
import App from './App';
import { QueryProvider } from './providers';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <QueryProvider>
        <Suspense>
          <App />
        </Suspense>
      </QueryProvider>
    </BrowserRouter>
  </HelmetProvider>
);
