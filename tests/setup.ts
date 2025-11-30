interface MockResponseInit {
  status?: number;
  statusText?: string;
}

class MockResponse {
  ok: boolean;
  status: number;
  statusText: string;
  private body: unknown;

  constructor(body?: unknown, init?: MockResponseInit) {
    this.ok = init?.status ? init.status >= 200 && init.status < 300 : true;
    this.status = init?.status || 200;
    this.statusText = init?.statusText || '';
    this.body = body;
  }

  async json(): Promise<unknown> {
    return this.body;
  }
}

global.Response = MockResponse as unknown as typeof Response;

global.fetch = jest.fn();

jest.mock('../src/env', () => ({
  env: {
    VITE_API_BASE_URL: 'http://localhost:5000/v1',
  },
}));
