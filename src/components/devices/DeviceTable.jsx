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
    <>
      {/* Mobile Card View */}
      <div className="block space-y-4 md:hidden">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
              <div className="mb-3 h-5 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-2">
                <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))
        ) : (
          devices.map((device) => {
            const canManage = canManageDevice(user, device);
            const TypeIcon = iconByType[device.deviceType] || DoorOpen;
            const controlDisabled = !device?.isEnabled || device?.status === 'offline';

            return (
              <div key={device._id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                      <TypeIcon className="h-4 w-4" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{device.name}</h3>
                  </div>
                  <StatusBadge status={device.status} />
                </div>

                <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Type</p>
                    <p className="font-medium capitalize text-gray-900 dark:text-gray-100">{device.deviceType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">State</p>
                    <div className="mt-1"><StatusBadge status={device.currentState} /></div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 dark:text-gray-400">Serial Number</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{device.serialNumber}</p>
                  </div>
                  {device?.location?.address && (
                    <div className="col-span-2">
                      <p className="text-gray-500 dark:text-gray-400">Location</p>
                      <p className="text-gray-700 dark:text-gray-300">{device.location.address}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                  <Link
                    to={`/devices/${device._id}`}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    View
                  </Link>
                  {onControl ? (
                    <button
                      type="button"
                      onClick={() => onControl(device)}
                      disabled={controlDisabled}
                      className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      {device.currentState === 'unlocked' ? 'Lock' : 'Unlock'}
                    </button>
                  ) : null}
                  {canManage && onEdit ? (
                    <button
                      type="button"
                      onClick={() => onEdit(device)}
                      className="rounded-lg border border-amber-300 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/20"
                    >
                      Edit
                    </button>
                  ) : null}
                  {canManage && onDelete ? (
                    <button
                      type="button"
                      onClick={() => onDelete(device)}
                      className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden overflow-x-auto rounded-xl border border-gray-200 bg-white md:block dark:border-gray-800 dark:bg-gray-800">
        <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">Type</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Serial Number</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">State</th>
            <th className="hidden px-4 py-3 font-medium lg:table-cell">Location</th>
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
                  <td className="hidden px-4 py-3 capitalize text-gray-700 sm:table-cell dark:text-gray-300">
                    {device.deviceType}
                  </td>
                  <td className="hidden px-4 py-3 text-gray-700 md:table-cell dark:text-gray-300">
                    {device.serialNumber}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={device.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={device.currentState} />
                  </td>
                  <td className="hidden px-4 py-3 text-gray-700 lg:table-cell dark:text-gray-300">
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
    </>
  );
}

export default DeviceTable;
