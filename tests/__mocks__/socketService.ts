export const socketService = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  getSocket: jest.fn(() => null),
  joinPoll: jest.fn(),
  onPollUpdated: jest.fn(),
  offPollUpdated: jest.fn(),
};
