import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from '@/lib/test-utils';
import { Navbar } from '@/components/organisms/navbar';

describe('Navbar', () => {
  it('Render navbar', async () => {
    renderWithProviders(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const navbar = screen.getByRole('navigation');

    expect(navbar).toBeTruthy();
    expect(await screen.findByText('Login')).toBeTruthy();
    expect(navbar).toMatchFileSnapshot('./snapshots/navbar.output.html');
  });
});
