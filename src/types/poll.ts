export interface User {
  id: string;
  name: string;
  email: string;
}

export interface PollOption {
  id: string;
  text: string;
  votesCount?: number;
  createdAt: string;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  type: 'public' | 'private';
  status: 'OPEN' | 'CLOSED';
  options: PollOption[];
  creator: User;
  totalVotes?: number;
  votedOption?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface CreatePollRequest {
  title: string;
  description: string;
  type: 'public' | 'private';
  options: string[];
}

export interface CreatePollResponse {
  id: string;
  title: string;
  description: string;
  type: 'public' | 'private';
  options: Array<{
    id: string;
    text: string;
    createdAt: string;
  }>;
  creator: User;
  createdAt: string;
  updatedAt: string;
}
