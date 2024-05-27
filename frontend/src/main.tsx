import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store.ts';

import Root from './routes/root.tsx';
import LoginPage from './routes/login.tsx';
import ErrorPage from './error-page.tsx';

import './index.css';
import { ProtectedRoute } from './routes/protected-routes.tsx';
import NewsPage from './routes/news.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <NewsPage />
          </ProtectedRoute>
        ),
      },
      { path: '/login', element: <LoginPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
