import axiosInstance from './axios';

export const getDevices = async (params = {}) => {
  const response = await axiosInstance.get('/api/devices', { params });
  return response.data;
};

export const getDevice = async (id) => {
  const response = await axiosInstance.get(`/api/devices/${id}`);
  return response.data;
};

export const createDevice = async (data) => {
  const response = await axiosInstance.post('/api/devices', data);
  return response.data;
};

export const updateDevice = async (id, data) => {
  const response = await axiosInstance.put(`/api/devices/${id}`, data);
  return response.data;
};

export const deleteDevice = async (id) => {
  const response = await axiosInstance.delete(`/api/devices/${id}`);
  return response.data;
};

export const sendCommand = async (id, command) => {
  const response = await axiosInstance.post(`/api/devices/${id}/command`, { command });
  return response.data;
};
