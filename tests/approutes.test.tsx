import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/contexts/AuthContext';
import { LoginPage } from '../src/pages';

describe('AppRoutes', () => {
  it('should render login page', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Vota Já')).toBeTruthy();
    expect(screen.getByText('LOGIN')).toBeTruthy();
  });
});
