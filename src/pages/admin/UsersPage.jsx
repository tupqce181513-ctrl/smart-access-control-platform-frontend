import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getUsers, toggleUserActive, updateUserRole } from '../../api/userApi';
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
  const [actionType, setActionType] = useState('toggle'); // 'toggle' | 'promote'

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

  const handleConfirmAction = async () => {
    if (!selectedUser?._id || selectedIsSelf) {
      setSelectedUser(null);
      return;
    }

    setToggleLoading(true);

    try {
      if (actionType === 'toggle') {
        await toggleUserActive(selectedUser._id);
        toast.success('User status updated');
      } else if (actionType === 'promote') {
        await updateUserRole(selectedUser._id, 'owner');
        toast.success('User promoted to Owner');
      }

      setSelectedUser(null);

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
      const message = error?.response?.data?.message || 'Action failed';
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
        <>
          {/* Mobile Card View */}
          <div className="block space-y-4 md:hidden">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </div>
                  <div className="mt-4 h-8 w-full rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              ))
            ) : (
              users.map((item) => {
                const isSelf = item._id === user?._id;
                const initials = String(item.fullName || item.email || 'U').trim().charAt(0).toUpperCase();

                return (
                  <div key={item._id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white dark:bg-blue-500">
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{item.fullName || '--'}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Role</p>
                        <div className="mt-1 flex items-center gap-2">
                          <RoleBadge role={item.role} />
                          {item.role === ROLES.ADMIN ? (
                            <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                              Admin
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Status</p>
                        <div className="mt-1">
                          <StatusBadge status={item.isActive ? 'active' : 'inactive'} />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500 dark:text-gray-400">Last Login</p>
                        <p className="mt-1 text-gray-700 dark:text-gray-300">
                          {item.lastLoginAt ? formatDateTime(item.lastLoginAt) : '--'}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 dark:border-gray-700">
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => {
                            setActionType('toggle');
                            setSelectedUser(item);
                          }}
                          className={`w-full rounded-lg px-4 py-2 text-sm font-medium ${
                            item.isActive
                              ? 'border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20'
                              : 'border border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/20'
                          } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          {item.isActive ? 'Deactivate User' : 'Activate User'}
                        </button>
                        {item.role !== 'owner' && (
                          <button
                            type="button"
                            disabled={isSelf}
                            onClick={() => {
                              setActionType('promote');
                              setSelectedUser(item);
                            }}
                            className="w-full rounded-lg border border-purple-300 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/20"
                          >
                            Promote to Owner
                          </button>
                        )}
                      </div>
                      {isSelf ? (
                        <p className="mt-2 text-center text-xs text-gray-400">Cannot modify yourself</p>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden overflow-x-auto rounded-xl border border-gray-200 bg-white md:block dark:border-gray-800 dark:bg-gray-800">
            <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <th className="px-4 py-3 font-medium">Avatar</th>
                <th className="px-4 py-3 font-medium">Full Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Last Login</th>
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
                        <td className="hidden px-4 py-3 text-gray-700 md:table-cell dark:text-gray-300">
                          {item.lastLoginAt ? formatDateTime(item.lastLoginAt) : '--'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={isSelf}
                              onClick={() => {
                                setActionType('toggle');
                                setSelectedUser(item);
                              }}
                              className={`rounded px-3 py-1.5 text-xs font-medium ${
                                item.isActive
                                  ? 'border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20'
                                  : 'border border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/20'
                              } disabled:cursor-not-allowed disabled:opacity-50`}
                            >
                              {item.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            {item.role !== 'owner' && (
                              <button
                                type="button"
                                disabled={isSelf}
                                onClick={() => {
                                  setActionType('promote');
                                  setSelectedUser(item);
                                }}
                                className="rounded border border-purple-300 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/20"
                              >
                                Promote to Owner
                              </button>
                            )}
                          </div>
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
        </>
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
        title={
          actionType === 'promote'
            ? 'Promote User'
            : selectedUser?.isActive
              ? 'Deactivate User'
              : 'Activate User'
        }
        message={
          selectedUser
            ? actionType === 'promote'
              ? `Are you sure you want to promote ${selectedUser.fullName || selectedUser.email} to Owner? They will have full access equivalent to Admin.`
              : `Are you sure you want to ${selectedUser.isActive ? 'deactivate' : 'activate'} ${selectedUser.fullName || selectedUser.email}?`
            : ''
        }
        confirmText={
          actionType === 'promote'
            ? 'Promote to Owner'
            : selectedUser?.isActive
              ? 'Deactivate'
              : 'Activate'
        }
        variant={
          actionType === 'promote'
            ? 'info'
            : selectedUser?.isActive
              ? 'danger'
              : 'info'
        }
        isLoading={toggleLoading}
        onCancel={() => setSelectedUser(null)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}

export default UsersPage;
