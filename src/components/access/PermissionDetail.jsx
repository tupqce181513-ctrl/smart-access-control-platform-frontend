import AccessTypeBadge from './AccessTypeBadge';
import ScheduleDisplay from './ScheduleDisplay';
import StatusBadge from '../common/StatusBadge';
import { formatDateTime } from '../../utils/formatDate';

function PermissionDetail({ permission }) {
  if (!permission) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Permission Detail</h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase text-gray-500 dark:text-gray-400">User</p>
          <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">
            {permission.userId?.fullName || permission.userId?.email || 'Unknown user'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{permission.userId?.email || ''}</p>
        </div>

        <div>
          <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Device</p>
          <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">
            {permission.deviceId?.name || 'Unknown device'}
          </p>
          <p className="text-xs capitalize text-gray-500 dark:text-gray-400">
            {permission.deviceId?.deviceType || ''}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Access Type</p>
          <div className="mt-1">
            <AccessTypeBadge type={permission.accessType} />
          </div>
        </div>

        <div>
          <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Status</p>
          <div className="mt-1">
            <StatusBadge status={permission.isRevoked ? 'inactive' : 'active'} />
          </div>
        </div>
      </div>

      {permission.accessType === 'scheduled' ? (
        <div>
          <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Schedule</p>
          <div className="mt-1">
            <ScheduleDisplay schedule={permission.schedule} />
          </div>
        </div>
      ) : null}

      {permission.isRevoked ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Revoked By</p>
            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
              {permission.revokedBy?.fullName || permission.revokedBy?.email || '--'}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Revoked At</p>
            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
              {permission.revokedAt ? formatDateTime(permission.revokedAt) : '--'}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Revoked Type</p>
            <p className="mt-1 text-sm capitalize text-gray-800 dark:text-gray-200">
              {permission.revokedByType || '--'}
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Created By</p>
          <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
            {permission.createdBy?.fullName || permission.createdBy?.email || '--'}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Created At</p>
          <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
            {permission.createdAt ? formatDateTime(permission.createdAt) : '--'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PermissionDetail;
