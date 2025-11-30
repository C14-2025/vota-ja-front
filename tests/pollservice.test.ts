import { getPolls, getPollById, createPoll } from '../src/services/pollService';
import { API_ENDPOINTS } from '../src/paths';

// Mock global fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('pollService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  describe('getPolls', () => {
    it('should fetch polls with default pagination', async () => {
      const mockResponse = {
        items: [
          {
            id: '1',
            title: 'Test Poll',
            description: 'Test Description',
            type: 'public',
            options: [],
            creator: { id: '1', name: 'Test', email: 'test@test.com' },
            totalVotes: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        meta: {
          itemCount: 1,
          totalItems: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getPolls();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_ENDPOINTS.POLLS.LIST}?page=1&limit=10`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch polls with custom pagination and search', async () => {
      const mockResponse = {
        items: [],
        meta: {
          itemCount: 0,
          totalItems: 0,
          itemsPerPage: 20,
          totalPages: 0,
          currentPage: 2,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await getPolls(2, 20, 'test search');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_ENDPOINTS.POLLS.LIST}?page=2&limit=20&search=test+search`,
        expect.any(Object)
      );
    });

    it('should include Authorization header when token exists', async () => {
      localStorageMock.setItem('authToken', 'test-token');

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [], meta: {} }),
      });

      await getPolls();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('should work without Authorization header when no token exists', async () => {
      localStorageMock.clear();

      const mockResponse = {
        items: [],
        meta: {
          itemCount: 0,
          totalItems: 0,
          itemsPerPage: 10,
          totalPages: 0,
          currentPage: 1,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getPolls();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.anything(),
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when response is not ok', async () => {
      const mockError = {
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Server error',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      await expect(getPolls()).rejects.toEqual(mockError);
    });
  });

  describe('getPollById', () => {
    it('should fetch poll by id', async () => {
      const mockPoll = {
        id: '123',
        title: 'Test Poll',
        description: 'Test Description',
        type: 'public',
        options: [],
        creator: { id: '1', name: 'Test', email: 'test@test.com' },
        totalVotes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPoll,
      });

      const result = await getPollById('123');

      expect(global.fetch).toHaveBeenCalledWith(
        API_ENDPOINTS.POLLS.BY_ID('123'),
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(mockPoll);
    });

    it('should use provided token', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await getPollById('123', 'custom-token');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer custom-token',
          }),
        })
      );
    });

    it('should work without token for public polls', async () => {
      localStorageMock.clear();

      const mockPoll = {
        id: '123',
        title: 'Public Poll',
        description: 'Public Description',
        type: 'public',
        options: [],
        creator: { id: '1', name: 'Test', email: 'test@test.com' },
        totalVotes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPoll,
      });

      const result = await getPollById('123');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.anything(),
          }),
        })
      );
      expect(result).toEqual(mockPoll);
    });

    it('should throw error when poll not found', async () => {
      const mockError = {
        statusCode: 404,
        error: 'Not Found',
        message: 'Poll not found',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      await expect(getPollById('999')).rejects.toEqual(mockError);
    });
  });

  describe('createPoll', () => {
    it('should create poll successfully', async () => {
      localStorageMock.setItem('authToken', 'test-token');

      const pollData = {
        title: 'New Poll',
        description: 'New Description',
        type: 'public' as const,
        options: ['Option 1', 'Option 2'],
      };

      const mockResponse = {
        id: 'new-id',
        ...pollData,
        options: pollData.options.map((text, idx) => ({
          id: `${idx}`,
          text,
          createdAt: new Date().toISOString(),
        })),
        creator: { id: '1', name: 'Test', email: 'test@test.com' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await createPoll(pollData);

      expect(global.fetch).toHaveBeenCalledWith(
        API_ENDPOINTS.POLLS.CREATE,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          }),
          body: JSON.stringify(pollData),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when no token is available', async () => {
      localStorageMock.clear();

      await expect(
        createPoll({
          title: 'Test',
          description: 'Test',
          type: 'public',
          options: ['A', 'B'],
        })
      ).rejects.toThrow('Authentication required to create a poll');
    });

    it('should throw error when creation fails', async () => {
      localStorageMock.setItem('authToken', 'test-token');

      const mockError = {
        statusCode: 400,
        error: 'Bad Request',
        message: ['title should not be empty'],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      await expect(
        createPoll({
          title: '',
          description: 'Test',
          type: 'public',
          options: ['A', 'B'],
        })
      ).rejects.toEqual(mockError);
    });
  });
});
