import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';
import AccessTypeBadge from './AccessTypeBadge';
import ScheduleDisplay from './ScheduleDisplay';
import { formatDateTime } from '../../utils/formatDate';

function LoadingRows() {
  return (
    <tbody>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="border-b border-gray-100 dark:border-gray-700/70">
          {Array.from({ length: 8 }).map((__, cellIndex) => (
            <td key={cellIndex} className="px-4 py-3">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

function PermissionTable({ permissions, onRevoke, loading }) {
  if (!loading && permissions.length === 0) {
    return (
      <EmptyState
        title="No permissions found"
        description="Không có quyền truy cập nào phù hợp với bộ lọc."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Device</th>
            <th className="px-4 py-3 font-medium">Access Type</th>
            <th className="px-4 py-3 font-medium">Schedule</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Granted By</th>
            <th className="px-4 py-3 font-medium">Created At</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>

        {loading ? <LoadingRows /> : null}

        {!loading ? (
          <tbody>
            {permissions.map((permission) => {
              const isRevoked = !!permission.isRevoked;
              const isUsedOneTime = permission.accessType === 'one_time' && permission.revokedByType === 'system';

              return (
                <tr
                  key={permission._id}
                  className={`border-b border-gray-100 dark:border-gray-700/70 ${isRevoked ? 'opacity-60' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white dark:bg-blue-500">
                        {String(
                          permission.userId?.fullName || permission.userId?.email || 'U'
                        )
                          .trim()
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {permission.userId?.fullName || permission.userId?.email || 'Unknown user'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {permission.userId?.email || '--'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {permission.deviceId?.name || 'Unknown device'}
                    </p>
                    <p className="text-xs capitalize text-gray-500 dark:text-gray-400">
                      {permission.deviceId?.deviceType || '--'}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <AccessTypeBadge type={permission.accessType} />
                  </td>

                  <td className="px-4 py-3">
                    {permission.accessType === 'scheduled' ? (
                      <ScheduleDisplay schedule={permission.schedule} />
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">--</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={isRevoked ? 'inactive' : 'active'} />
                      {isUsedOneTime ? (
                        <span className="rounded-full bg-purple-100 px-2 py-1 text-[10px] font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                          Used
                        </span>
                      ) : null}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {permission.createdBy?.fullName || permission.createdBy?.email || '--'}
                  </td>

                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {formatDateTime(permission.createdAt)}
                  </td>

                  <td className="px-4 py-3">
                    {!isRevoked && onRevoke ? (
                      <button
                        type="button"
                        onClick={() => onRevoke(permission)}
                        className="rounded border border-red-300 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                      >
                        Revoke
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-500">--</span>
                    )}
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

export default PermissionTable;
