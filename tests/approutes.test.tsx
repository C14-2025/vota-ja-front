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

    expect(screen.getByText('Login')).toBeTruthy();
    expect(screen.getByText('Faça login para acessar o sistema')).toBeTruthy();
  });
});
