import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import NotificationList from '../components/notifications/NotificationList';
import Pagination from '../components/common/Pagination';
import { useNotifications } from '../hooks/useNotifications';

function NotificationsPage() {
  const {
    unreadCount,
    notifications,
    pagination,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    fetchUnreadCount,
  } = useNotifications();

  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchNotifications({
      page,
      limit: 10,
      isRead: showUnreadOnly ? false : undefined,
    }).catch(() => {
      toast.error('Không thể tải notifications');
    });
  }, [fetchNotifications, page, showUnreadOnly]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
    } catch (error) {
      const message = error?.response?.data?.message || 'Không thể đánh dấu đã đọc';
      toast.error(message);
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead();
      await fetchNotifications({
        page,
        limit: 10,
        isRead: showUnreadOnly ? false : undefined,
      });
      await fetchUnreadCount();
      toast.success('Đã đánh dấu tất cả là đã đọc');
    } catch (error) {
      const message = error?.response?.data?.message || 'Không thể đánh dấu tất cả';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You have {unreadCount} unread notifications.
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAll}
          disabled={unreadCount === 0}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Mark all as read
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setShowUnreadOnly(false);
            setPage(1);
          }}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            !showUnreadOnly
              ? 'bg-blue-600 text-white dark:bg-blue-500'
              : 'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-200'
          }`}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => {
            setShowUnreadOnly(true);
            setPage(1);
          }}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            showUnreadOnly
              ? 'bg-blue-600 text-white dark:bg-blue-500'
              : 'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-200'
          }`}
        >
          Unread only
        </button>
      </div>

      <NotificationList
        notifications={notifications}
        loading={loading}
        onMarkRead={handleMarkAsRead}
      />

      <Pagination
        page={pagination.page || page}
        totalPages={pagination.totalPages || 1}
        hasNextPage={pagination.hasNextPage || false}
        hasPrevPage={pagination.hasPrevPage || false}
        onPageChange={setPage}
      />
    </div>
  );
}

export default NotificationsPage;
