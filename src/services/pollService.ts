import type {
  Poll,
  PaginatedResponse,
  CreatePollRequest,
  CreatePollResponse,
} from '../types/poll';
import { API_ENDPOINTS } from '../paths';

export async function getPolls(
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<PaginatedResponse<Poll>> {
  const token = localStorage.getItem('authToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search && search.trim()) {
    searchParams.append('search', search.trim());
  }

  const url = `${API_ENDPOINTS.POLLS.LIST}?${searchParams.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}

export async function getPollById(id: string, token?: string): Promise<Poll> {
  const authToken = token || localStorage.getItem('authToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(API_ENDPOINTS.POLLS.BY_ID(id), {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}

export async function createPoll(
  data: CreatePollRequest
): Promise<CreatePollResponse> {
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('Authentication required to create a poll');
  }

  const response = await fetch(API_ENDPOINTS.POLLS.CREATE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}
