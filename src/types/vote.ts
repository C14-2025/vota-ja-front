export interface Vote {
  id: string;
  userId: string;
  pollId: string;
  optionId: string;
  createdAt: string;
}

export interface CreateVoteRequest {
  pollId: string;
  optionId: string;
}

export interface CreateVoteResponse {
  id: string;
  userId: string;
  pollId: string;
  optionId: string;
  createdAt: string;
}
