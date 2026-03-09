import { DoorOpen, Lock, Shield } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';
import { formatDateTime } from '../../utils/formatDate';

const actionStyle = {
  unlock: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  lock: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  access_denied: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const iconByType = {
  door: DoorOpen,
  gate: Shield,
  locker: Lock,
};

function ActionBadge({ action }) {
  const normalized = String(action || '').toLowerCase();
  const className = actionStyle[normalized] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${className}`}>
      {normalized.replace('_', ' ') || '--'}
    </span>
  );
}

function MethodBadge({ method }) {
  return (
    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-300">
      {method || '--'}
    </span>
  );
}

function LoadingRows() {
  return (
    <tbody>
      {Array.from({ length: 6 }).map((_, index) => (
        <tr key={index} className="border-b border-gray-100 dark:border-gray-700/70">
          {Array.from({ length: 7 }).map((__, cellIndex) => (
            <td key={cellIndex} className="px-4 py-3">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

function LogTable({ logs, loading, onViewDetail }) {
  if (!loading && logs.length === 0) {
    return <EmptyState title="No logs found" description="No access logs match your current filters." />;
  }

  return (
    <>
      <div className="block space-y-4 md:hidden">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
              <div className="mb-3 flex justify-between">
                <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))
        ) : (
          logs.map((log) => {
            const DeviceIcon = iconByType[log.deviceId?.deviceType] || DoorOpen;

            return (
              <div key={log._id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{log.userId?.fullName || 'Unknown'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{log.userId?.email || '--'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(log.timestamp)}</p>
                  </div>
                </div>

                <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50">
                  <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-800">
                      <DeviceIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{log.deviceId?.name || 'Unknown'}</p>
                      <p className="text-[10px] capitalize text-gray-500 dark:text-gray-400">
                        {log.deviceId?.deviceType || '--'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <ActionBadge action={log.action} />
                  <MethodBadge method={log.method} />
                  <StatusBadge status={log.status} />
                </div>

                <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => onViewDetail?.(log)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    View Details
                  </button>
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
            <th className="px-4 py-3 font-medium">Timestamp</th>
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Device</th>
            <th className="px-4 py-3 font-medium">Action</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Method</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">Status</th>
            <th className="px-4 py-3 font-medium">Detail</th>
          </tr>
        </thead>

        {loading ? <LoadingRows /> : null}

        {!loading ? (
          <tbody>
            {logs.map((log) => {
              const DeviceIcon = iconByType[log.deviceId?.deviceType] || DoorOpen;

              return (
                <tr key={log._id} className="border-b border-gray-100 dark:border-gray-700/70">
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatDateTime(log.timestamp)}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {log.userId?.fullName || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{log.userId?.email || '--'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                      <DeviceIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="font-medium">{log.deviceId?.name || 'Unknown'}</p>
                        <p className="text-xs capitalize text-gray-500 dark:text-gray-400">
                          {log.deviceId?.deviceType || '--'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <ActionBadge action={log.action} />
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <MethodBadge method={log.method} />
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onViewDetail?.(log)}
                      className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      Detail
                    </button>
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

export default LogTable;
