import axiosInstance from './axios';

export const getLogs = async (params = {}) => {
  const response = await axiosInstance.get('/api/logs', { params });
  return response.data;
};

export const getDeviceLogs = async (deviceId, params = {}) => {
  const response = await axiosInstance.get(`/api/logs/device/${deviceId}`, { params });
  return response.data;
};

export const getUserLogs = async (userId, params = {}) => {
  const response = await axiosInstance.get(`/api/logs/user/${userId}`, { params });
  return response.data;
};
