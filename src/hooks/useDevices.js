import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDevices } from '../api/deviceApi';

const defaultFilters = {
  page: 1,
  limit: 10,
  deviceType: '',
  status: '',
  search: '',
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

export const useDevices = (initialFilters = {}) => {
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

  useEffect(() => {
    fetchDevices().catch(() => {});
  }, [fetchDevices]);

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
