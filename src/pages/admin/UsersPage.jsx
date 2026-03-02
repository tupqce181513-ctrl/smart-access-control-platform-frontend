import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getUsers, toggleUserActive } from '../../api/userApi';
import ConfirmModal from '../../components/common/ConfirmModal';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import RoleBadge from '../../components/common/RoleBadge';
import StatusBadge from '../../components/common/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatDate';

const normalizePayload = (response) => response?.data ?? response ?? {};

function UsersPage() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(false);

  const unauthorized = user?.role !== ROLES.ADMIN;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (unauthorized) {
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);

      try {
        const response = await getUsers({
          page: pagination.page,
          limit: pagination.limit,
          search: debouncedSearch || undefined,
        });

        const payload = normalizePayload(response);
        const list = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

        setUsers(list);
        setPagination((prev) => ({
          ...prev,
          ...(payload?.pagination || {}),
        }));
      } catch (error) {
        const message = error?.response?.data?.message || 'Không thể tải danh sách users';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedSearch, pagination.limit, pagination.page, unauthorized]);

  const selectedIsSelf = useMemo(
    () => selectedUser?._id && selectedUser._id === user?._id,
    [selectedUser?._id, user?._id]
  );

  const handleToggleConfirm = async () => {
    if (!selectedUser?._id || selectedIsSelf) {
      setSelectedUser(null);
      return;
    }

    setToggleLoading(true);

    try {
      await toggleUserActive(selectedUser._id);
      toast.success('User status updated');
      setSelectedUser(null);

      const response = await getUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
      });
      const payload = normalizePayload(response);
      setUsers(Array.isArray(payload?.data) ? payload.data : []);
      setPagination((prev) => ({
        ...prev,
        ...(payload?.pagination || {}),
      }));
    } catch (error) {
      const message = error?.response?.data?.message || 'Không thể cập nhật trạng thái user';
      toast.error(message);
    } finally {
      setToggleLoading(false);
    }
  };

  if (unauthorized) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
        <h1 className="text-xl font-semibold">Unauthorized</h1>
        <p className="mt-2 text-sm">Only admin can access User Management page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">User Management</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage user status and roles.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by name or email..."
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </div>

      {!loading && users.length === 0 ? (
        <EmptyState title="No users found" description="No users match your search criteria." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <th className="px-4 py-3 font-medium">Avatar</th>
                <th className="px-4 py-3 font-medium">Full Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last Login</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700/70">
                      {Array.from({ length: 7 }).map((__, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3">
                          <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        </td>
                      ))}
                    </tr>
                  ))
                : users.map((item) => {
                    const isSelf = item._id === user?._id;
                    const initials = String(item.fullName || item.email || 'U')
                      .trim()
                      .charAt(0)
                      .toUpperCase();

                    return (
                      <tr key={item._id} className="border-b border-gray-100 dark:border-gray-700/70">
                        <td className="px-4 py-3">
                          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white dark:bg-blue-500">
                            {initials}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                          {item.fullName || '--'}
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.email}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <RoleBadge role={item.role} />
                            {item.role === ROLES.ADMIN ? (
                              <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                Admin user
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={item.isActive ? 'active' : 'inactive'} />
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                          {item.lastLoginAt ? formatDateTime(item.lastLoginAt) : '--'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            disabled={isSelf}
                            onClick={() => setSelectedUser(item)}
                            className={`rounded px-3 py-1.5 text-xs font-medium ${
                              item.isActive
                                ? 'border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20'
                                : 'border border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/20'
                            } disabled:cursor-not-allowed disabled:opacity-50`}
                          >
                            {item.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          {isSelf ? (
                            <p className="mt-1 text-[10px] text-gray-400">Cannot modify yourself</p>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={pagination.page || 1}
        totalPages={pagination.totalPages || 1}
        hasNextPage={pagination.hasNextPage || false}
        hasPrevPage={pagination.hasPrevPage || false}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />

      <ConfirmModal
        isOpen={!!selectedUser}
        title={selectedUser?.isActive ? 'Deactivate User' : 'Activate User'}
        message={
          selectedUser
            ? `Are you sure you want to ${selectedUser.isActive ? 'deactivate' : 'activate'} ${selectedUser.fullName || selectedUser.email}?`
            : ''
        }
        confirmText={selectedUser?.isActive ? 'Deactivate' : 'Activate'}
        variant={selectedUser?.isActive ? 'danger' : 'info'}
        isLoading={toggleLoading}
        onCancel={() => setSelectedUser(null)}
        onConfirm={handleToggleConfirm}
      />
    </div>
  );
}

export default UsersPage;
