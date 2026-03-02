import { Key, ShieldAlert, WifiOff, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../../utils/formatDate';

const iconByType = {
  access_alert: {
    icon: ShieldAlert,
    className: 'text-amber-600 dark:text-amber-400',
  },
  device_offline: {
    icon: WifiOff,
    className: 'text-red-600 dark:text-red-400',
  },
  permission_granted: {
    icon: Key,
    className: 'text-green-600 dark:text-green-400',
  },
  permission_revoked: {
    icon: XCircle,
    className: 'text-red-600 dark:text-red-400',
  },
};

function NotificationItem({ notification, onMarkRead }) {
  const config = iconByType[notification?.type] || iconByType.access_alert;
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={() => {
        if (!notification.isRead) {
          onMarkRead(notification._id);
        }
      }}
      className={`w-full rounded-xl border p-4 text-left transition ${
        notification.isRead
          ? 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/60'
          : 'border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-900/40 dark:bg-blue-900/20 dark:hover:bg-blue-900/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex items-center gap-2">
          {!notification.isRead ? (
            <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
          ) : null}
          <Icon className={`h-5 w-5 ${config.className}`} />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`text-sm ${
              notification.isRead
                ? 'font-medium text-gray-800 dark:text-gray-200'
                : 'font-semibold text-gray-900 dark:text-gray-100'
            }`}
          >
            {notification.title}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {formatTimeAgo(notification.createdAt)}
          </p>

          {notification.relatedDevice ? (
            <Link
              to={`/devices/${notification.relatedDevice?._id || notification.relatedDevice}`}
              className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              onClick={(event) => event.stopPropagation()}
            >
              View related device
            </Link>
          ) : null}
        </div>
      </div>
    </button>
  );
}

export default NotificationItem;
