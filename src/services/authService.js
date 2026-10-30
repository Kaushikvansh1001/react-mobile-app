import api, { assertSuccess, clearToken, readToken, writeToken } from './api';

const USER_KEY = 'fastor.user';

function formBody(fields) {
  const body = new URLSearchParams();
  Object.entries(fields).forEach(([key, value]) => {
    body.set(key, value);
  });
  return body;
}

const formConfig = {
  skipAuth: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

export function readUser() {
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    return {
      id: parsed.id ?? null,
      name: typeof parsed.name === 'string' ? parsed.name : '',
    };
  } catch {
    return null;
  }
}

export function writeUser(user) {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  clearToken();
  sessionStorage.removeItem(USER_KEY);
}

export function hasSession() {
  return Boolean(readToken());
}

export async function registerUser({ phone, dialCode }) {
  const response = await api.post(
    '/v1/pwa/user/register',
    formBody({ phone, dial_code: dialCode }),
    formConfig,
  );

  return assertSuccess(response.data);
}

export async function loginWithOtp({ phone, otp, dialCode }) {
  const response = await api.post(
    '/v1/pwa/user/login',
    formBody({ phone, otp, dial_code: dialCode }),
    formConfig,
  );

  const payload = assertSuccess(response.data);
  const token = payload.data?.token;

  if (typeof token !== 'string' || token.length === 0) {
    throw new Error('Login did not return a token.');
  }

  const name = typeof payload.data?.user_name === 'string' ? payload.data.user_name.trim() : '';

  return {
    token,
    user: {
      id: payload.data?.user_id ?? null,
      name,
    },
  };
}

export function persistSession(session) {
  writeToken(session.token);
  writeUser(session.user);
}
