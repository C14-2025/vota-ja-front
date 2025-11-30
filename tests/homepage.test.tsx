import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../src/pages/Home/HomePage';
import { AuthContext } from '../src/contexts/AuthContext';
import * as pollService from '../src/services/pollService';
import type { Poll, PaginatedResponse } from '../src/types/poll';

jest.mock('../src/services/pollService');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockPolls: Poll[] = [
  {
    id: '1',
    title: 'Melhor linguagem de programação',
    description: 'Vote na sua linguagem favorita',
    type: 'public',
    options: [
      {
        id: '1',
        text: 'JavaScript',
        votesCount: 45,
        createdAt: '2025-11-20T10:00:00Z',
      },
      {
        id: '2',
        text: 'TypeScript',
        votesCount: 62,
        createdAt: '2025-11-20T10:00:00Z',
      },
    ],
    creator: { id: '1', name: 'João Silva', email: 'joao@example.com' },
    totalVotes: 107,
    status: 'OPEN' as const,
    votedOption: null,
    createdAt: '2025-11-20T10:00:00Z',
    updatedAt: '2025-11-29T15:30:00Z',
  },
  {
    id: '2',
    title: 'Próximo destino da viagem',
    description: 'Escolha o destino para nossa viagem',
    type: 'private',
    options: [
      {
        id: '3',
        text: 'Praia do Rosa',
        votesCount: 12,
        createdAt: '2025-11-21T14:00:00Z',
      },
    ],
    creator: { id: '2', name: 'Maria Santos', email: 'maria@example.com' },
    totalVotes: 12,
    status: 'OPEN' as const,
    votedOption: null,
    createdAt: '2025-11-21T14:00:00Z',
    updatedAt: '2025-11-28T09:15:00Z',
  },
];

const mockPaginatedResponse: PaginatedResponse<Poll> = {
  items: mockPolls,
  meta: {
    itemCount: 2,
    totalItems: 2,
    itemsPerPage: 10,
    totalPages: 1,
    currentPage: 1,
  },
};

const mockAuthContextValue = {
  isAuthenticated: true,
  userId: '1',
  login: jest.fn(),
  logout: jest.fn(),
};

const mockUnauthenticatedContextValue = {
  isAuthenticated: false,
  userId: null,
  login: jest.fn(),
  logout: jest.fn(),
};

