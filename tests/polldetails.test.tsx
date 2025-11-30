import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { PollDetailsPage } from '../src/pages/PollDetails/PollDetailsPage';
import { AuthContext } from '../src/contexts/AuthContext';
import * as pollService from '../src/services/pollService';
import * as voteService from '../src/services/voteService';
import type { Poll } from '../src/types/poll';

jest.mock('../src/services/pollService');
jest.mock('../src/services/voteService');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: 'poll-123' }),
}));

const mockPoll: Poll = {
  id: 'poll-123',
  title: 'Melhor linguagem de programação',
  description: 'Vote na sua linguagem favorita',
  type: 'public',
  status: 'OPEN',
  options: [
    {
      id: 'option-1',
      text: 'JavaScript',
      votesCount: 45,
      createdAt: '2025-11-20T10:00:00Z',
    },
    {
      id: 'option-2',
      text: 'TypeScript',
      votesCount: 62,
      createdAt: '2025-11-20T10:00:00Z',
    },
    {
      id: 'option-3',
      text: 'Python',
      votesCount: 38,
      createdAt: '2025-11-20T10:00:00Z',
    },
  ],
  creator: { id: 'user-1', name: 'João Silva', email: 'joao@example.com' },
  totalVotes: 145,
  votedOption: null,
  createdAt: '2025-11-20T10:00:00Z',
  updatedAt: '2025-11-29T15:30:00Z',
};

const mockAuthContextValue = {
  isAuthenticated: true,
  userId: 'user-1',
  login: jest.fn(),
  logout: jest.fn(),
};

const mockUnauthenticatedContextValue = {
  isAuthenticated: false,
  userId: null,
  login: jest.fn(),
  logout: jest.fn(),
};

