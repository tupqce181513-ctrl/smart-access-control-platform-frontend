import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { getDevices } from '../api/deviceApi';
import { getLogs } from '../api/logApi';
import LogDetail from '../components/logs/LogDetail';
import LogFilter from '../components/logs/LogFilter';
import LogTable from '../components/logs/LogTable';
import Pagination from '../components/common/Pagination';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

const toDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7);

  return {
    startDate: toDateInput(startDate),
    endDate: toDateInput(endDate),
  };
};

const normalizePayload = (response) => response?.data ?? response ?? {};

function LogsPage() {
  const { user } = useAuth();

  const defaultRange = useMemo(() => getDefaultDateRange(), []);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    deviceId: '',
    action: '',
    status: '',
    userSearch: '',
    startDate: defaultRange.startDate,
    endDate: defaultRange.endDate,
  });

  const [logs, setLogs] = useState([]);
  const [devices, setDevices] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  const isAdmin = user?.role === ROLES.ADMIN;

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const [logsResponse, devicesResponse] = await Promise.all([
        getLogs({
          page: filters.page,
          limit: filters.limit,
          deviceId: filters.deviceId || undefined,
          action: filters.action || undefined,
          status: filters.status || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
        }),
        getDevices({ page: 1, limit: 100 }),
      ]);

      const logsPayload = normalizePayload(logsResponse);
      const devicesPayload = normalizePayload(devicesResponse);

      const logItems = Array.isArray(logsPayload?.data)
        ? logsPayload.data
        : Array.isArray(logsPayload)
          ? logsPayload
          : [];

      const filteredByUserSearch = isAdmin && filters.userSearch.trim()
        ? logItems.filter((log) => {
            const keyword = filters.userSearch.toLowerCase();
            const fullName = String(log.userId?.fullName || '').toLowerCase();
            const email = String(log.userId?.email || '').toLowerCase();
            return fullName.includes(keyword) || email.includes(keyword);
          })
        : logItems;

      setLogs(filteredByUserSearch);

      setPagination(
        logsPayload?.pagination || {
          page: filters.page,
          limit: filters.limit,
          total: filteredByUserSearch.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        }
      );

      setDevices(Array.isArray(devicesPayload?.data) ? devicesPayload.data : []);
    } catch (error) {
      const message = error?.response?.data?.message || 'Không thể tải logs';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [filters, isAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (nextFilters) => {
    setFilters((prev) => {
      const clearAll = nextFilters.clearAll;

      if (clearAll) {
        return {
          ...prev,
          page: 1,
          deviceId: '',
          action: '',
          status: '',
          userSearch: '',
          startDate: '',
          endDate: '',
        };
      }

      return {
        ...prev,
        ...nextFilters,
        page: 'page' in nextFilters ? nextFilters.page : 1,
      };
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Access Logs</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and inspect access activities.
        </p>
      </div>

      <LogFilter
        filters={filters}
        devices={devices}
        isAdmin={isAdmin}
        onFilterChange={handleFilterChange}
      />

      <LogTable logs={logs} loading={loading} onViewDetail={setSelectedLog} />

      <Pagination
        page={pagination.page || 1}
        totalPages={pagination.totalPages || 1}
        hasNextPage={pagination.hasNextPage || false}
        hasPrevPage={pagination.hasPrevPage || false}
        onPageChange={(page) => handleFilterChange({ page })}
      />

      {selectedLog ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white p-5 dark:bg-gray-800">
            <LogDetail log={selectedLog} />
            <button
              type="button"
              onClick={() => setSelectedLog(null)}
              className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default LogsPage;
