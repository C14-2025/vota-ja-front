import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../src/pages/Home/HomePage';
import { AuthContext } from '../src/contexts/AuthContext';
import * as apiService from '../src/services/api';
import type { Poll, PaginatedResponse } from '../src/types/poll';

jest.mock('../src/services/api');

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
  login: jest.fn(),
  logout: jest.fn(),
};

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContextValue}>
        <HomePage />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiService.getPolls as jest.Mock).mockResolvedValue(mockPaginatedResponse);
  });

  describe('Renderização inicial', () => {
    it('deve renderizar o cabeçalho corretamente', async () => {
      renderHomePage();

      expect(
        screen.getByText('HOME (Listagem de Votações)')
      ).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('deve renderizar a barra de busca e botões', async () => {
      renderHomePage();

      expect(
        screen.getByPlaceholderText('Buscar votações...')
      ).toBeInTheDocument();
      expect(screen.getByText('Pesquisar')).toBeInTheDocument();
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
      expect(apiService.getPolls).toHaveBeenCalledWith(1, 10);
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
      expect(screen.getByText('107 votos')).toBeInTheDocument();
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

      expect(apiService.getPolls).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        expect(apiService.getPolls).toHaveBeenCalledTimes(2);
      });

      jest.useRealTimers();
    });

    it('deve buscar ao clicar no botão Pesquisar', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(
          screen.getByText('Melhor linguagem de programação')
        ).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Buscar votações...');
      fireEvent.change(searchInput, { target: { value: 'teste' } });
      fireEvent.click(screen.getByText('Pesquisar'));

      await waitFor(() => {
        expect(apiService.getPolls).toHaveBeenCalledTimes(2);
      });
    });

    it('deve buscar ao pressionar Enter', async () => {
      renderHomePage();

      await waitFor(() => {
        expect(
          screen.getByText('Melhor linguagem de programação')
        ).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Buscar votações...');
      fireEvent.change(searchInput, { target: { value: 'teste' } });
      fireEvent.keyDown(searchInput, { key: 'Enter' });

      await waitFor(() => {
        expect(apiService.getPolls).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Estado vazio', () => {
    it('deve exibir mensagem quando não há votações', async () => {
      (apiService.getPolls as jest.Mock).mockResolvedValue({
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

      (apiService.getPolls as jest.Mock).mockResolvedValue({
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
      fireEvent.click(screen.getByText('Pesquisar'));

      await waitFor(() => {
        expect(
          screen.getByText('Tente buscar por outros termos')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Tratamento de erros', () => {
    it('deve exibir mensagem de erro quando a API falhar', async () => {
      (apiService.getPolls as jest.Mock).mockRejectedValue(
        new Error('API Error')
      );

      renderHomePage();

      await waitFor(() => {
        expect(
          screen.getByText('Erro ao carregar votações. Tente novamente.')
        ).toBeInTheDocument();
      });

      expect(screen.getByText('Tentar Novamente')).toBeInTheDocument();
    });

    it('deve tentar recarregar ao clicar em "Tentar Novamente"', async () => {
      (apiService.getPolls as jest.Mock).mockRejectedValueOnce(
        new Error('API Error')
      );

      renderHomePage();

      await waitFor(() => {
        expect(
          screen.getByText('Erro ao carregar votações. Tente novamente.')
        ).toBeInTheDocument();
      });

      (apiService.getPolls as jest.Mock).mockResolvedValue(
        mockPaginatedResponse
      );

      fireEvent.click(screen.getByText('Tentar Novamente'));

      await waitFor(() => {
        expect(
          screen.getByText('Melhor linguagem de programação')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Paginação', () => {
    it('deve exibir paginação quando há múltiplas páginas', async () => {
      (apiService.getPolls as jest.Mock).mockResolvedValue({
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
      (apiService.getPolls as jest.Mock).mockResolvedValue({
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
      (apiService.getPolls as jest.Mock).mockResolvedValue({
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
        expect(apiService.getPolls).toHaveBeenCalledWith(2, 10);
      });
    });
  });
});
