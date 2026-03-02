import axiosInstance from './axios';

export const login = async (email, password) => {
  const response = await axiosInstance.post('/api/auth/login', { email, password });
  return response.data;
};

export const register = async ({ email, password, fullName, phone }) => {
  const response = await axiosInstance.post('/api/auth/register', {
    email,
    password,
    fullName,
    phone,
  });
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await axiosInstance.post('/api/auth/refresh-token', { refreshToken });
  return response.data;
};

export const logout = async (refreshToken) => {
  const response = await axiosInstance.post('/api/auth/logout', { refreshToken });
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await axiosInstance.get(`/api/auth/verify-email?token=${token}`);
  return response.data;
};
