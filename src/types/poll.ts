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
  options: PollOption[];
  creator: User;
  totalVotes?: number;
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
