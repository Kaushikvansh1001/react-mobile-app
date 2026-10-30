import axios from 'axios';

const TOKEN_KEY = 'fastor.token';

export function readToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function writeToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (config.skipAuth) {
    return config;
  }

  const token = readToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      sessionStorage.removeItem('fastor.user');
      if (!window.location.pathname.startsWith('/signup')) {
        window.location.assign('/signup');
      }
    }

    return Promise.reject(error);
  },
);

export function getErrorMessage(error) {
  const apiMessage = error?.response?.data?.error_message;
  if (typeof apiMessage === 'string' && apiMessage.trim()) {
    return apiMessage;
  }

  if (error?.message === 'Network Error') {
    return 'Could not reach Fastor. Check your connection and try again.';
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

export function assertSuccess(body) {
  if (!body || body.status !== 'Success') {
    const message = body?.error_message || 'Request failed.';
    const error = new Error(message);
    error.statusCode = body?.status_code;
    throw error;
  }

  return body;
}

export default api;
