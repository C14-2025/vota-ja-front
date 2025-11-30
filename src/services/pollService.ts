import type {
  Poll,
  PaginatedResponse,
  CreatePollRequest,
  CreatePollResponse,
} from '../types/poll';
import { API_ENDPOINTS } from '../paths';

const mockPolls: Poll[] = [
  {
    id: '1',
    title: 'Melhor linguagem de programação',
    description: 'Vote na sua linguagem favorita para desenvolvimento web',
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
      {
        id: '3',
        text: 'Python',
        votesCount: 38,
        createdAt: '2025-11-20T10:00:00Z',
      },
      {
        id: '4',
        text: 'Java',
        votesCount: 25,
        createdAt: '2025-11-20T10:00:00Z',
      },
    ],
    creator: { id: '1', name: 'João Silva', email: 'joao@example.com' },
    totalVotes: 170,
    createdAt: '2025-11-20T10:00:00Z',
    updatedAt: '2025-11-29T15:30:00Z',
  },
  {
    id: '2',
    title: 'Próximo destino da viagem da empresa',
    description: 'Escolha o destino para nossa viagem de fim de ano',
    type: 'private',
    options: [
      {
        id: '5',
        text: 'Praia do Rosa - SC',
        votesCount: 12,
        createdAt: '2025-11-21T14:00:00Z',
      },
      {
        id: '6',
        text: 'Gramado - RS',
        votesCount: 18,
        createdAt: '2025-11-21T14:00:00Z',
      },
      {
        id: '7',
        text: 'Bonito - MS',
        votesCount: 8,
        createdAt: '2025-11-21T14:00:00Z',
      },
    ],
    creator: { id: '2', name: 'Maria Santos', email: 'maria@example.com' },
    totalVotes: 38,
    createdAt: '2025-11-21T14:00:00Z',
    updatedAt: '2025-11-28T09:15:00Z',
  },
  {
    id: '3',
    title: 'Horário da reunião semanal',
    description: 'Qual o melhor horário para nossa reunião de equipe?',
    type: 'public',
    options: [
      {
        id: '8',
        text: '9h às 10h',
        votesCount: 15,
        createdAt: '2025-11-22T08:00:00Z',
      },
      {
        id: '9',
        text: '14h às 15h',
        votesCount: 23,
        createdAt: '2025-11-22T08:00:00Z',
      },
      {
        id: '10',
        text: '16h às 17h',
        votesCount: 10,
        createdAt: '2025-11-22T08:00:00Z',
      },
    ],
    creator: { id: '3', name: 'Carlos Oliveira', email: 'carlos@example.com' },
    totalVotes: 48,
    createdAt: '2025-11-22T08:00:00Z',
    updatedAt: '2025-11-29T11:45:00Z',
  },
  {
    id: '4',
    title: 'Framework preferido para frontend',
    description: 'Qual framework devemos usar no próximo projeto?',
    type: 'public',
    options: [
      {
        id: '11',
        text: 'React',
        votesCount: 55,
        createdAt: '2025-11-23T10:30:00Z',
      },
      {
        id: '12',
        text: 'Vue',
        votesCount: 32,
        createdAt: '2025-11-23T10:30:00Z',
      },
      {
        id: '13',
        text: 'Angular',
        votesCount: 18,
        createdAt: '2025-11-23T10:30:00Z',
      },
      {
        id: '14',
        text: 'Svelte',
        votesCount: 12,
        createdAt: '2025-11-23T10:30:00Z',
      },
    ],
    creator: { id: '1', name: 'João Silva', email: 'joao@example.com' },
    totalVotes: 117,
    createdAt: '2025-11-23T10:30:00Z',
    updatedAt: '2025-11-29T16:20:00Z',
  },
  {
    id: '5',
    title: 'Tema da festa de confraternização',
    description: 'Vote no tema para nossa festa de final de ano',
    type: 'private',
    options: [
      {
        id: '15',
        text: 'Anos 80',
        votesCount: 7,
        createdAt: '2025-11-24T13:00:00Z',
      },
      {
        id: '16',
        text: 'Tropical',
        votesCount: 14,
        createdAt: '2025-11-24T13:00:00Z',
      },
      {
        id: '17',
        text: 'Elegante',
        votesCount: 9,
        createdAt: '2025-11-24T13:00:00Z',
      },
    ],
    creator: { id: '2', name: 'Maria Santos', email: 'maria@example.com' },
    totalVotes: 30,
    createdAt: '2025-11-24T13:00:00Z',
    updatedAt: '2025-11-29T10:00:00Z',
  },
];

export async function getPolls(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Poll>> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = mockPolls.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    meta: {
      itemCount: paginatedItems.length,
      totalItems: mockPolls.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(mockPolls.length / limit),
      currentPage: page,
    },
  };
}

export async function getPollById(id: string, token?: string): Promise<Poll> {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(API_ENDPOINTS.POLLS.BY_ID(id), { headers });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}

export async function createPoll(
  data: CreatePollRequest
): Promise<CreatePollResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newPoll: CreatePollResponse = {
    id: Math.random().toString(36).substring(7),
    title: data.title,
    description: data.description,
    type: data.type,
    options: data.options.map((opt, index) => ({
      id: (index + 1).toString(),
      text: opt,
      createdAt: new Date().toISOString(),
    })),
    creator: {
      id: '1',
      name: 'Usuário Mock',
      email: 'usuario@example.com',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return newPoll;
}
