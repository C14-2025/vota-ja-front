import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private currentPollId: string | null = null;
  private connecting: boolean = false;

  async connect(): Promise<Socket> {
    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.connecting) {
      return new Promise((resolve, reject) => {
        const maxWait = 50;
        let attempts = 0;
        const checkInterval = setInterval(() => {
          attempts++;
          if (!this.connecting && this.socket) {
            clearInterval(checkInterval);
            resolve(this.socket);
          } else if (attempts >= maxWait) {
            clearInterval(checkInterval);
            reject(new Error('Socket connection wait timeout'));
          }
        }, 100);
      });
    }

    this.connecting = true;

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.connecting = false;
        reject(new Error('Socket connection timeout'));
      }, 5000);

      this.socket!.on('connect', () => {
        clearTimeout(timeout);
        this.connecting = false;
        resolve(this.socket!);
      });

      this.socket!.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      this.socket!.on('connect_error', (error) => {
        clearTimeout(timeout);
        this.connecting = false;
        console.error('Socket connection error:', error);
        reject(error);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentPollId = null;
    this.connecting = false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  leavePoll(): void {
    if (this.socket && this.currentPollId) {
      this.socket.off('pollUpdated');
      this.currentPollId = null;
    }
  }

  async joinPoll(pollId: string): Promise<void> {
    if (this.currentPollId === pollId) {
      return;
    }

    this.leavePoll();

    if (!this.socket?.connected) {
      await this.connect();
    }

    if (this.socket?.connected) {
      this.currentPollId = pollId;
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
