import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/contexts/AuthContext';
import { LoginPage } from '../src/pages/Auth/Login/LoginPage';

const MockLoginPage = () => (
  <BrowserRouter>
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  </BrowserRouter>
);

describe('LoginPage', () => {
  it('should render login page with form elements', () => {
    render(<MockLoginPage />);

    expect(screen.getByText('Vota Já')).toBeTruthy();
    expect(screen.getByText('LOGIN')).toBeTruthy();
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Senha')).toBeTruthy();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeTruthy();
  });

  it('should display register link', () => {
    render(<MockLoginPage />);

    expect(screen.getByText('Não tem uma conta?')).toBeTruthy();
    expect(screen.getByText('Cadastre-se')).toBeTruthy();
  });

  it('should render email input with placeholder', () => {
    render(<MockLoginPage />);

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    expect(emailInput.placeholder).toBe('seu@email.com');
    expect(emailInput.type).toBe('email');
  });

  it('should render password input with placeholder', () => {
    render(<MockLoginPage />);

    const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement;
    expect(passwordInput.placeholder).toBe('••••••••');
    expect(passwordInput.type).toBe('password');
  });

  it('should render submit button', () => {
    render(<MockLoginPage />);

    const submitButton = screen.getByRole('button', {
      name: /entrar/i,
    }) as HTMLButtonElement;
    expect(submitButton.type).toBe('submit');
  });

  it('should have form element', () => {
    render(<MockLoginPage />);

    const form = screen
      .getByRole('button', { name: /entrar/i })
      .closest('form');
    expect(form).toBeTruthy();
  });

  it('should submit form with valid credentials', async () => {
    const mockFetch = global.fetch as jest.Mock;
    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          accessToken: 'mock-token',
          user: { id: '1', email: 'test@example.com', name: 'Test User' },
        }),
        { status: 200 }
      )
    );

    const user = userEvent.setup();
    render(<MockLoginPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/v1/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        })
      );
    });
  });
});
