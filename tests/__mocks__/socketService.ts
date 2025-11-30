export const socketService = {
  connect: jest.fn().mockResolvedValue({}),
  disconnect: jest.fn(),
  getSocket: jest.fn(() => null),
  joinPoll: jest.fn().mockResolvedValue(undefined),
  leavePoll: jest.fn(),
  onPollUpdated: jest.fn(),
  offPollUpdated: jest.fn(),
};
