import axiosInstance from './axios';

export const getProfile = async () => {
  const response = await axiosInstance.get('/api/users/profile');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axiosInstance.put('/api/users/profile', data);
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await axiosInstance.put('/api/users/change-password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};

export const getUsers = async (params = {}) => {
  const response = await axiosInstance.get('/api/users', { params });
  return response.data;
};

export const toggleUserActive = async (id) => {
  const response = await axiosInstance.put(`/api/users/${id}/toggle-active`);
  return response.data;
};
