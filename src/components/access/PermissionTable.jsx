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
    <>
      <div className="block space-y-4 md:hidden">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
              <div className="mb-3 flex justify-between">
                <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="mt-4 h-8 w-full rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))
        ) : (
          permissions.map((permission) => {
            const isRevoked = !!permission.isRevoked;
            const isUsedOneTime = permission.accessType === 'one_time' && permission.revokedByType === 'system';

            return (
              <div key={permission._id} className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800 ${isRevoked ? 'opacity-60' : ''}`}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white dark:bg-blue-500">
                      {String(permission.userId?.fullName || permission.userId?.email || 'U').trim().charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{permission.userId?.fullName || 'Unknown user'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{permission.userId?.email || '--'}</p>
                    </div>
                  </div>
                  <StatusBadge status={isRevoked ? 'inactive' : 'active'} />
                </div>

                <div className="mb-4 grid grid-cols-2 gap-y-3 gap-x-2 text-sm bg-gray-50 p-3 rounded-lg dark:bg-gray-900/50">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Device</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{permission.deviceId?.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Access Type</p>
                    <div className="mt-1"><AccessTypeBadge type={permission.accessType} /></div>
                  </div>
                  {permission.accessType === 'scheduled' && (
                    <div className="col-span-2">
                       <p className="text-xs mb-1 text-gray-500 dark:text-gray-400">Schedule</p>
                       <ScheduleDisplay schedule={permission.schedule} />
                    </div>
                  )}
                  {isUsedOneTime && (
                    <div className="col-span-2">
                      <span className="rounded-full bg-purple-100 px-2 py-1 text-[10px] font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                          Used One-Time Access
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-end border-t border-gray-100 pt-3 dark:border-gray-700">
                   <div>
                     <p className="text-[10px] text-gray-500 dark:text-gray-400">Granted By: {permission.createdBy?.fullName || '--'}</p>
                     <p className="text-[10px] text-gray-500 dark:text-gray-400">{formatDateTime(permission.createdAt)}</p>
                   </div>
                  {!isRevoked && onRevoke ? (
                    <button
                      type="button"
                      onClick={() => onRevoke(permission)}
                      className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                    >
                      Revoke
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-gray-200 bg-white md:block dark:border-gray-800 dark:bg-gray-800">
        <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Device</th>
            <th className="px-4 py-3 font-medium">Access Type</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">Schedule</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Granted By</th>
            <th className="hidden px-4 py-3 font-medium lg:table-cell">Created At</th>
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

                  <td className="hidden px-4 py-3 sm:table-cell">
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

                  <td className="hidden px-4 py-3 text-gray-700 md:table-cell dark:text-gray-300">
                    {permission.createdBy?.fullName || permission.createdBy?.email || '--'}
                  </td>

                  <td className="hidden px-4 py-3 text-gray-700 lg:table-cell dark:text-gray-300">
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
    </>
  );
}

export default PermissionTable;
