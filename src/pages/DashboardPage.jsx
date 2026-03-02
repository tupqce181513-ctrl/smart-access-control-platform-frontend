import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Activity,
  DoorOpen,
  KeyRound,
  Smartphone,
  UserRound,
  Users,
  Wifi,
} from 'lucide-react';

import { getDevicePermissions } from '../api/accessApi';
import { getDevices, sendCommand } from '../api/deviceApi';
import { getLogs } from '../api/logApi';
import { getUsers } from '../api/userApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';
import { formatDateTime, formatTimeAgo } from '../utils/formatDate';

const extractPayload = (response) => response?.data ?? response ?? {};

const extractItems = (response) => {
  const payload = extractPayload(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

const extractTotal = (response) => {
  if (typeof response?.pagination?.total === 'number') {
    return response.pagination.total;
  }

  if (typeof response?.data?.pagination?.total === 'number') {
    return response.data.pagination.total;
  }

  if (Array.isArray(response?.data)) {
    return response.data.length;
  }

  return 0;
};

const StatCard = ({ title, value, icon: Icon, colorClass }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
        <div className={`rounded-lg p-2 ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

function DashboardPage() {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDevices: 0,
    onlineDevices: 0,
    todayAccess: 0,
    activePermissions: 0,
    accessibleDevices: 0,
    recentAccess: 0,
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [devices, setDevices] = useState([]);
  const [actionLoadingId, setActionLoadingId] = useState('');

  const loadDashboardData = useCallback(async () => {
    if (!user?.role) {
      return;
    }

    setIsLoading(true);

    try {
      if (user.role === ROLES.ADMIN) {
        const [usersResponse, devicesResponse, onlineDevicesResponse, todayAccessResponse, logsResponse] =
          await Promise.all([
            getUsers({ page: 1, limit: 1 }),
            getDevices({ page: 1, limit: 1 }),
            getDevices({ page: 1, limit: 1, status: 'online' }),
            getLogs({ page: 1, limit: 1, startDate: 'today' }),
            getLogs({ page: 1, limit: 5, sort: '-timestamp' }),
          ]);

        setStats({
          totalUsers: extractTotal(usersResponse),
          totalDevices: extractTotal(devicesResponse),
          onlineDevices: extractTotal(onlineDevicesResponse),
          todayAccess: extractTotal(todayAccessResponse),
          activePermissions: 0,
          accessibleDevices: 0,
          recentAccess: 0,
        });
        setRecentLogs(extractItems(logsResponse));
        setDevices([]);
      }

      if (user.role === ROLES.OWNER) {
        const [myDevicesResponse, onlineDevicesResponse, logsResponse, deviceCardsResponse] = await Promise.all([
          getDevices({ page: 1, limit: 1 }),
          getDevices({ page: 1, limit: 1, status: 'online' }),
          getLogs({ page: 1, limit: 5, sort: '-timestamp' }),
          getDevices({ page: 1, limit: 6 }),
        ]);

        const devicesForPermissionResponse = await getDevices({ page: 1, limit: 100 });
        const devicesForPermission = extractItems(devicesForPermissionResponse);

        const permissionResponses = await Promise.all(
          devicesForPermission.map((device) => getDevicePermissions(device._id).catch(() => ({ data: [] })))
        );

        const activePermissions = permissionResponses.reduce((total, response) => {
          const permissions = extractItems(response);
          const activeCount = permissions.filter((permission) => !permission?.isRevoked).length;
          return total + activeCount;
        }, 0);

        setStats({
          totalUsers: 0,
          totalDevices: extractTotal(myDevicesResponse),
          onlineDevices: extractTotal(onlineDevicesResponse),
          todayAccess: 0,
          activePermissions,
          accessibleDevices: 0,
          recentAccess: 0,
        });
        setRecentLogs(extractItems(logsResponse));
        setDevices(extractItems(deviceCardsResponse));
      }

      if (user.role === ROLES.MEMBER) {
        const [accessibleDevicesResponse, logsCountResponse, logsResponse, devicesResponse] =
          await Promise.all([
            getDevices({ page: 1, limit: 1 }),
            getLogs({ page: 1, limit: 1 }),
            getLogs({ page: 1, limit: 5, sort: '-timestamp' }),
            getDevices({ page: 1, limit: 6 }),
          ]);

        setStats({
          totalUsers: 0,
          totalDevices: 0,
          onlineDevices: 0,
          todayAccess: 0,
          activePermissions: 0,
          accessibleDevices: extractTotal(accessibleDevicesResponse),
          recentAccess: extractTotal(logsCountResponse),
        });
        setRecentLogs(extractItems(logsResponse));
        setDevices(extractItems(devicesResponse));
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || 'Không thể tải dữ liệu dashboard. Vui lòng thử lại.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleQuickControl = async (deviceId, currentState) => {
    const command = currentState === 'unlocked' ? 'lock' : 'unlock';
    setActionLoadingId(deviceId);

    try {
      await sendCommand(deviceId, command);
      toast.success(`Đã gửi lệnh ${command}`);
      await loadDashboardData();
    } catch (error) {
      const message = error?.response?.data?.message || 'Gửi lệnh thất bại';
      toast.error(message);
    } finally {
      setActionLoadingId('');
    }
  };

  const statCards = useMemo(() => {
    if (user?.role === ROLES.ADMIN) {
      return [
        {
          title: 'Total Users',
          value: stats.totalUsers,
          icon: Users,
          colorClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
        },
        {
          title: 'Total Devices',
          value: stats.totalDevices,
          icon: Smartphone,
          colorClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
        },
        {
          title: 'Online Devices',
          value: stats.onlineDevices,
          icon: Wifi,
          colorClass: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
        },
        {
          title: "Today's Access",
          value: stats.todayAccess,
          icon: Activity,
          colorClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        },
      ];
    }

    if (user?.role === ROLES.OWNER) {
      return [
        {
          title: 'My Devices',
          value: stats.totalDevices,
          icon: Smartphone,
          colorClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
        },
        {
          title: 'Online Devices',
          value: stats.onlineDevices,
          icon: Wifi,
          colorClass: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
        },
        {
          title: 'Active Permissions',
          value: stats.activePermissions,
          icon: KeyRound,
          colorClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        },
      ];
    }

    return [
      {
        title: 'Accessible Devices',
        value: stats.accessibleDevices,
        icon: DoorOpen,
        colorClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      },
      {
        title: 'Recent Access',
        value: stats.recentAccess,
        icon: Activity,
        colorClass: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
      },
    ];
  }, [stats, user?.role]);

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back, {user?.fullName || user?.email}.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            colorClass={card.colorClass}
          />
        ))}
      </section>

      {user?.role === ROLES.ADMIN ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  <th className="pb-2 pr-3 font-medium">Time</th>
                  <th className="pb-2 pr-3 font-medium">User</th>
                  <th className="pb-2 pr-3 font-medium">Device</th>
                  <th className="pb-2 pr-3 font-medium">Action</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log._id} className="border-b border-gray-100 dark:border-gray-700/70">
                    <td className="py-2 pr-3 text-gray-700 dark:text-gray-300">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="py-2 pr-3 text-gray-700 dark:text-gray-300">
                      {log.userId?.fullName || log.userId?.email || 'Unknown'}
                    </td>
                    <td className="py-2 pr-3 text-gray-700 dark:text-gray-300">
                      {log.deviceId?.name || 'Unknown'}
                    </td>
                    <td className="py-2 pr-3 text-gray-700 dark:text-gray-300">{log.action}</td>
                    <td className="py-2">
                      <StatusBadge status={log.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentLogs.length === 0 ? (
              <p className="py-4 text-sm text-gray-500 dark:text-gray-400">No activity found.</p>
            ) : null}
          </div>
        </section>
      ) : null}

      {user?.role === ROLES.OWNER ? (
        <>
          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">My Devices</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {devices.map((device) => (
                <div
                  key={device._id}
                  className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{device.name}</p>
                      <p className="text-sm capitalize text-gray-500 dark:text-gray-400">
                        {device.deviceType}
                      </p>
                    </div>
                    <StatusBadge status={device.status} />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <StatusBadge status={device.currentState} />
                    <button
                      type="button"
                      disabled={actionLoadingId === device._id}
                      onClick={() => handleQuickControl(device._id, device.currentState)}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      {actionLoadingId === device._id
                        ? 'Sending...'
                        : device.currentState === 'unlocked'
                          ? 'Lock'
                          : 'Unlock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Access Logs</h2>
            <div className="mt-4 space-y-3">
              {recentLogs.map((log) => (
                <div
                  key={log._id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 dark:border-gray-700"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {log.deviceId?.name || 'Unknown device'} - {log.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDateTime(log.timestamp)}
                    </p>
                  </div>
                  <StatusBadge status={log.status} />
                </div>
              ))}
              {recentLogs.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No logs found.</p>
              ) : null}
            </div>
          </section>
        </>
      ) : null}

      {user?.role === ROLES.MEMBER ? (
        <>
          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Devices I Can Access
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {devices.map((device) => (
                <div
                  key={device._id}
                  className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{device.name}</p>
                      <p className="text-sm capitalize text-gray-500 dark:text-gray-400">
                        {device.deviceType}
                      </p>
                    </div>
                    <StatusBadge status={device.status} />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <StatusBadge status={device.currentState} />
                    <button
                      type="button"
                      disabled={actionLoadingId === device._id}
                      onClick={() => handleQuickControl(device._id, device.currentState)}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      {actionLoadingId === device._id
                        ? 'Sending...'
                        : device.currentState === 'unlocked'
                          ? 'Lock'
                          : 'Unlock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              My Recent Activity
            </h2>
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log._id} className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-blue-100 p-1.5 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    <UserRound className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 rounded-lg border border-gray-100 px-3 py-2 dark:border-gray-700">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {log.action} - {log.deviceId?.name || 'Unknown device'}
                      </p>
                      <StatusBadge status={log.status} />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(log.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              {recentLogs.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No activity found.</p>
              ) : null}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

export default DashboardPage;
