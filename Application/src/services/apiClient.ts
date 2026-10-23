import { Platform } from 'react-native';

// Android emulator connects to host via 10.0.2.2, iOS simulator uses localhost
const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5000',
  ios: 'http://localhost:5000',
  default: 'http://localhost:5000',
});

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

type BlockedListener = () => void;
let blockedListeners: BlockedListener[] = [];
let currentUserIdHeader: string | null = null;

export const setCurrentUserHeaderId = (id: string | null) => {
  currentUserIdHeader = id;
};

export const onAccountBlocked = (listener: BlockedListener) => {
  blockedListeners.push(listener);
  return () => {
    blockedListeners = blockedListeners.filter(l => l !== listener);
  };
};

const notifyBlocked = () => {
  blockedListeners.forEach(listener => {
    try {
      listener();
    } catch {}
  });
};

export const apiClient = {
  baseUrl: BASE_URL,

  async get<T>(endpoint: string): Promise<T> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (currentUserIdHeader) {
      headers['x-user-id'] = currentUserIdHeader;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (response.status === 403 || errorData?.isBlocked) {
        notifyBlocked();
      }
      throw new ApiError(
        response.status,
        errorData?.message || `HTTP error! status: ${response.status}`,
        errorData
      );
    }

    return response.json();
  },

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (currentUserIdHeader) {
      headers['x-user-id'] = currentUserIdHeader;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (response.status === 403 || errorData?.isBlocked) {
        notifyBlocked();
      }
      throw new ApiError(
        response.status,
        errorData?.message || `HTTP error! status: ${response.status}`,
        errorData
      );
    }

    return response.json();
  },
};
