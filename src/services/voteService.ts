import type { CreateVoteRequest, CreateVoteResponse } from '../types/vote';
import { API_ENDPOINTS } from '../paths';

export async function createVote(
  data: CreateVoteRequest
): Promise<CreateVoteResponse> {
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('Authentication required to vote');
  }

  const response = await fetch(API_ENDPOINTS.VOTES.CREATE(data.pollId), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ optionId: data.optionId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}

export async function deleteVote(pollId: string): Promise<void> {
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('Authentication required to delete vote');
  }

  const response = await fetch(API_ENDPOINTS.VOTES.DELETE(pollId), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
}
