import { DoorOpen, Lock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { canManageDevice } from '../../utils/permissionHelpers';

const iconByType = {
  door: DoorOpen,
  gate: Shield,
  locker: Lock,
};

function LoadingRows() {
  return (
    <tbody>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="border-b border-gray-100 dark:border-gray-700/70">
          {Array.from({ length: 7 }).map((__, cellIndex) => (
            <td key={cellIndex} className="py-3 pr-3">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

function DeviceTable({ devices, onControl, onEdit, onDelete, loading }) {
  const { user } = useAuth();

  if (!loading && devices.length === 0) {
    return (
      <EmptyState
        title="No devices found"
        description="Không có thiết bị phù hợp với bộ lọc hiện tại."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Serial Number</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">State</th>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>

        {loading ? <LoadingRows /> : null}

        {!loading ? (
          <tbody>
            {devices.map((device) => {
              const canManage = canManageDevice(user, device);
              const TypeIcon = iconByType[device.deviceType] || DoorOpen;
              const controlDisabled = !device?.isEnabled || device?.status === 'offline';

              return (
                <tr key={device._id} className="border-b border-gray-100 dark:border-gray-700/70">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span>{device.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-700 dark:text-gray-300">
                    {device.deviceType}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{device.serialNumber}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={device.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={device.currentState} />
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {device?.location?.address || '--'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/devices/${device._id}`}
                        className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        View
                      </Link>
                      {onControl ? (
                        <button
                          type="button"
                          onClick={() => onControl(device)}
                          disabled={controlDisabled}
                          className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                          {device.currentState === 'unlocked' ? 'Lock' : 'Unlock'}
                        </button>
                      ) : null}
                      {canManage && onEdit ? (
                        <button
                          type="button"
                          onClick={() => onEdit(device)}
                          className="rounded border border-amber-300 px-2 py-1 text-xs text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/20"
                        >
                          Edit
                        </button>
                      ) : null}
                      {canManage && onDelete ? (
                        <button
                          type="button"
                          onClick={() => onDelete(device)}
                          className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        ) : null}
      </table>
    </div>
  );
}

export default DeviceTable;
