import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { getDevicePermissions, getUserPermissions, grantAccess, revokeAccess } from '../api/accessApi';
import { getDevices } from '../api/deviceApi';
import GrantPermissionForm from '../components/access/GrantPermissionForm';
import PermissionTable from '../components/access/PermissionTable';
import ConfirmModal from '../components/common/ConfirmModal';
import Pagination from '../components/common/Pagination';
import { useAuth } from '../hooks/useAuth';
import { ACCESS_TYPES, ROLES } from '../utils/constants';

const PAGE_SIZE = 10;
const normalizePayload = (response) => response ?? {};
const extractList = (payload) => {
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  return [];
};

const getPermissionDeviceRefId = (permission) => {
  if (!permission) return '';

  if (typeof permission.deviceId === 'string') {
    return permission.deviceId;
  }

  return permission.deviceId?._id || '';
};

const normalizePermissionsWithDevices = (permissions, devices) => {
  const deviceMap = new Map(devices.map((device) => [device._id, device]));

  return permissions.map((permission) => {
    const deviceRefId = getPermissionDeviceRefId(permission);
    const mappedDevice = deviceMap.get(deviceRefId);

    return {
      ...permission,
      deviceId:
        typeof permission.deviceId === 'object' && permission.deviceId !== null
          ? permission.deviceId
          : mappedDevice || permission.deviceId,
      deviceRefId,
    };
  });
};

