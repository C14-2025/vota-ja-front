import { io, Socket } from 'socket.io-client';
import { socketService } from '../src/services/socketService';

jest.mock('socket.io-client');

const mockIo = io as jest.MockedFunction<typeof io>;

interface MockSocket extends Partial<Socket> {
  connected: boolean;
  on: jest.Mock;
  off: jest.Mock;
  emit: jest.Mock;
  disconnect: jest.Mock;
  removeAllListeners: jest.Mock;
}

interface SocketServiceInternal {
  socket: Socket | null;
  currentPollId: string | null;
  connecting: boolean;
}

global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
};

describe('SocketService', () => {
  let mockSocket: MockSocket;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSocket = {
      connected: false,
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
      removeAllListeners: jest.fn(),
    };

    mockIo.mockReturnValue(mockSocket as unknown as Socket);

    (socketService as unknown as SocketServiceInternal).socket = null;
    (socketService as unknown as SocketServiceInternal).currentPollId = null;
    (socketService as unknown as SocketServiceInternal).connecting = false;
  });

  afterEach(() => {
    socketService.disconnect();
  });
  describe('connect', () => {
    it('should connect to socket successfully', async () => {
      mockSocket.on.mockImplementation(
        (event: string, callback: () => void) => {
          if (event === 'connect') {
            callback();
          }
        }
      );

      const result = await socketService.connect();

      expect(io).toHaveBeenCalledWith('http://localhost:5000', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });
      expect(result).toBe(mockSocket);
    });

    it('should return existing socket if already connected', async () => {
      mockSocket.connected = true;
      (socketService as unknown as SocketServiceInternal).socket =
        mockSocket as unknown as Socket;

      const result = await socketService.connect();

      expect(result).toBe(mockSocket);
      expect(io).not.toHaveBeenCalled();
    });

    it('should handle connection error', async () => {
      mockSocket.on.mockImplementation(
        (event: string, callback: (error: Error) => void) => {
          if (event === 'connect_error') {
            callback(new Error('Connection failed'));
          }
        }
      );

      await expect(socketService.connect()).rejects.toThrow(
        'Connection failed'
      );
    });

    it('should handle connection timeout', async () => {
      mockSocket.on.mockImplementation(() => {});

      const promise = socketService.connect();

      await expect(promise).rejects.toThrow('Socket connection timeout');
    }, 10000);

    it('should wait if already connecting', async () => {
      (socketService as unknown as SocketServiceInternal).connecting = true;
      (socketService as unknown as SocketServiceInternal).socket =
        mockSocket as unknown as Socket;

      const connectPromise = socketService.connect();

      setTimeout(() => {
        (socketService as unknown as SocketServiceInternal).connecting = false;
      }, 50);

      const result = await connectPromise;
      expect(result).toBe(mockSocket);
    });

    it('should handle waiting timeout when connecting', async () => {
      (socketService as unknown as SocketServiceInternal).connecting = true;

      await expect(socketService.connect()).rejects.toThrow(
        'Socket connection wait timeout'
      );
    }, 10000);

    it('should disconnect and reconnect if socket exists but not connected', async () => {
      (socketService as unknown as SocketServiceInternal).socket =
        mockSocket as unknown as Socket;
      mockSocket.connected = false;

      mockSocket.on.mockImplementation(
        (event: string, callback: () => void) => {
          if (event === 'connect') {
            setTimeout(() => callback(), 10);
          }
        }
      );

      await socketService.connect();

      expect(mockSocket.removeAllListeners).toHaveBeenCalled();
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    it('should setup disconnect listener', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      mockSocket.on.mockImplementation(
        (event: string, callback: () => void) => {
          if (event === 'connect') {
            setTimeout(() => callback(), 10);
          } else if (event === 'disconnect') {
            setTimeout(() => callback(), 20);
          }
        }
      );

      await socketService.connect();

      expect(mockSocket.on).toHaveBeenCalledWith(
        'disconnect',
        expect.any(Function)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('disconnect', () => {
    it('should disconnect socket and cleanup', () => {
      (socketService as unknown as SocketServiceInternal).socket =
        mockSocket as unknown as Socket;
      (socketService as unknown as SocketServiceInternal).currentPollId =
        'poll-123';

      socketService.disconnect();

      expect(mockSocket.removeAllListeners).toHaveBeenCalled();
      expect(mockSocket.disconnect).toHaveBeenCalled();
      expect(
        (socketService as unknown as SocketServiceInternal).socket
      ).toBeNull();
      expect(
        (socketService as unknown as SocketServiceInternal).currentPollId
      ).toBeNull();
      expect(
        (socketService as unknown as SocketServiceInternal).connecting
      ).toBe(false);
    });

    it('should handle disconnect when socket is null', () => {
      (socketService as unknown as SocketServiceInternal).socket = null;

      expect(() => socketService.disconnect()).not.toThrow();
    });
  });

  describe('getSocket', () => {
    it('should return current socket', () => {
      (socketService as unknown as SocketServiceInternal).socket =
        mockSocket as unknown as Socket;

      const result = socketService.getSocket();

      expect(result).toBe(mockSocket);
    });

    it('should return null when no socket', () => {
      (socketService as unknown as SocketServiceInternal).socket = null;

      const result = socketService.getSocket();

      expect(result).toBeNull();
    });
  });

  describe('leavePoll', () => {
    it('should leave current poll', () => {
      (socketService as unknown as SocketServiceInternal).socket =
        mockSocket as unknown as Socket;
      (socketService as unknown as SocketServiceInternal).currentPollId =
        'poll-123';

      socketService.leavePoll();

      expect(mockSocket.off).toHaveBeenCalledWith('pollUpdated');
      expect(
        (socketService as unknown as SocketServiceInternal).currentPollId
      ).toBeNull();
    });

    it('should not crash if no socket', () => {
      (socketService as unknown as SocketServiceInternal).socket = null;
      (socketService as unknown as SocketServiceInternal).currentPollId =
        'poll-123';

      expect(() => socketService.leavePoll()).not.toThrow();
    });

    it('should not crash if no currentPollId', () => {
      (socketService as unknown as SocketServiceInternal).socket =
        mockSocket as unknown as Socket;
      (socketService as unknown as SocketServiceInternal).currentPollId = null;

      expect(() => socketService.leavePoll()).not.toThrow();
    });
  });

  describe('joinPoll', () => {
    it('should join poll successfully', async () => {
      mockSocket.connected = true;
      (socketService as unknown as SocketServiceInternal).socket =
        mockSocket as unknown as Socket;

      await socketService.joinPoll('poll-123');

      expect(mockSocket.emit).toHaveBeenCalledWith('joinPoll', 'poll-123');
      expect(
        (socketService as unknown as SocketServiceInternal).currentPollId
      ).toBe('poll-123');
    });

    it('should not rejoin if already in same poll', async () => {
      (socketService as unknown as SocketServiceInternal).currentPollId =
        'poll-123';

      await socketService.joinPoll('poll-123');

      expect(mockSocket.emit).not.toHaveBeenCalled();
    });

    it('should leave previous poll before joining new one', async () => {
      mockSocket.connected = true;
      (socketService as unknown as SocketServiceInternal).socket =
        mockSocket as unknown as Socket;
      (socketService as unknown as SocketServiceInternal).currentPollId =
        'poll-old';

      await socketService.joinPoll('poll-new');

      expect(mockSocket.off).toHaveBeenCalledWith('pollUpdated');
      expect(mockSocket.emit).toHaveBeenCalledWith('joinPoll', 'poll-new');
    });

    it('should connect before joining if not connected', async () => {
      mockSocket.connected = false;
      (socketService as unknown as SocketServiceInternal).socket = null;

      mockSocket.on.mockImplementation(
        (event: string, callback: () => void) => {
          if (event === 'connect') {
            mockSocket.connected = true;
            setTimeout(() => callback(), 10);
          }
        }
      );

      await socketService.joinPoll('poll-123');

      expect(io).toHaveBeenCalled();
      expect(mockSocket.emit).toHaveBeenCalledWith('joinPoll', 'poll-123');
    });

    it('should not emit if connection fails', async () => {
      mockSocket.connected = false;
      (socketService as unknown as SocketServiceInternal).socket = null;

      mockSocket.on.mockImplementation(
        (event: string, callback: (error: Error) => void) => {
          if (event === 'connect_error') {
            setTimeout(() => callback(new Error('Failed')), 10);
          }
        }
      );

      try {
        await socketService.joinPoll('poll-123');
      } catch {
        // Expected error
      }

      expect(mockSocket.emit).not.toHaveBeenCalled();
    });
  });

  describe('onPollUpdated', () => {
    it('should register pollUpdated listener', () => {
      (socketService as unknown as SocketServiceInternal).socket =
        mockSocket as unknown as Socket;
      const callback = jest.fn();

      socketService.onPollUpdated(callback);

      expect(mockSocket.on).toHaveBeenCalledWith('pollUpdated', callback);
    });

    it('should not crash if no socket', () => {
      (socketService as unknown as SocketServiceInternal).socket = null;
      const callback = jest.fn();

      expect(() => socketService.onPollUpdated(callback)).not.toThrow();
    });
  });

  describe('offPollUpdated', () => {
    it('should remove pollUpdated listener', () => {
      (socketService as unknown as SocketServiceInternal).socket =
        mockSocket as unknown as Socket;

      socketService.offPollUpdated();

      expect(mockSocket.off).toHaveBeenCalledWith('pollUpdated');
    });

    it('should not crash if no socket', () => {
      (socketService as unknown as SocketServiceInternal).socket = null;

      expect(() => socketService.offPollUpdated()).not.toThrow();
    });
  });
});
