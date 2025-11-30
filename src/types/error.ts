export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
}

export const ApiErrorType = {
  WRONG_CREDENTIALS: 'Credentials are not valid.',
  UNAUTHORIZED: 'Unauthorized',
  USER_ALREADY_EXISTS: 'User already exists with this email',
  USER_NOT_FOUND: 'User not found',
  POLL_NOT_FOUND: 'Poll not found',
  POLL_OPTION_NOT_FOUND: 'Poll option not found',
  UNAUTHORIZED_POLL_ACCESS: 'Unauthorized to access this private poll',
  USER_ALREADY_VOTED: 'User has already voted in this poll',
  VOTE_NOT_FOUND: 'Vote not found',
  BAD_REQUEST: 'Bad Request',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
} as const;

const ERROR_MESSAGES: Record<string, string> = {
  'Credentials are not valid.': 'Email ou senha incorretos.',
  Unauthorized: 'Você precisa estar autenticado.',
  'User already exists with this email': 'Este email já está cadastrado.',
  'User not found': 'Usuário não encontrado.',
  'Poll not found': 'Votação não encontrada.',
  'Poll option not found': 'Opção de votação não encontrada.',
  'Unauthorized to access this private poll':
    'Você não tem permissão para acessar esta votação privada.',
  'User has already voted in this poll': 'Você já votou nesta votação.',
  'Vote not found': 'Voto não encontrado.',
  'email must be an email': 'Digite um email válido.',
  'password must be longer than or equal to 6 characters':
    'A senha deve ter no mínimo 6 caracteres.',
  'name should not be empty': 'O nome é obrigatório.',
  'email should not be empty': 'O email é obrigatório.',
  'password should not be empty': 'A senha é obrigatória.',
};

function isApiErrorResponse(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'error' in error &&
    'message' in error
  );
}

export function parseApiError(error: unknown): string {
  if (error instanceof Response) {
    return `Erro no servidor (${error.status})`;
  }

  if (error instanceof Error) {
    try {
      const apiError = JSON.parse(error.message) as ApiErrorResponse;
      return formatApiError(apiError);
    } catch {
      return ERROR_MESSAGES[error.message] || error.message;
    }
  }

  if (isApiErrorResponse(error)) {
    return formatApiError(error);
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
}

// Format API error to user-friendly message
function formatApiError(error: ApiErrorResponse): string {
  if (Array.isArray(error.message)) {
    const firstError = error.message[0];
    if (!firstError) {
      return 'Alguns campos estão inválidos. Verifique e tente novamente.';
    }

    const translated = ERROR_MESSAGES[firstError];
    if (translated) {
      return translated;
    }

    if (error.message.length > 1) {
      return 'Alguns campos estão inválidos. Verifique e tente novamente.';
    }

    return firstError;
  }

  if (typeof error.message === 'string') {
    return ERROR_MESSAGES[error.message] || error.message;
  }

  switch (error.statusCode) {
    case 400:
      return 'Dados inválidos. Verifique os campos e tente novamente.';
    case 401:
      return 'Você precisa estar autenticado.';
    case 403:
      return 'Você não tem permissão para realizar esta ação.';
    case 404:
      return 'Recurso não encontrado.';
    case 409:
      return 'Este recurso já existe.';
    case 500:
      return 'Erro no servidor. Tente novamente mais tarde.';
    default:
      return 'Ocorreu um erro inesperado. Tente novamente.';
  }
}

export interface ApiError extends Error {
  statusCode: number;
  error: string;
}

export function createApiError(
  statusCode: number,
  error: string,
  message: string | string[]
): ApiError {
  const errorMessage = Array.isArray(message) ? message.join(', ') : message;
  const apiError = new Error(errorMessage) as ApiError;
  apiError.name = 'ApiError';
  apiError.statusCode = statusCode;
  apiError.error = error;
  return apiError;
}