function AccessControlPage() {
  const { user } = useAuth();
  const effectiveUserId = user?._id || user?.userId;

  const [devices, setDevices] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [isGranting, setIsGranting] = useState(false);
  const [permissionToRevoke, setPermissionToRevoke] = useState(null);
  const [isRevoking, setIsRevoking] = useState(false);

  const [filters, setFilters] = useState({
    deviceId: '',
    accessType: '',
    status: 'all',
    page: 1,
  });

  const canManageAccess = user?.role === ROLES.ADMIN || user?.role === ROLES.OWNER;

  const fetchAccessData = useCallback(async () => {
    if (!effectiveUserId) {
      return;
    }

    setIsLoading(true);

    try {
      const devicesResponse = await getDevices({ page: 1, limit: 100 });
      const devicesPayload = normalizePayload(devicesResponse);
      const availableDevices = extractList(devicesPayload);

      setDevices(availableDevices);

      if (user.role === ROLES.MEMBER) {
        const permissionResponse = await getUserPermissions(effectiveUserId);
        const payload = normalizePayload(permissionResponse);
        const items = extractList(payload);
        const normalizedItems = normalizePermissionsWithDevices(items, availableDevices);
        setPermissions(normalizedItems);
        return;
      }

      const permissionResponses = await Promise.all(
        availableDevices.map((device) =>
          getDevicePermissions(device._id).catch(() => ({ data: [] }))
        )
      );

      const mergedPermissions = permissionResponses.flatMap((response) => {
        const payload = normalizePayload(response);
        return extractList(payload);
      });

      const uniquePermissions = Array.from(
        new Map(mergedPermissions.map((permission) => [permission._id, permission])).values()
      );

      const normalizedPermissions = normalizePermissionsWithDevices(uniquePermissions, availableDevices);
      setPermissions(normalizedPermissions);
    } catch (error) {
      const message = error?.response?.data?.message || 'Không thể tải danh sách permissions';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [effectiveUserId, user?.role]);

  useEffect(() => {
    fetchAccessData();
  }, [fetchAccessData]);

  const filteredPermissions = useMemo(() => {
    const next = permissions.filter((permission) => {
      const permissionDeviceId = permission.deviceRefId || getPermissionDeviceRefId(permission);

      if (filters.deviceId && permissionDeviceId !== filters.deviceId) {
        return false;
      }

      if (filters.accessType && permission.accessType !== filters.accessType) {
        return false;
      }

      if (filters.status === 'active' && permission.isRevoked) {
        return false;
      }

      if (filters.status === 'revoked' && !permission.isRevoked) {
        return false;
      }

      return true;
    });

    return next;
  }, [permissions, filters.accessType, filters.deviceId, filters.status]);

  const pagination = useMemo(() => {
    const total = filteredPermissions.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const page = Math.min(filters.page, totalPages);

    return {
      page,
      totalPages,
      total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }, [filteredPermissions.length, filters.page]);

  const pagedPermissions = useMemo(() => {
    const start = (pagination.page - 1) * PAGE_SIZE;
    return filteredPermissions.slice(start, start + PAGE_SIZE);
  }, [filteredPermissions, pagination.page]);

  useEffect(() => {
    if (filters.page !== pagination.page) {
      setFilters((prev) => ({ ...prev, page: pagination.page }));
    }
  }, [filters.page, pagination.page]);

  const handleChangeFilter = (partial) => {
    setFilters((prev) => ({
      ...prev,
      ...partial,
      page: 1,
    }));
  };

  const handleGrant = async (payload) => {
    setIsGranting(true);

    try {
      await grantAccess(payload);
      toast.success('Grant access thành công');
      setIsGrantModalOpen(false);
      await fetchAccessData();
    } catch (error) {
      if (error?.response?.status === 409) {
        toast.error('User already has active permission for this device');
      } else {
        const message = error?.response?.data?.message || 'Không thể grant access';
        toast.error(message);
      }
    } finally {
      setIsGranting(false);
    }
  };

  const handleConfirmRevoke = async () => {
    if (!permissionToRevoke?._id) {
      return;
    }

    setIsRevoking(true);

    try {
      await revokeAccess(permissionToRevoke._id);
      toast.success('Revoke permission thành công');
      setPermissionToRevoke(null);
      await fetchAccessData();
    } catch (error) {
      const message = error?.response?.data?.message || 'Không thể revoke permission';
      toast.error(message);
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Access Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Grant and manage device permissions.
          </p>
        </div>

        {canManageAccess ? (
          <button
            type="button"
            onClick={() => setIsGrantModalOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Grant Access
          </button>
        ) : null}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <select
            value={filters.deviceId}
            onChange={(event) => handleChangeFilter({ deviceId: event.target.value })}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          >
            <option value="">All Devices</option>
            {devices.map((device) => (
              <option key={device._id} value={device._id}>
                {device.name}
              </option>
            ))}
          </select>

          <select
            value={filters.accessType}
            onChange={(event) => handleChangeFilter({ accessType: event.target.value })}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          >
            <option value="">All Types</option>
            <option value={ACCESS_TYPES.PERMANENT}>Permanent</option>
            <option value={ACCESS_TYPES.SCHEDULED}>Scheduled</option>
            <option value={ACCESS_TYPES.ONE_TIME}>One-time</option>
          </select>

          <select
            value={filters.status}
            onChange={(event) => handleChangeFilter({ status: event.target.value })}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>
      </div>

      <PermissionTable
        permissions={pagedPermissions}
        loading={isLoading}
        onRevoke={canManageAccess ? setPermissionToRevoke : undefined}
      />

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        hasNextPage={pagination.hasNextPage}
        hasPrevPage={pagination.hasPrevPage}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
      />

      {isGrantModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-5 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Grant Access</h2>
            <GrantPermissionForm
              devices={devices}
              onSubmit={handleGrant}
              onCancel={() => setIsGrantModalOpen(false)}
              isLoading={isGranting}
            />
          </div>
        </div>
      ) : null}

      <ConfirmModal
        isOpen={!!permissionToRevoke}
        title="Revoke Permission"
        message="Bạn có chắc muốn thu hồi quyền truy cập này?"
        confirmText="Revoke"
        variant="danger"
        isLoading={isRevoking}
        onCancel={() => setPermissionToRevoke(null)}
        onConfirm={handleConfirmRevoke}
      />
    </div>
  );
}

export default AccessControlPage;
