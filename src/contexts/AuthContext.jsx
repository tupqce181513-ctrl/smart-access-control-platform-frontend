import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  login as authLogin,
  logout as authLogout,
  refreshToken as authRefreshToken,
  register as authRegister,
} from '../api/authApi';
import { getProfile, updateProfile as updateProfileApi } from '../api/userApi';
import { AuthContext } from './AuthStateContext';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const getPayload = (response) => response?.data ?? response;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem(REFRESH_TOKEN_KEY)
  );
  const [isLoading, setIsLoading] = useState(true);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await authLogin(email, password);
    const payload = getPayload(response);

    localStorage.setItem(ACCESS_TOKEN_KEY, payload.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken);

    setAccessToken(payload.accessToken);
    setRefreshToken(payload.refreshToken);
    setUser(payload.user);

    return payload;
  }, []);

  const register = useCallback(async (data) => {
    return authRegister(data);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!storedRefreshToken) {
      throw new Error('No refresh token found');
    }

    const response = await authRefreshToken(storedRefreshToken);
    const payload = getPayload(response);

    localStorage.setItem(ACCESS_TOKEN_KEY, payload.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken);

    setAccessToken(payload.accessToken);
    setRefreshToken(payload.refreshToken);

    return payload.accessToken;
  }, []);

  const logout = useCallback(() => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (storedRefreshToken) {
      authLogout(storedRefreshToken).catch(() => {});
    }

    clearAuth();
    navigate('/login', { replace: true });
  }, [clearAuth, navigate]);

  const updateProfile = useCallback(async (data) => {
    const response = await updateProfileApi(data);
    const payload = getPayload(response);
    setUser(payload);
    return payload;
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (!storedAccessToken) {
        setIsLoading(false);
        return;
      }

      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);

      try {
        const profileResponse = await getProfile();
        const profilePayload = getPayload(profileResponse);
        setUser(profilePayload);
      } catch {
        try {
          await refreshAccessToken();
          const profileResponse = await getProfile();
          const profilePayload = getPayload(profileResponse);
          setUser(profilePayload);
        } catch {
          clearAuth();
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [clearAuth, refreshAccessToken]);

  const isAuthenticated = !!user && !!accessToken;

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refreshAccessToken,
      updateProfile,
    }),
    [
      accessToken,
      isAuthenticated,
      isLoading,
      login,
      logout,
      refreshAccessToken,
      refreshToken,
      register,
      updateProfile,
      user,
    ]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-sm">Đang tải...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
