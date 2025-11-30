import { login, register } from '../src/services/authService';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserResponse,
} from '../src/services/authService';

global.fetch = jest.fn();

describe('authService', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginData: LoginRequest = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockAuthResponse: AuthResponse = {
      accessToken: 'mock-token-123',
      user: {
        id: '1',
        email: 'test@example.com',
      },
    };

    it('deve fazer login com sucesso', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAuthResponse,
      } as Response);

      const result = await login(loginData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/v1/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        }
      );
      expect(result).toEqual(mockAuthResponse);
    });

    it('deve lançar erro quando credenciais são inválidas', async () => {
      const errorResponse = {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Credentials are not valid.',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => errorResponse,
      } as Response);

      await expect(login(loginData)).rejects.toEqual(errorResponse);
    });

    it('deve lançar erro quando email está incorreto', async () => {
      const errorResponse = {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Credentials are not valid.',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => errorResponse,
      } as Response);

      await expect(
        login({ ...loginData, email: 'wrong@example.com' })
      ).rejects.toEqual(errorResponse);
    });

    it('deve lançar erro quando senha está incorreta', async () => {
      const errorResponse = {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Credentials are not valid.',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => errorResponse,
      } as Response);

      await expect(
        login({ ...loginData, password: 'wrongpassword' })
      ).rejects.toEqual(errorResponse);
    });

    it('deve lançar erro de rede', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(login(loginData)).rejects.toThrow('Network error');
    });
  });

  describe('register', () => {
    const registerData: RegisterRequest = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUserResponse: UserResponse = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: '2025-11-30T10:00:00Z',
    };

    it('deve registrar usuário com sucesso', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserResponse,
      } as Response);

      const result = await register(registerData);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:5000/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });
      expect(result).toEqual(mockUserResponse);
    });

    it('deve lançar erro quando email já existe', async () => {
      const errorResponse = {
        statusCode: 409,
        error: 'Conflict',
        message: 'User already exists with this email',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => errorResponse,
      } as Response);

      await expect(register(registerData)).rejects.toEqual(errorResponse);
    });

    it('deve lançar erro de validação quando campos estão vazios', async () => {
      const errorResponse = {
        statusCode: 400,
        error: 'Bad Request',
        message: [
          'name should not be empty',
          'email should not be empty',
          'password should not be empty',
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => errorResponse,
      } as Response);

      await expect(
        register({ name: '', email: '', password: '' })
      ).rejects.toEqual(errorResponse);
    });

    it('deve lançar erro de validação quando email é inválido', async () => {
      const errorResponse = {
        statusCode: 400,
        error: 'Bad Request',
        message: ['email must be an email'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => errorResponse,
      } as Response);

      await expect(
        register({ ...registerData, email: 'invalid-email' })
      ).rejects.toEqual(errorResponse);
    });

    it('deve lançar erro de validação quando senha é muito curta', async () => {
      const errorResponse = {
        statusCode: 400,
        error: 'Bad Request',
        message: ['password must be longer than or equal to 6 characters'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => errorResponse,
      } as Response);

      await expect(
        register({ ...registerData, password: '12345' })
      ).rejects.toEqual(errorResponse);
    });

    it('deve lançar erro de rede', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(register(registerData)).rejects.toThrow('Network error');
    });
  });
});
