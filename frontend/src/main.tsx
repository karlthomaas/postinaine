import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store.ts';

import Root from './routes/root.tsx';
import LoginPage from './routes/login.tsx';
import ErrorPage from './error-page.tsx';

import './index.css';

const router = createBrowserRouter([
  { path: '/', element: <Root />, errorElement: <ErrorPage />, children: [{ path: '/login', element: <LoginPage /> }] },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
