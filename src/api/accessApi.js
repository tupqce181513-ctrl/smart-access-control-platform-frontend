import axiosInstance from './axios';

export const grantAccess = async (data) => {
  const response = await axiosInstance.post('/api/access/grant', data);
  return response.data;
};

export const revokeAccess = async (id) => {
  const response = await axiosInstance.put(`/api/access/revoke/${id}`);
  return response.data;
};

export const getDevicePermissions = async (deviceId) => {
  const response = await axiosInstance.get(`/api/access/device/${deviceId}`);
  return response.data;
};

export const getUserPermissions = async (userId) => {
  const response = await axiosInstance.get(`/api/access/user/${userId}`);
  return response.data;
};

export const checkAccess = async (deviceId) => {
  const response = await axiosInstance.get(`/api/access/check/${deviceId}`);
  return response.data;
};
