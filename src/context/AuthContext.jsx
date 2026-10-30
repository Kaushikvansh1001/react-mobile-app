import { createContext, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  clearSession,
  hasSession,
  loginWithOtp,
  persistSession,
  readUser,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => readUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasSession());

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      async login(credentials) {
        const session = await loginWithOtp(credentials);
        persistSession(session);
        setUser(session.user);
        setIsAuthenticated(true);
        return session;
      },
      logout() {
        clearSession();
        setUser(null);
        setIsAuthenticated(false);
        navigate('/signup', { replace: true });
      },
    }),
    [isAuthenticated, navigate, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return value;
}
