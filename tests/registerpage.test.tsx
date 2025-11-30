import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/contexts/AuthContext';
import { RegisterPage } from '../src/pages/Auth/Register/RegisterPage';

const MockRegisterPage = () => (
  <BrowserRouter>
    <AuthProvider>
      <RegisterPage />
    </AuthProvider>
  </BrowserRouter>
);

describe('RegisterPage', () => {
  it('should render register page with form elements', () => {
    render(<MockRegisterPage />);

    expect(screen.getByText('Vota Já')).toBeTruthy();
    expect(screen.getByText('CADASTRO')).toBeTruthy();
    expect(screen.getByLabelText('Nome')).toBeTruthy();
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Senha')).toBeTruthy();
    expect(screen.getByLabelText('Confirme sua senha')).toBeTruthy();
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeTruthy();
  });

  it('should display login link', () => {
    render(<MockRegisterPage />);

    expect(screen.getByText('Já tem uma conta?')).toBeTruthy();
    expect(screen.getByText('Faça login')).toBeTruthy();
  });

  it('should render name input with placeholder', () => {
    render(<MockRegisterPage />);

    const nameInput = screen.getByLabelText('Nome') as HTMLInputElement;
    expect(nameInput.placeholder).toBe('Seu nome completo');
    expect(nameInput.type).toBe('text');
  });

  it('should render email input with placeholder', () => {
    render(<MockRegisterPage />);

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    expect(emailInput.placeholder).toBe('seu@email.com');
    expect(emailInput.type).toBe('email');
  });

  it('should render password input with placeholder', () => {
    render(<MockRegisterPage />);

    const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement;
    expect(passwordInput.placeholder).toBe('Mínimo 6 caracteres');
    expect(passwordInput.type).toBe('password');
  });

  it('should render confirm password input with placeholder', () => {
    render(<MockRegisterPage />);

    const confirmPasswordInput = screen.getByLabelText(
      'Confirme sua senha'
    ) as HTMLInputElement;
    expect(confirmPasswordInput.placeholder).toBe('Digite a senha novamente');
    expect(confirmPasswordInput.type).toBe('password');
  });

  it('should render submit button', () => {
    render(<MockRegisterPage />);

    const submitButton = screen.getByRole('button', {
      name: /cadastrar/i,
    }) as HTMLButtonElement;
    expect(submitButton.type).toBe('submit');
  });

  it('should have form element', () => {
    render(<MockRegisterPage />);

    const form = screen
      .getByRole('button', { name: /cadastrar/i })
      .closest('form');
    expect(form).toBeTruthy();
  });

  it('should render all required form fields', () => {
    render(<MockRegisterPage />);

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirme sua senha');

    expect(nameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(confirmPasswordInput).toBeTruthy();
  });

  it('should submit form with valid data', async () => {
    const mockFetch = global.fetch as jest.Mock;
    mockFetch
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            user: { id: '1', email: 'john@example.com', name: 'John Doe' },
          }),
          { status: 201 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            accessToken: 'mock-token',
            user: { id: '1', email: 'john@example.com', name: 'John Doe' },
          }),
          { status: 200 }
        )
      );

    const user = userEvent.setup();
    render(<MockRegisterPage />);

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirme sua senha');
    const submitButton = screen.getByRole('button', { name: /cadastrar/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/v1/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
          }),
        })
      );
    });
  });
});
