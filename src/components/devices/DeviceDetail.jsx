import { Pencil } from 'lucide-react';
import DeviceControl from './DeviceControl';
import StatusBadge from '../common/StatusBadge';
import { formatDateTime } from '../../utils/formatDate';

function DeviceDetail({
  device,
  permissions = [],
  recentLogs = [],
  onControl,
  onEdit,
}) {
  if (!device) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{device.name}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Serial: {device.serialNumber}</p>
          </div>

          {onEdit ? (
            <button
              type="button"
              onClick={() => onEdit(device)}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-300 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/20"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Type</p>
            <p className="mt-1 capitalize text-gray-800 dark:text-gray-200">{device.deviceType}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Firmware</p>
            <p className="mt-1 text-gray-800 dark:text-gray-200">{device.firmwareVersion || '--'}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Status</p>
            <div className="mt-1">
              <StatusBadge status={device.status} />
            </div>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Current State</p>
            <div className="mt-1">
              <StatusBadge status={device.currentState} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Location</p>
            <p className="mt-1 text-gray-800 dark:text-gray-200">{device.location?.address || '--'}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {device.location?.description || ''}
            </p>
          </div>
        </div>
      </section>

      <DeviceControl device={device} onCommand={onControl} />

      {permissions.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Access Permissions</h2>
          <div className="mt-3 space-y-2">
            {permissions.map((permission) => (
              <div
                key={permission._id}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 dark:border-gray-700"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {permission.userId?.fullName || permission.userId?.email || 'Unknown user'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {permission.accessType}
                  </p>
                </div>
                <StatusBadge status={permission.isRevoked ? 'inactive' : 'active'} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Logs</h2>
        <div className="mt-3 space-y-2">
          {recentLogs.map((log) => (
            <div
              key={log._id}
              className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 dark:border-gray-700"
            >
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">
                  {log.action} - {log.method}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(log.timestamp)}</p>
              </div>
              <StatusBadge status={log.status} />
            </div>
          ))}

          {recentLogs.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No logs available.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default DeviceDetail;