const renderPollDetailsPage = (authenticated = true, userId = 'user-1') => {
  const contextValue = authenticated
    ? { ...mockAuthContextValue, userId }
    : mockUnauthenticatedContextValue;

  return render(
    <BrowserRouter>
      <AuthContext.Provider value={contextValue}>
        <PollDetailsPage />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('PollDetailsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (pollService.getPollById as jest.Mock).mockResolvedValue(mockPoll);
  });

  describe('Renderização inicial', () => {
    it('deve exibir loading inicialmente', () => {
      renderPollDetailsPage();
      expect(screen.getByText('Carregando votação...')).toBeInTheDocument();
    });

    it('deve carregar e exibir detalhes da votação', async () => {
      renderPollDetailsPage();

      await waitFor(() => {
        expect(
          screen.getByText('Melhor linguagem de programação')
        ).toBeInTheDocument();
      });

      expect(
        screen.getByText('Vote na sua linguagem favorita')
      ).toBeInTheDocument();
      expect(screen.getByText('Pública')).toBeInTheDocument();
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(pollService.getPollById).toHaveBeenCalledWith('poll-123');
    });

    it('deve exibir todas as opções de voto', async () => {
      renderPollDetailsPage();

      await waitFor(() => {
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
      });

      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
    });

    it('deve exibir total de votos', async () => {
      renderPollDetailsPage();

      await waitFor(() => {
        expect(screen.getByText('145')).toBeInTheDocument();
      });

      expect(screen.getByText('votos')).toBeInTheDocument();
    });

    it('deve exibir porcentagens de votos', async () => {
      renderPollDetailsPage();

      await waitFor(() => {
        expect(screen.getByText('31%')).toBeInTheDocument(); // JavaScript
      });

      expect(screen.getByText('43%')).toBeInTheDocument(); // TypeScript
      expect(screen.getByText('26%')).toBeInTheDocument(); // Python
    });
  });

  describe('Status da votação', () => {
    it('deve exibir badge "Pública" para votações públicas', async () => {
      renderPollDetailsPage();

      await waitFor(() => {
        expect(screen.getByText('Pública')).toBeInTheDocument();
      });
    });

    it('deve exibir badge "Privada" para votações privadas', async () => {
      (pollService.getPollById as jest.Mock).mockResolvedValue({
        ...mockPoll,
        type: 'private',
      });

      renderPollDetailsPage();

      await waitFor(() => {
        expect(screen.getByText('Privada')).toBeInTheDocument();
      });
    });

    it('deve exibir badge "Encerrada" para votações fechadas', async () => {
      (pollService.getPollById as jest.Mock).mockResolvedValue({
        ...mockPoll,
        status: 'CLOSED',
      });

      renderPollDetailsPage();

      await waitFor(() => {
        expect(screen.getByText('Encerrada')).toBeInTheDocument();
      });
    });

    it('deve exibir mensagem quando votação está encerrada', async () => {
      (pollService.getPollById as jest.Mock).mockResolvedValue({
        ...mockPoll,
        status: 'CLOSED',
      });

      renderPollDetailsPage();

      await waitFor(() => {
        expect(
          screen.getByText('Esta votação foi encerrada e não aceita mais votos')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Autenticação e permissões', () => {
    it('deve exibir prompt de login para usuários não autenticados', async () => {
      renderPollDetailsPage(false);

      await waitFor(() => {
        expect(
          screen.getByText('Faça login para votar nesta votação')
        ).toBeInTheDocument();
      });

      expect(screen.getByText('Fazer Login')).toBeInTheDocument();
    });

    it('deve redirecionar para login ao clicar no botão', async () => {
      renderPollDetailsPage(false);

      await waitFor(() => {
        expect(screen.getByText('Fazer Login')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Fazer Login'));
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('não deve exibir botão "Encerrar" para não criadores', async () => {
      renderPollDetailsPage(true, 'other-user');

      await waitFor(() => {
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
      });

      expect(screen.queryByText('Encerrar')).not.toBeInTheDocument();
    });

    it('deve exibir botão "Encerrar" para o criador', async () => {
      renderPollDetailsPage(true, 'user-1');

      await waitFor(() => {
        expect(screen.getByText('Encerrar')).toBeInTheDocument();
      });
    });

    it('não deve exibir botão "Encerrar" se votação já está fechada', async () => {
      (pollService.getPollById as jest.Mock).mockResolvedValue({
        ...mockPoll,
        status: 'CLOSED',
      });

      renderPollDetailsPage(true, 'user-1');

      await waitFor(() => {
        expect(screen.getByText('Encerrada')).toBeInTheDocument();
      });

      expect(screen.queryByText('Encerrar')).not.toBeInTheDocument();
    });
  });

  describe('Votação', () => {
    it('deve permitir selecionar uma opção', async () => {
      renderPollDetailsPage();

      await waitFor(() => {
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
      });

      const option = screen.getByText('JavaScript').closest('div');
      fireEvent.click(option!);

      expect(screen.getByText('Confirmar Voto')).not.toBeDisabled();
    });

    it('deve registrar voto ao clicar em "Confirmar Voto"', async () => {
      (voteService.createVote as jest.Mock).mockResolvedValue({
        success: true,
      });

      renderPollDetailsPage();

      await waitFor(() => {
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
      });

      // Selecionar opção
      const option = screen.getByText('JavaScript').closest('div');
      fireEvent.click(option!);

      // Confirmar voto
      const voteButton = screen.getByText('Confirmar Voto');
      fireEvent.click(voteButton);

      await waitFor(() => {
        expect(voteService.createVote).toHaveBeenCalledWith({
          pollId: 'poll-123',
          optionId: 'option-1',
        });
      });
    });

    it('deve exibir botão "Cancelar Voto" após votar', async () => {
      (pollService.getPollById as jest.Mock).mockResolvedValue({
        ...mockPoll,
        votedOption: 'option-1',
      });

      renderPollDetailsPage();

      await waitFor(() => {
        expect(screen.getByText('Cancelar Voto')).toBeInTheDocument();
      });
    });

    it('deve cancelar voto ao clicar em "Cancelar Voto"', async () => {
      (pollService.getPollById as jest.Mock).mockResolvedValue({
        ...mockPoll,
        votedOption: 'option-1',
      });
      (voteService.deleteVote as jest.Mock).mockResolvedValue({
        success: true,
      });

      renderPollDetailsPage();

      await waitFor(() => {
        expect(screen.getByText('Cancelar Voto')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Cancelar Voto'));

      await waitFor(() => {
        expect(voteService.deleteVote).toHaveBeenCalledWith('poll-123');
      });
    });

    it('não deve permitir votar em votação encerrada', async () => {
      (pollService.getPollById as jest.Mock).mockResolvedValue({
        ...mockPoll,
        status: 'CLOSED',
      });

      renderPollDetailsPage();

      await waitFor(() => {
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
      });

      const option = screen.getByText('JavaScript').closest('div');
      expect(option).not.toHaveClass('interactive');
    });

    it('deve destacar opção votada pelo usuário', async () => {
      (pollService.getPollById as jest.Mock).mockResolvedValue({
        ...mockPoll,
        votedOption: 'option-2',
      });

      renderPollDetailsPage();

      await waitFor(() => {
        // Verifies the TypeScript option is rendered
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        // Verifies the cancel vote button is shown (meaning user has voted)
        expect(screen.getByText('Cancelar Voto')).toBeInTheDocument();
      });
    });
  });

  describe('Encerrar votação', () => {
    it('deve encerrar votação ao clicar em "Encerrar"', async () => {
      (pollService.closePoll as jest.Mock).mockResolvedValue({
        ...mockPoll,
        status: 'CLOSED',
      });

      renderPollDetailsPage(true, 'user-1');

      await waitFor(() => {
        expect(screen.getByText('Encerrar')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Encerrar'));

      await waitFor(() => {
        expect(pollService.closePoll).toHaveBeenCalledWith('poll-123');
      });
    });

    it('deve recarregar votação após encerrar', async () => {
      (pollService.closePoll as jest.Mock).mockResolvedValue(null);
      (pollService.getPollById as jest.Mock)
        .mockResolvedValueOnce(mockPoll)
        .mockResolvedValueOnce({ ...mockPoll, status: 'CLOSED' });

      renderPollDetailsPage(true, 'user-1');

      await waitFor(() => {
        expect(screen.getByText('Encerrar')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Encerrar'));

      await waitFor(() => {
        expect(pollService.getPollById).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Navegação', () => {
    it('deve voltar para home ao clicar em "Voltar"', async () => {
      renderPollDetailsPage();

      await waitFor(() => {
        expect(screen.getByText('Voltar')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Voltar'));
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  describe('Tratamento de erros', () => {
    it('deve exibir mensagem de erro quando votação não é encontrada', async () => {
      (pollService.getPollById as jest.Mock).mockRejectedValue(
        new Error('Poll not found')
      );

      renderPollDetailsPage();

      await waitFor(() => {
        expect(screen.getByText('Votação não encontrada')).toBeInTheDocument();
      });
    });

    it('deve lidar com erro ao votar', async () => {
      (voteService.createVote as jest.Mock).mockRejectedValue(
        new Error('Vote failed')
      );

      renderPollDetailsPage();

      await waitFor(() => {
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
      });

      const option = screen.getByText('JavaScript').closest('div');
      fireEvent.click(option!);
      fireEvent.click(screen.getByText('Confirmar Voto'));

      await waitFor(() => {
        expect(voteService.createVote).toHaveBeenCalled();
      });
    });

    it('deve lidar com erro ao cancelar voto', async () => {
      (pollService.getPollById as jest.Mock).mockResolvedValue({
        ...mockPoll,
        votedOption: 'option-1',
      });
      (voteService.deleteVote as jest.Mock).mockRejectedValue(
        new Error('Cancel failed')
      );

      renderPollDetailsPage();

      await waitFor(() => {
        expect(screen.getByText('Cancelar Voto')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Cancelar Voto'));

      await waitFor(() => {
        expect(voteService.deleteVote).toHaveBeenCalled();
      });
    });

    it('deve lidar com erro ao encerrar votação', async () => {
      (pollService.closePoll as jest.Mock).mockRejectedValue(
        new Error('Close failed')
      );

      renderPollDetailsPage(true, 'user-1');

      await waitFor(() => {
        expect(screen.getByText('Encerrar')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Encerrar'));

      await waitFor(() => {
        expect(pollService.closePoll).toHaveBeenCalled();
      });
    });
  });

  describe('Estados de loading', () => {
    it('deve exibir "Registrando voto..." durante votação', async () => {
      (voteService.createVote as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      renderPollDetailsPage();

      await waitFor(() => {
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
      });

      const option = screen.getByText('JavaScript').closest('div');
      fireEvent.click(option!);
      fireEvent.click(screen.getByText('Confirmar Voto'));

      expect(screen.getByText('Registrando voto...')).toBeInTheDocument();
    });

    it('deve exibir "Cancelando..." durante cancelamento', async () => {
      (pollService.getPollById as jest.Mock).mockResolvedValue({
        ...mockPoll,
        votedOption: 'option-1',
      });
      (voteService.deleteVote as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      renderPollDetailsPage();

      await waitFor(() => {
        expect(screen.getByText('Cancelar Voto')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Cancelar Voto'));

      expect(screen.getByText('Cancelando...')).toBeInTheDocument();
    });

    it('deve exibir "Encerrando..." durante encerramento', async () => {
      (pollService.closePoll as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      renderPollDetailsPage(true, 'user-1');

      await waitFor(() => {
        expect(screen.getByText('Encerrar')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Encerrar'));

      expect(screen.getByText('Encerrando...')).toBeInTheDocument();
    });
  });
});
