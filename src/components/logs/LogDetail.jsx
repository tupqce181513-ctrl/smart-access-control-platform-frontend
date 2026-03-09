import StatusBadge from '../common/StatusBadge';
import { formatDateTime } from '../../utils/formatDate';

const actionStyle = {
  unlock: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  lock: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  access_denied: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
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

function MetaRow({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 break-all text-sm text-gray-800 dark:text-gray-200">{value || '--'}</p>
    </div>
  );
}

function LogDetail({ log }) {
  if (!log) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Log Detail</h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <MetaRow label="Timestamp" value={formatDateTime(log.timestamp)} />
        <MetaRow label="Fail Reason" value={log.failReason || '--'} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase text-gray-500 dark:text-gray-400">User</p>
          <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">
            {log.userId?.fullName || 'Unknown'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{log.userId?.email || '--'}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Device</p>
          <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">
            {log.deviceId?.name || 'Unknown'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {log.deviceId?.deviceType || '--'} • {log.deviceId?.serialNumber || '--'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ActionBadge action={log.action} />
        <MethodBadge method={log.method} />
        <StatusBadge status={log.status} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetaRow label="IP Address" value={log.metadata?.ipAddress} />
        <MetaRow label="RFID Card" value={log.metadata?.rfidCardId} />
        <MetaRow label="User Agent" value={log.metadata?.userAgent} />
      </div>
    </div>
  );
}

export default LogDetail;
