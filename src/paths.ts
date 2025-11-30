import { env } from './env';

// Frontend routes
export const PATHS = {
  HOME: '/',
  ABOUT: '/about',
  LOGIN: '/login',
  REGISTER: '/register',
  POLLS: {
    LIST: '/home',
    CREATE: '/polls/create',
    DETAILS: (id: string) => `/polls/${id}`,
  },
};

// API configuration - validated with Zod
export const API_BASE_URL = env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/users`,
  },
  POLLS: {
    LIST: `${API_BASE_URL}/polls`,
    CREATE: `${API_BASE_URL}/polls`,
    BY_ID: (id: string) => `${API_BASE_URL}/polls/${id}`,
  },
  USERS: {
    LIST: `${API_BASE_URL}/users`,
    BY_ID: (id: string) => `${API_BASE_URL}/users/${id}`,
  },
  VOTES: {
    CREATE: `${API_BASE_URL}/votes`,
    DELETE: (id: string) => `${API_BASE_URL}/votes/${id}`,
  },
};
