import { DoorOpen, Lock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { canManageDevice } from '../../utils/permissionHelpers';

const iconByType = {
  door: DoorOpen,
  gate: Shield,
  locker: Lock,
};

function DeviceCard({ device, onControl, onEdit, onDelete }) {
  const { user } = useAuth();
  const canManage = canManageDevice(user, device);
  const TypeIcon = iconByType[device?.deviceType] || DoorOpen;

  const controlDisabled = !device?.isEnabled || device?.status === 'offline';
  const controlLabel = device?.currentState === 'unlocked' ? 'Lock' : 'Unlock';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{device?.name}</h3>
          <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
            SN: {device?.serialNumber}
          </p>
        </div>
        <div className="rounded-lg bg-gray-100 p-2 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
          <TypeIcon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={device?.status} />
        <StatusBadge status={device?.currentState} />
      </div>

      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
        {device?.location?.address || 'Chưa có địa chỉ'}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          to={`/devices/${device?._id}`}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          View
        </Link>

        {onControl ? (
          <button
            type="button"
            onClick={() => onControl(device)}
            disabled={controlDisabled}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {controlLabel}
          </button>
        ) : null}

        {canManage && onEdit ? (
          <button
            type="button"
            onClick={() => onEdit(device)}
            className="rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/20"
          >
            Edit
          </button>
        ) : null}

        {canManage && onDelete ? (
          <button
            type="button"
            onClick={() => onDelete(device)}
            className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
          >
            Delete
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DeviceCard;
