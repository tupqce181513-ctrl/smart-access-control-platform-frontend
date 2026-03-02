import EmptyState from '../common/EmptyState';
import NotificationItem from './NotificationItem';

function LoadingList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-2 h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-1 h-3 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      ))}
    </div>
  );
}

function NotificationList({ notifications, onMarkRead, loading }) {
  if (loading) {
    return <LoadingList />;
  }

  if (notifications.length === 0) {
    return <EmptyState title="No notifications" description="Bạn chưa có thông báo nào." />;
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          onMarkRead={onMarkRead}
        />
      ))}
    </div>
  );
}

export default NotificationList;
