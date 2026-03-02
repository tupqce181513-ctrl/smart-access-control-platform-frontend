import axiosInstance from './axios';

export const getNotifications = async (params = {}) => {
  const response = await axiosInstance.get('/api/notifications', { params });
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await axiosInstance.put(`/api/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await axiosInstance.put('/api/notifications/read-all');
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await axiosInstance.get('/api/notifications/unread-count');
  return response.data;
};
