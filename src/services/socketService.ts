import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  joinPoll(pollId: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('joinPoll', pollId);
    }
  }

  onPollUpdated(callback: (data: unknown) => void): void {
    if (this.socket) {
      this.socket.on('pollUpdated', callback);
    }
  }

  offPollUpdated(): void {
    if (this.socket) {
      this.socket.off('pollUpdated');
    }
  }
}

export const socketService = new SocketService();
