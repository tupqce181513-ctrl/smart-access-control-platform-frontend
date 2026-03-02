import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getNotifications as getNotificationsApi,
  getUnreadCount as getUnreadCountApi,
  markAllAsRead as markAllAsReadApi,
  markAsRead as markAsReadApi,
} from '../api/notificationApi';
import { useAuth } from '../hooks/useAuth';
import { NotificationContext } from './NotificationStateContext';

const normalizePayload = (response) => response?.data ?? response ?? {};

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(false);

  const clearState = useCallback(() => {
    setUnreadCount(0);
    setNotifications([]);
    setPagination({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    });
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      return 0;
    }

    try {
      const response = await getUnreadCountApi();
      const payload = normalizePayload(response);
      const count = Number(payload?.data?.unreadCount ?? payload?.unreadCount ?? 0);
      setUnreadCount(Number.isNaN(count) ? 0 : count);
      return count;
    } catch {
      return 0;
    }
  }, [isAuthenticated]);

  const fetchNotifications = useCallback(
    async (params = {}) => {
      if (!isAuthenticated) {
        return;
      }

      setLoading(true);

      try {
        const response = await getNotificationsApi(params);
        const payload = normalizePayload(response);

        const list = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

        setNotifications(list);
        setPagination(
          payload?.pagination || {
            page: params.page || 1,
            limit: params.limit || 10,
            total: list.length,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          }
        );
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  const markAsRead = useCallback(async (id) => {
    await markAsReadApi(id);

    let decremented = false;
    setNotifications((prev) =>
      prev.map((notification) => {
        if (notification._id !== id) {
          return notification;
        }

        if (!notification.isRead) {
          decremented = true;
        }

        return { ...notification, isRead: true };
      })
    );

    if (decremented) {
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    await markAllAsReadApi();
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      clearState();
      return undefined;
    }

    fetchUnreadCount();
    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [clearState, fetchUnreadCount, isAuthenticated]);

  const value = useMemo(
    () => ({
      unreadCount,
      notifications,
      pagination,
      loading,
      fetchUnreadCount,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
    }),
    [
      unreadCount,
      notifications,
      pagination,
      loading,
      fetchUnreadCount,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
    ]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
