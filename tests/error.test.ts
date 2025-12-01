import {
  parseApiError,
  createApiError,
  ApiErrorResponse,
  ApiErrorType,
} from '../src/types/error';

describe('Error Utils', () => {
  describe('parseApiError', () => {
    it('should parse Response error', () => {
      const response = new Response(null, { status: 404 });

      const result = parseApiError(response);

      expect(result).toBe('Erro no servidor (404)');
    });

    it('should parse Error with JSON message', () => {
      const apiError: ApiErrorResponse = {
        statusCode: 400,
        error: 'Bad Request',
        message: 'email must be an email',
      };
      const error = new Error(JSON.stringify(apiError));

      const result = parseApiError(error);

      expect(result).toBe('Digite um email válido.');
    });

    it('should parse Error with direct message translation', () => {
      const error = new Error('Credentials are not valid.');

      const result = parseApiError(error);

      expect(result).toBe('Email ou senha incorretos.');
    });

    it('should return original message if no translation', () => {
      const error = new Error('Some unknown error');

      const result = parseApiError(error);

      expect(result).toBe('Some unknown error');
    });

    it('should parse ApiErrorResponse with string message', () => {
      const error: ApiErrorResponse = {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Credentials are not valid.',
      };

      const result = parseApiError(error);

      expect(result).toBe('Email ou senha incorretos.');
    });

    it('should parse ApiErrorResponse with array message (single)', () => {
      const error: ApiErrorResponse = {
        statusCode: 400,
        error: 'Bad Request',
        message: ['email must be an email'],
      };

      const result = parseApiError(error);

      expect(result).toBe('Digite um email válido.');
    });

    it('should parse ApiErrorResponse with array message (multiple)', () => {
      const error: ApiErrorResponse = {
        statusCode: 400,
        error: 'Bad Request',
        message: ['email must be an email', 'password should not be empty'],
      };

      const result = parseApiError(error);

      expect(result).toBe('Digite um email válido.');
    });

    it('should handle empty array message', () => {
      const error: ApiErrorResponse = {
        statusCode: 400,
        error: 'Bad Request',
        message: [],
      };

      const result = parseApiError(error);

      expect(result).toBe(
        'Alguns campos estão inválidos. Verifique e tente novamente.'
      );
    });

    it('should return untranslated message for unknown error in array', () => {
      const error: ApiErrorResponse = {
        statusCode: 400,
        error: 'Bad Request',
        message: ['some unknown validation error'],
      };

      const result = parseApiError(error);

      expect(result).toBe('some unknown validation error');
    });

    it('should return generic message for multiple unknown errors', () => {
      const error: ApiErrorResponse = {
        statusCode: 400,
        error: 'Bad Request',
        message: ['unknown error 1', 'unknown error 2'],
      };

      const result = parseApiError(error);

      expect(result).toBe(
        'Alguns campos estão inválidos. Verifique e tente novamente.'
      );
    });

    it('should handle 400 status code', () => {
      const error: ApiErrorResponse = {
        statusCode: 400,
        error: 'Bad Request',
        message: {},
      } as unknown as ApiErrorResponse;

      const result = parseApiError(error);

      expect(result).toBe(
        'Dados inválidos. Verifique os campos e tente novamente.'
      );
    });

    it('should handle 401 status code', () => {
      const error: ApiErrorResponse = {
        statusCode: 401,
        error: 'Unauthorized',
        message: {},
      } as unknown as ApiErrorResponse;

      const result = parseApiError(error);

      expect(result).toBe('Você precisa estar autenticado.');
    });

    it('should handle 403 status code', () => {
      const error: ApiErrorResponse = {
        statusCode: 403,
        error: 'Forbidden',
        message: {},
      } as unknown as ApiErrorResponse;

      const result = parseApiError(error);

      expect(result).toBe('Você não tem permissão para realizar esta ação.');
    });

    it('should handle 404 status code', () => {
      const error: ApiErrorResponse = {
        statusCode: 404,
        error: 'Not Found',
        message: {},
      } as unknown as ApiErrorResponse;

      const result = parseApiError(error);

      expect(result).toBe('Recurso não encontrado.');
    });

    it('should handle 409 status code', () => {
      const error: ApiErrorResponse = {
        statusCode: 409,
        error: 'Conflict',
        message: {},
      } as unknown as ApiErrorResponse;

      const result = parseApiError(error);

      expect(result).toBe('Este recurso já existe.');
    });

    it('should handle 500 status code', () => {
      const error: ApiErrorResponse = {
        statusCode: 500,
        error: 'Internal Server Error',
        message: {},
      } as unknown as ApiErrorResponse;

      const result = parseApiError(error);

      expect(result).toBe('Erro no servidor. Tente novamente mais tarde.');
    });

    it('should handle unknown status code', () => {
      const error: ApiErrorResponse = {
        statusCode: 418,
        error: "I'm a teapot",
        message: {},
      } as unknown as ApiErrorResponse;

      const result = parseApiError(error);

      expect(result).toBe('Ocorreu um erro inesperado. Tente novamente.');
    });

    it('should handle unknown error type', () => {
      const result = parseApiError({ weird: 'object' });

      expect(result).toBe('Ocorreu um erro inesperado. Tente novamente.');
    });

    it('should handle null error', () => {
      const result = parseApiError(null);

      expect(result).toBe('Ocorreu um erro inesperado. Tente novamente.');
    });

    it('should handle undefined error', () => {
      const result = parseApiError(undefined);

      expect(result).toBe('Ocorreu um erro inesperado. Tente novamente.');
    });

    it('should translate all known error messages', () => {
      const knownErrors = [
        'User already exists with this email',
        'User not found',
        'Poll not found',
        'Poll option not found',
        'Unauthorized to access this private poll',
        'Poll is closed',
        'Only the creator can close this poll',
        'User has already voted in this poll',
        'Vote not found',
        'password must be longer than or equal to 6 characters',
        'name should not be empty',
        'email should not be empty',
        'password should not be empty',
        'title should not be empty',
        'description should not be empty',
        'type should not be empty',
        'options should not be empty',
        'options must contain at least 2 items',
        'each value in options must be a string',
      ];

      knownErrors.forEach((errorMsg) => {
        const result = parseApiError(new Error(errorMsg));
        expect(result).not.toBe(errorMsg);
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });

  describe('createApiError', () => {
    it('should create ApiError with string message', () => {
      const error = createApiError(404, 'Not Found', 'Resource not found');

      expect(error.name).toBe('ApiError');
      expect(error.statusCode).toBe(404);
      expect(error.error).toBe('Not Found');
      expect(error.message).toBe('Resource not found');
    });

    it('should create ApiError with array message', () => {
      const error = createApiError(400, 'Bad Request', [
        'email is invalid',
        'password is required',
      ]);

      expect(error.name).toBe('ApiError');
      expect(error.statusCode).toBe(400);
      expect(error.error).toBe('Bad Request');
      expect(error.message).toBe('email is invalid, password is required');
    });

    it('should create ApiError with empty array message', () => {
      const error = createApiError(400, 'Bad Request', []);

      expect(error.message).toBe('');
    });

    it('should be instance of Error', () => {
      const error = createApiError(
        500,
        'Internal Server Error',
        'Something went wrong'
      );

      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('ApiErrorType constants', () => {
    it('should have all error type constants', () => {
      expect(ApiErrorType.WRONG_CREDENTIALS).toBe('Credentials are not valid.');
      expect(ApiErrorType.UNAUTHORIZED).toBe('Unauthorized');
      expect(ApiErrorType.USER_ALREADY_EXISTS).toBe(
        'User already exists with this email'
      );
      expect(ApiErrorType.USER_NOT_FOUND).toBe('User not found');
      expect(ApiErrorType.POLL_NOT_FOUND).toBe('Poll not found');
      expect(ApiErrorType.POLL_OPTION_NOT_FOUND).toBe('Poll option not found');
      expect(ApiErrorType.UNAUTHORIZED_POLL_ACCESS).toBe(
        'Unauthorized to access this private poll'
      );
      expect(ApiErrorType.USER_ALREADY_VOTED).toBe(
        'User has already voted in this poll'
      );
      expect(ApiErrorType.VOTE_NOT_FOUND).toBe('Vote not found');
      expect(ApiErrorType.BAD_REQUEST).toBe('Bad Request');
      expect(ApiErrorType.INTERNAL_SERVER_ERROR).toBe('Internal Server Error');
    });
  });
});
