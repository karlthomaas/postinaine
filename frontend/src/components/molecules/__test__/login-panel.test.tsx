import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, afterAll, afterEach, beforeAll } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';

import { LoginPanel } from '@/components/molecules/login-panel';
import { renderWithProviders } from '@/lib/test-utils';
import { getEnv } from '@/lib/utils';

const backend_url = getEnv('VITE_BACKEND_URL');

export const handlers = [
  http.post(`${backend_url}/login`, async () => {
    return HttpResponse.json({ detail: 'Invalid API Token' }, { status: 401 });
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('LoginPanel', () => {
  it('Empty login panel inputs', async () => {
    renderWithProviders(
      <BrowserRouter>
        <LoginPanel />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: 'Login' });
    expect(submitButton).toBeDisabled();
  });

  it('Incorrectly formated login panel inputs', async () => {
    renderWithProviders(
      <BrowserRouter>
        <LoginPanel />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('email');
    const apiTokenInput = screen.getByLabelText('api-token');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@test.e' } });
    fireEvent.change(apiTokenInput, { target: { value: 'ae96a97fb02040a59815c15d13y0cb1' } });

    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    expect(await screen.findByText('Invalid email')).toBeTruthy();
    expect(await screen.findByText('API token must be at least 32 characters')).toBeTruthy();
  });

  it('Login panel invalid api token request', async () => {
    renderWithProviders(
      <BrowserRouter>
        <LoginPanel />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('email');
    const apiTokenInput = screen.getByLabelText('api-token');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@test.ee' } });
    fireEvent.change(apiTokenInput, { target: { value: 'ae92a97xb02040a598415c15a13a0cb1' } });

    fireEvent.click(submitButton);
    await waitFor(async () => {
      expect(await screen.findByText('Invalid API Token')).toBeTruthy();
    });
  });

  it('Login panel visual snapshot', async () => {
    renderWithProviders(
      <BrowserRouter>
        <LoginPanel />
      </BrowserRouter>
    );

    await expect(screen.getByTestId('login-form')).toMatchFileSnapshot('./snapshots/login-panel.output.html');
  });
});
