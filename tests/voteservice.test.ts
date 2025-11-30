import { createVote, deleteVote } from '../src/services/voteService';

global.fetch = jest.fn();

describe('voteService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('authToken', 'mock-token');
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('createVote', () => {
    it('deve criar um voto com sucesso', async () => {
      const mockResponse = {
        id: 'vote-123',
        pollId: 'poll-123',
        optionId: 'option-1',
        userId: 'user-1',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await createVote({
        pollId: 'poll-123',
        optionId: 'option-1',
      });

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/v1/polls/poll-123/vote',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-token',
          },
          body: JSON.stringify({ optionId: 'option-1' }),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('deve lançar erro quando não há token', async () => {
      localStorage.removeItem('authToken');

      await expect(
        createVote({
          pollId: 'poll-123',
          optionId: 'option-1',
        })
      ).rejects.toThrow('Authentication required to vote');
    });

    it('deve lançar erro quando a requisição falha', async () => {
      const mockError = {
        message: 'Vote failed',
        statusCode: 400,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      await expect(
        createVote({
          pollId: 'poll-123',
          optionId: 'option-1',
        })
      ).rejects.toEqual(mockError);
    });

    it('deve lançar erro quando usuário já votou', async () => {
      const mockError = {
        message: 'User already voted',
        statusCode: 409,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      await expect(
        createVote({
          pollId: 'poll-123',
          optionId: 'option-1',
        })
      ).rejects.toEqual(mockError);
    });

    it('deve enviar apenas optionId no body', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await createVote({
        pollId: 'poll-123',
        optionId: 'option-1',
      });

      const callArgs = (fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);

      expect(body).toEqual({ optionId: 'option-1' });
      expect(body.pollId).toBeUndefined();
    });
  });

  describe('deleteVote', () => {
    it('deve cancelar um voto com sucesso', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await deleteVote('poll-123');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/v1/polls/poll-123/vote',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-token',
          },
        }
      );
    });

    it('deve lançar erro quando não há token', async () => {
      localStorage.removeItem('authToken');

      await expect(deleteVote('poll-123')).rejects.toThrow(
        'Authentication required to delete vote'
      );
    });

    it('deve lançar erro quando a requisição falha', async () => {
      const mockError = {
        message: 'Delete failed',
        statusCode: 400,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      await expect(deleteVote('poll-123')).rejects.toEqual(mockError);
    });

    it('deve lançar erro quando usuário não votou', async () => {
      const mockError = {
        message: 'User has not voted',
        statusCode: 404,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      await expect(deleteVote('poll-123')).rejects.toEqual(mockError);
    });

    it('deve usar método DELETE', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await deleteVote('poll-123');

      const callArgs = (fetch as jest.Mock).mock.calls[0];
      expect(callArgs[1].method).toBe('DELETE');
    });

    it('não deve enviar body na requisição', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await deleteVote('poll-123');

      const callArgs = (fetch as jest.Mock).mock.calls[0];
      expect(callArgs[1].body).toBeUndefined();
    });
  });

  describe('Autenticação', () => {
    it('createVote deve incluir token no header', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await createVote({
        pollId: 'poll-123',
        optionId: 'option-1',
      });

      const callArgs = (fetch as jest.Mock).mock.calls[0];
      expect(callArgs[1].headers.Authorization).toBe('Bearer mock-token');
    });

    it('deleteVote deve incluir token no header', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await deleteVote('poll-123');

      const callArgs = (fetch as jest.Mock).mock.calls[0];
      expect(callArgs[1].headers.Authorization).toBe('Bearer mock-token');
    });
  });

  describe('Endpoints', () => {
    it('createVote deve usar endpoint correto', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await createVote({
        pollId: 'test-poll-id',
        optionId: 'option-1',
      });

      const callArgs = (fetch as jest.Mock).mock.calls[0];
      expect(callArgs[0]).toBe(
        'http://localhost:5000/v1/polls/test-poll-id/vote'
      );
    });

    it('deleteVote deve usar endpoint correto', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await deleteVote('another-poll-id');

      const callArgs = (fetch as jest.Mock).mock.calls[0];
      expect(callArgs[0]).toBe(
        'http://localhost:5000/v1/polls/another-poll-id/vote'
      );
    });
  });
});