const renderHomePage = (authenticated = true) => {
  const contextValue = authenticated
    ? mockAuthContextValue
    : mockUnauthenticatedContextValue;

  return render(
    <BrowserRouter>
      <AuthContext.Provider value={contextValue}>
        <HomePage />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (pollService.getPolls as jest.Mock).mockResolvedValue(
      mockPaginatedResponse
    );
  });

  describe('Renderização inicial', () => {
    it('deve renderizar o cabeçalho corretamente', async () => {
      renderHomePage();

      expect(
        screen.getByText('HOME (Listagem de Votações)')
      ).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('deve renderizar a barra de busca e botões', () => {
      renderHomePage();

      expect(
        screen.getByPlaceholderText('Buscar votações...')
      ).toBeInTheDocument();
      expect(screen.getByText('Nova Votação')).toBeInTheDocument();
    });

    it('deve mostrar loading inicialmente', () => {
      renderHomePage();

      expect(screen.getByText('Carregando votações...')).toBeInTheDocument();
    });

    it('deve carregar e exibir as votações', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(
          screen.getByText('Melhor linguagem de programação')
        ).toBeInTheDocument();
      });

      expect(screen.getByText('Próximo destino da viagem')).toBeInTheDocument();
      expect(pollService.getPolls).toHaveBeenCalledWith(1, 10, '');
    });
  });

  describe('Exibição dos cards de votação', () => {
    it('deve exibir informações corretas do poll', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(
          screen.getByText('Melhor linguagem de programação')
        ).toBeInTheDocument();
      });

      expect(
        screen.getByText('Vote na sua linguagem favorita')
      ).toBeInTheDocument();
      expect(screen.getByText('2 opções')).toBeInTheDocument();
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Pública')).toBeInTheDocument();
    });

    it('deve exibir badge de tipo correto (público/privado)', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('Pública')).toBeInTheDocument();
      });

      expect(screen.getByText('Privada')).toBeInTheDocument();
    });

    it('deve exibir a data formatada corretamente', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('20/11/2025')).toBeInTheDocument();
      });

      expect(screen.getByText('21/11/2025')).toBeInTheDocument();
    });
  });

  describe('Navegação', () => {
    it('deve navegar para criação de poll ao clicar em "Nova Votação"', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('Nova Votação')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Nova Votação'));
      expect(mockNavigate).toHaveBeenCalledWith('/polls/create');
    });

    it('deve navegar para detalhes do poll ao clicar no card', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(
          screen.getByText('Melhor linguagem de programação')
        ).toBeInTheDocument();
      });

      const pollCard = screen
        .getByText('Melhor linguagem de programação')
        .closest('div');
      fireEvent.click(pollCard!);

      expect(mockNavigate).toHaveBeenCalledWith('/polls/1');
    });

    it('deve fazer logout e redirecionar ao clicar em Logout', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('Logout')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Logout'));

      expect(mockAuthContextValue.logout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('Busca', () => {
    it('deve permitir digitar no campo de busca', async () => {
      renderHomePage();

      const searchInput = screen.getByPlaceholderText('Buscar votações...');
      fireEvent.change(searchInput, { target: { value: 'linguagem' } });

      expect(searchInput).toHaveValue('linguagem');
    });

    it('deve aplicar debounce na busca automática', async () => {
      jest.useFakeTimers();
      renderHomePage();

      await waitFor(() => {
        expect(
          screen.getByText('Melhor linguagem de programação')
        ).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Buscar votações...');
      fireEvent.change(searchInput, { target: { value: 'viagem' } });

      expect(pollService.getPolls).toHaveBeenCalledTimes(1);

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(pollService.getPolls).toHaveBeenCalledTimes(2);
      });

      jest.useRealTimers();
    });

    it('deve buscar após digitar (com debounce)', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(
          screen.getByText('Melhor linguagem de programação')
        ).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Buscar votações...');
      fireEvent.change(searchInput, { target: { value: 'teste' } });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(pollService.getPolls).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Estado vazio', () => {
    it('deve exibir mensagem quando não há votações', async () => {
      (pollService.getPolls as jest.Mock).mockResolvedValue({
        items: [],
        meta: {
          itemCount: 0,
          totalItems: 0,
          itemsPerPage: 10,
          totalPages: 0,
          currentPage: 1,
        },
      });

      renderHomePage();

      await waitFor(() => {
        expect(
          screen.getByText('Nenhuma votação encontrada')
        ).toBeInTheDocument();
      });

      expect(
        screen.getByText('Crie sua primeira votação para começar')
      ).toBeInTheDocument();
    });

    it('deve exibir mensagem de busca vazia quando não encontrar resultados', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(
          screen.getByText('Melhor linguagem de programação')
        ).toBeInTheDocument();
      });

      (pollService.getPolls as jest.Mock).mockResolvedValue({
        items: [],
        meta: {
          itemCount: 0,
          totalItems: 0,
          itemsPerPage: 10,
          totalPages: 0,
          currentPage: 1,
        },
      });

      const searchInput = screen.getByPlaceholderText('Buscar votações...');
      fireEvent.change(searchInput, { target: { value: 'inexistente' } });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(
          screen.getByText('Tente buscar por outros termos')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Tratamento de erros', () => {
    it('deve exibir toast de erro quando a API falhar', async () => {
      (pollService.getPolls as jest.Mock).mockRejectedValue(
        new Error('API Error')
      );

      renderHomePage();

      await waitFor(() => {
        expect(
          screen.getByText('Nenhuma votação encontrada')
        ).toBeInTheDocument();
      });

      expect(
        screen.getByText('Crie sua primeira votação para começar')
      ).toBeInTheDocument();
    });

    it('deve limpar lista de polls quando API falhar', async () => {
      (pollService.getPolls as jest.Mock).mockRejectedValueOnce(
        new Error('API Error')
      );

      renderHomePage();

      await waitFor(() => {
        expect(
          screen.getByText('Nenhuma votação encontrada')
        ).toBeInTheDocument();
      });

      expect(
        screen.queryByText('Melhor linguagem de programação')
      ).not.toBeInTheDocument();
    });
  });

  describe('Paginação', () => {
    it('deve exibir paginação quando há múltiplas páginas', async () => {
      (pollService.getPolls as jest.Mock).mockResolvedValue({
        ...mockPaginatedResponse,
        meta: {
          ...mockPaginatedResponse.meta,
          totalPages: 3,
        },
      });

      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('Página 1 de 3')).toBeInTheDocument();
      });

      expect(screen.getByText('Anterior')).toBeInTheDocument();
      expect(screen.getByText('Próxima')).toBeInTheDocument();
    });

    it('não deve exibir paginação quando há apenas uma página', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(
          screen.getByText('Melhor linguagem de programação')
        ).toBeInTheDocument();
      });

      expect(screen.queryByText('Anterior')).not.toBeInTheDocument();
      expect(screen.queryByText('Próxima')).not.toBeInTheDocument();
    });

    it('deve desabilitar botão Anterior na primeira página', async () => {
      (pollService.getPolls as jest.Mock).mockResolvedValue({
        ...mockPaginatedResponse,
        meta: {
          ...mockPaginatedResponse.meta,
          totalPages: 3,
        },
      });

      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('Anterior')).toBeInTheDocument();
      });

      const anteriorButton = screen.getByText('Anterior');
      expect(anteriorButton).toBeDisabled();
    });

    it('deve navegar para próxima página ao clicar em Próxima', async () => {
      (pollService.getPolls as jest.Mock).mockResolvedValue({
        ...mockPaginatedResponse,
        meta: {
          ...mockPaginatedResponse.meta,
          totalPages: 3,
        },
      });

      renderHomePage();

      await waitFor(() => {
        expect(screen.getByText('Próxima')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Próxima'));

      await waitFor(() => {
        expect(pollService.getPolls).toHaveBeenCalledWith(2, 10, '');
      });
    });
  });

  describe('Modo Público (Não Autenticado)', () => {
    it('deve renderizar botões Entrar e Cadastrar quando não logado', async () => {
      renderHomePage(false);

      await waitFor(() => {
        expect(screen.getByText('Entrar')).toBeInTheDocument();
      });

      expect(screen.getByText('Cadastrar')).toBeInTheDocument();
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });

    it('não deve mostrar botão Nova Votação quando não logado', async () => {
      renderHomePage(false);

      await waitFor(() => {
        expect(
          screen.getByText('Melhor linguagem de programação')
        ).toBeInTheDocument();
      });

      expect(screen.queryByText('Nova Votação')).not.toBeInTheDocument();
    });

    it('deve mostrar botão Fazer Login no estado vazio quando não logado', async () => {
      (pollService.getPolls as jest.Mock).mockResolvedValue({
        items: [],
        meta: {
          itemCount: 0,
          totalItems: 0,
          itemsPerPage: 10,
          totalPages: 0,
          currentPage: 1,
        },
      });

      renderHomePage(false);

      await waitFor(() => {
        expect(
          screen.getByText('Faça login para criar votações')
        ).toBeInTheDocument();
      });

      expect(screen.getByText('Fazer Login')).toBeInTheDocument();
      expect(screen.queryByText('Criar Votação')).not.toBeInTheDocument();
    });

    it('deve navegar para login ao clicar em Entrar', async () => {
      renderHomePage(false);

      await waitFor(() => {
        expect(screen.getByText('Entrar')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Entrar'));
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('deve navegar para registro ao clicar em Cadastrar', async () => {
      renderHomePage(false);

      await waitFor(() => {
        expect(screen.getByText('Cadastrar')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Cadastrar'));
      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });

    it('deve permitir visualizar polls sem estar logado', async () => {
      renderHomePage(false);

      await waitFor(() => {
        expect(
          screen.getByText('Melhor linguagem de programação')
        ).toBeInTheDocument();
      });

      expect(screen.getByText('Próximo destino da viagem')).toBeInTheDocument();
    });
  });

  describe('Encerrar votação', () => {
    it('deve exibir botão "Encerrar" para o criador da votação', async () => {
      const mockAuthWithUserId = {
        ...mockAuthContextValue,
        userId: '1',
      };

      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuthWithUserId}>
            <HomePage />
          </AuthContext.Provider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText('Encerrar')[0]).toBeInTheDocument();
      });
    });

    it('não deve exibir botão "Encerrar" para votações de outros usuários', async () => {
      const mockAuthWithDifferentUserId = {
        ...mockAuthContextValue,
        userId: '999',
      };

      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuthWithDifferentUserId}>
            <HomePage />
          </AuthContext.Provider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText('Melhor linguagem de programação')
        ).toBeInTheDocument();
      });

      expect(screen.queryByText('Encerrar')).not.toBeInTheDocument();
    });

    it('não deve exibir botão "Encerrar" para votações já encerradas', async () => {
      const closedPoll = {
        ...mockPolls[0],
        status: 'CLOSED' as const,
      };

      (pollService.getPolls as jest.Mock).mockResolvedValue({
        items: [closedPoll],
        meta: {
          itemCount: 1,
          totalItems: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      });

      const mockAuthWithUserId = {
        ...mockAuthContextValue,
        userId: '1',
      };

      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuthWithUserId}>
            <HomePage />
          </AuthContext.Provider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Encerrada')).toBeInTheDocument();
      });

      expect(screen.queryByText('Encerrar')).not.toBeInTheDocument();
    });

    it('deve encerrar votação ao clicar no botão', async () => {
      (pollService.closePoll as jest.Mock).mockResolvedValue(null);

      const mockAuthWithUserId = {
        ...mockAuthContextValue,
        userId: '1',
      };

      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuthWithUserId}>
            <HomePage />
          </AuthContext.Provider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText('Encerrar')[0]).toBeInTheDocument();
      });

      fireEvent.click(screen.getAllByText('Encerrar')[0]);

      await waitFor(() => {
        expect(pollService.closePoll).toHaveBeenCalled();
      });
    });

    it('deve recarregar lista após encerrar votação', async () => {
      (pollService.closePoll as jest.Mock).mockResolvedValue(null);

      const mockAuthWithUserId = {
        ...mockAuthContextValue,
        userId: '1',
      };

      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuthWithUserId}>
            <HomePage />
          </AuthContext.Provider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText('Encerrar')[0]).toBeInTheDocument();
      });

      const initialCallCount = (pollService.getPolls as jest.Mock).mock.calls
        .length;

      fireEvent.click(screen.getAllByText('Encerrar')[0]);

      await waitFor(() => {
        expect((pollService.getPolls as jest.Mock).mock.calls.length).toBe(
          initialCallCount + 1
        );
      });
    });

    it('não deve navegar para detalhes ao clicar no botão encerrar', async () => {
      const mockAuthWithUserId = {
        ...mockAuthContextValue,
        userId: '1',
      };

      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuthWithUserId}>
            <HomePage />
          </AuthContext.Provider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText('Encerrar')[0]).toBeInTheDocument();
      });

      fireEvent.click(screen.getAllByText('Encerrar')[0]);

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
