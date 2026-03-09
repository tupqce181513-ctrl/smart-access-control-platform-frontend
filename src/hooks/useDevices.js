import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getDevices } from '../api/deviceApi';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from './useAuth';

const defaultFilters = {
  page: 1,
  limit: 10,
  deviceType: '',
  status: '',
};

const normalizeResponse = (response) => {
  const payload = response?.data ?? response ?? {};
  const devices = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];

  const pagination = payload?.pagination || response?.pagination || {
    page: 1,
    limit: devices.length,
    total: devices.length,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  return { devices, pagination };
};

export const useDevices = (initialFilters = {}, userId) => {
  const { socket } = useSocket();
  const { isAuthenticated } = useAuth();

  const mergedInitialFilters = useMemo(
    () => ({ ...defaultFilters, ...initialFilters }),
    [initialFilters]
  );

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: mergedInitialFilters.limit,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [filters, setFiltersState] = useState(mergedInitialFilters);
  
  // Track if we've fetched for the current userId
  const userIdRef = useRef(null);
  const hasInitialFetch = useRef(false);

  const fetchDevices = useCallback(async (params = {}) => {
    const requestParams = { ...filters, ...params };

    setLoading(true);
    setError(null);

    try {
      const response = await getDevices(requestParams);
      const { devices: nextDevices, pagination: nextPagination } = normalizeResponse(response);

      setDevices(nextDevices);
      setPagination(nextPagination);

      return { devices: nextDevices, pagination: nextPagination };
    } catch (err) {
      const message = err?.response?.data?.message || 'Không thể tải danh sách thiết bị';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = useCallback((newFilters) => {
    setFiltersState((prev) => {
      const nextFilters =
        typeof newFilters === 'function' ? newFilters(prev) : { ...prev, ...newFilters };
      return nextFilters;
    });
  }, []);

  const setPage = useCallback((page) => {
    setFiltersState((prev) => ({ ...prev, page }));
  }, []);

  // Fetch when userId becomes available or when filters change
  useEffect(() => {
    // Wait for userId to be available
    if (!userId) {
      return;
    }

    // Check if this is the first time we're seeing this userId
    if (userId !== userIdRef.current) {
      userIdRef.current = userId;
      hasInitialFetch.current = false; // Reset for new user
    }

    // Always fetch when we have a userId
    fetchDevices().catch(() => {});
    hasInitialFetch.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, filters.deviceType, filters.status, filters.page]);

  // Real-time device updates via WebSocket
  useEffect(() => {
    if (!socket || !isAuthenticated) return;

    const handleDeviceStatusChanged = (data) => {
      const { deviceId, state, status, timestamp } = data;
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device._id === deviceId
            ? { ...device, currentState: state || device.currentState, status, lastHeartbeat: timestamp || device.lastHeartbeat }
            : device
        )
      );
    };

    const handleDeviceUpdated = (updatedDevice) => {
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device._id === updatedDevice._id ? updatedDevice : device
        )
      );
    };

    const handleDeviceDeleted = (data) => {
      const { deviceId } = data;
      setDevices((prevDevices) =>
        prevDevices.filter((device) => device._id !== deviceId)
      );
    };

    socket.on('device_status_changed', handleDeviceStatusChanged);
    socket.on('device_updated', handleDeviceUpdated);
    socket.on('device_deleted', handleDeviceDeleted);

    return () => {
      socket.off('device_status_changed', handleDeviceStatusChanged);
      socket.off('device_updated', handleDeviceUpdated);
      socket.off('device_deleted', handleDeviceDeleted);
    };
  }, [socket, isAuthenticated]);

  return {
    devices,
    loading,
    error,
    pagination,
    filters,
    fetchDevices,
    setFilters,
    setPage,
  };
};
