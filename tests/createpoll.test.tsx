import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../src/contexts/AuthContext';
import { CreatePollPage } from '../src/pages/CreatePoll/CreatePollPage';
import * as apiService from '../src/services/api';
import { toast } from 'react-toastify';

jest.mock('../src/services/api');
jest.mock('react-toastify');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockAuthContext = {
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
};

const renderCreatePollPage = (contextValue = mockAuthContext) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={contextValue}>
        <CreatePollPage />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('CreatePollPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('authToken', 'mock-token');
  });

  it('deve renderizar o formulário de criação de votação', () => {
    renderCreatePollPage();

    expect(
      screen.getByRole('heading', { name: 'Criar Votação' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Título')).toBeInTheDocument();
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
    expect(screen.getByText('Pública')).toBeInTheDocument();
    expect(screen.getByText('Privada')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Opção 1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Opção 2')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Opção 3 (opcional)')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Opção 4 (opcional)')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  });

  it('deve renderizar o botão Voltar', () => {
    renderCreatePollPage();

    const backButton = screen.getByText('Voltar');
    expect(backButton).toBeInTheDocument();
  });

  it('deve navegar para home ao clicar em Voltar', () => {
    renderCreatePollPage();

    const backButton = screen.getByText('Voltar');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('deve ter "Pública" selecionado por padrão', () => {
    renderCreatePollPage();

    const publicRadio = screen.getByDisplayValue('public') as HTMLInputElement;
    const privateRadio = screen.getByDisplayValue(
      'private'
    ) as HTMLInputElement;

    expect(publicRadio.checked).toBe(true);
    expect(privateRadio.checked).toBe(false);
  });

  it('deve permitir alterar o tipo da votação', () => {
    renderCreatePollPage();

    const privateRadio = screen.getByDisplayValue(
      'private'
    ) as HTMLInputElement;
    fireEvent.click(privateRadio);

    expect(privateRadio.checked).toBe(true);
  });

  it('deve mostrar erro quando título está vazio', async () => {
    renderCreatePollPage();

    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Título é obrigatório')).toBeInTheDocument();
    });
  });

  it('deve mostrar erro quando descrição está vazia', async () => {
    renderCreatePollPage();

    const titleInput = screen.getByLabelText('Título');
    fireEvent.change(titleInput, { target: { value: 'Título de teste' } });

    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Descrição é obrigatória')).toBeInTheDocument();
    });
  });

  it('deve mostrar erro quando opção 1 está vazia', async () => {
    renderCreatePollPage();

    const titleInput = screen.getByLabelText('Título');
    const descriptionInput = screen.getByLabelText('Descrição');

    fireEvent.change(titleInput, { target: { value: 'Título de teste' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Descrição de teste' },
    });

    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Opção 1 é obrigatória')).toBeInTheDocument();
    });
  });

  it('deve mostrar erro quando opção 2 está vazia', async () => {
    renderCreatePollPage();

    const titleInput = screen.getByLabelText('Título');
    const descriptionInput = screen.getByLabelText('Descrição');
    const option1Input = screen.getByPlaceholderText('Opção 1');

    fireEvent.change(titleInput, { target: { value: 'Título de teste' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Descrição de teste' },
    });
    fireEvent.change(option1Input, { target: { value: 'Opção 1' } });

    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Opção 2 é obrigatória')).toBeInTheDocument();
    });
  });

  it('deve criar votação com 2 opções obrigatórias', async () => {
    const mockCreatePoll = apiService.createPoll as jest.Mock;
    mockCreatePoll.mockResolvedValue({
      id: 'poll-123',
      title: 'Título de teste',
      description: 'Descrição de teste',
      type: 'public',
      options: [
        { id: '1', text: 'Opção 1', createdAt: '2025-11-29T10:00:00Z' },
        { id: '2', text: 'Opção 2', createdAt: '2025-11-29T10:00:00Z' },
      ],
      creator: { id: '1', name: 'Test User', email: 'test@example.com' },
      createdAt: '2025-11-29T10:00:00Z',
      updatedAt: '2025-11-29T10:00:00Z',
    });

    renderCreatePollPage();

    const titleInput = screen.getByLabelText('Título');
    const descriptionInput = screen.getByLabelText('Descrição');
    const option1Input = screen.getByPlaceholderText('Opção 1');
    const option2Input = screen.getByPlaceholderText('Opção 2');

    fireEvent.change(titleInput, { target: { value: 'Título de teste' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Descrição de teste' },
    });
    fireEvent.change(option1Input, { target: { value: 'Opção 1' } });
    fireEvent.change(option2Input, { target: { value: 'Opção 2' } });

    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreatePoll).toHaveBeenCalledWith(
        {
          title: 'Título de teste',
          description: 'Descrição de teste',
          type: 'public',
          options: ['Opção 1', 'Opção 2'],
        },
        'mock-token'
      );
      expect(toast.success).toHaveBeenCalledWith('Votação criada com sucesso!');
      expect(mockNavigate).toHaveBeenCalledWith('/polls/poll-123');
    });
  });

  it('deve criar votação com 4 opções', async () => {
    const mockCreatePoll = apiService.createPoll as jest.Mock;
    mockCreatePoll.mockResolvedValue({
      id: 'poll-456',
      title: 'Título de teste',
      description: 'Descrição de teste',
      type: 'private',
      options: [
        { id: '1', text: 'Opção 1', createdAt: '2025-11-29T10:00:00Z' },
        { id: '2', text: 'Opção 2', createdAt: '2025-11-29T10:00:00Z' },
        { id: '3', text: 'Opção 3', createdAt: '2025-11-29T10:00:00Z' },
        { id: '4', text: 'Opção 4', createdAt: '2025-11-29T10:00:00Z' },
      ],
      creator: { id: '1', name: 'Test User', email: 'test@example.com' },
      createdAt: '2025-11-29T10:00:00Z',
      updatedAt: '2025-11-29T10:00:00Z',
    });

    renderCreatePollPage();

    const titleInput = screen.getByLabelText('Título');
    const descriptionInput = screen.getByLabelText('Descrição');
    const option1Input = screen.getByPlaceholderText('Opção 1');
    const option2Input = screen.getByPlaceholderText('Opção 2');
    const option3Input = screen.getByPlaceholderText('Opção 3 (opcional)');
    const option4Input = screen.getByPlaceholderText('Opção 4 (opcional)');
    const privateRadio = screen.getByDisplayValue('private');

    fireEvent.change(titleInput, { target: { value: 'Título de teste' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Descrição de teste' },
    });
    fireEvent.click(privateRadio);
    fireEvent.change(option1Input, { target: { value: 'Opção 1' } });
    fireEvent.change(option2Input, { target: { value: 'Opção 2' } });
    fireEvent.change(option3Input, { target: { value: 'Opção 3' } });
    fireEvent.change(option4Input, { target: { value: 'Opção 4' } });

    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreatePoll).toHaveBeenCalledWith(
        {
          title: 'Título de teste',
          description: 'Descrição de teste',
          type: 'private',
          options: ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4'],
        },
        'mock-token'
      );
      expect(toast.success).toHaveBeenCalledWith('Votação criada com sucesso!');
      expect(mockNavigate).toHaveBeenCalledWith('/polls/poll-456');
    });
  });

  it('deve ignorar opções vazias ao criar votação', async () => {
    const mockCreatePoll = apiService.createPoll as jest.Mock;
    mockCreatePoll.mockResolvedValue({
      id: 'poll-789',
      title: 'Título de teste',
      description: 'Descrição de teste',
      type: 'public',
      options: [
        { id: '1', text: 'Opção 1', createdAt: '2025-11-29T10:00:00Z' },
        { id: '2', text: 'Opção 2', createdAt: '2025-11-29T10:00:00Z' },
        { id: '3', text: 'Opção 3', createdAt: '2025-11-29T10:00:00Z' },
      ],
      creator: { id: '1', name: 'Test User', email: 'test@example.com' },
      createdAt: '2025-11-29T10:00:00Z',
      updatedAt: '2025-11-29T10:00:00Z',
    });

    renderCreatePollPage();

    const titleInput = screen.getByLabelText('Título');
    const descriptionInput = screen.getByLabelText('Descrição');
    const option1Input = screen.getByPlaceholderText('Opção 1');
    const option2Input = screen.getByPlaceholderText('Opção 2');
    const option3Input = screen.getByPlaceholderText('Opção 3 (opcional)');

    fireEvent.change(titleInput, { target: { value: 'Título de teste' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Descrição de teste' },
    });
    fireEvent.change(option1Input, { target: { value: 'Opção 1' } });
    fireEvent.change(option2Input, { target: { value: 'Opção 2' } });
    fireEvent.change(option3Input, { target: { value: 'Opção 3' } });

    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreatePoll).toHaveBeenCalledWith(
        {
          title: 'Título de teste',
          description: 'Descrição de teste',
          type: 'public',
          options: ['Opção 1', 'Opção 2', 'Opção 3'],
        },
        'mock-token'
      );
    });
  });

  it('deve mostrar estado de carregamento durante a criação', async () => {
    const mockCreatePoll = apiService.createPoll as jest.Mock;
    mockCreatePoll.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    renderCreatePollPage();

    const titleInput = screen.getByLabelText('Título');
    const descriptionInput = screen.getByLabelText('Descrição');
    const option1Input = screen.getByPlaceholderText('Opção 1');
    const option2Input = screen.getByPlaceholderText('Opção 2');

    fireEvent.change(titleInput, { target: { value: 'Título de teste' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Descrição de teste' },
    });
    fireEvent.change(option1Input, { target: { value: 'Opção 1' } });
    fireEvent.change(option2Input, { target: { value: 'Opção 2' } });

    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Criando...')).toBeInTheDocument();
    });
  });

  it('deve mostrar erro quando a criação falha', async () => {
    const mockCreatePoll = apiService.createPoll as jest.Mock;
    mockCreatePoll.mockRejectedValue(new Error('Erro ao criar votação'));

    renderCreatePollPage();

    const titleInput = screen.getByLabelText('Título');
    const descriptionInput = screen.getByLabelText('Descrição');
    const option1Input = screen.getByPlaceholderText('Opção 1');
    const option2Input = screen.getByPlaceholderText('Opção 2');

    fireEvent.change(titleInput, { target: { value: 'Título de teste' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Descrição de teste' },
    });
    fireEvent.change(option1Input, { target: { value: 'Opção 1' } });
    fireEvent.change(option2Input, { target: { value: 'Opção 2' } });

    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao criar votação');
    });
  });

  it('deve redirecionar para login quando não há token', async () => {
    localStorage.removeItem('authToken');

    renderCreatePollPage();

    const titleInput = screen.getByLabelText('Título');
    const descriptionInput = screen.getByLabelText('Descrição');
    const option1Input = screen.getByPlaceholderText('Opção 1');
    const option2Input = screen.getByPlaceholderText('Opção 2');

    fireEvent.change(titleInput, { target: { value: 'Título de teste' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Descrição de teste' },
    });
    fireEvent.change(option1Input, { target: { value: 'Opção 1' } });
    fireEvent.change(option2Input, { target: { value: 'Opção 2' } });

    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Você precisa estar logado para criar uma votação'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
