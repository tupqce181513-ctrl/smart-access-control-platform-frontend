import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Grid3X3, List } from 'lucide-react';

import { createDevice, deleteDevice, sendCommand, updateDevice } from '../api/deviceApi';
import ConfirmModal from '../components/common/ConfirmModal';
import Pagination from '../components/common/Pagination';
import DeviceCard from '../components/devices/DeviceCard';
import DeviceControl from '../components/devices/DeviceControl';
import DeviceForm from '../components/devices/DeviceForm';
import DeviceTable from '../components/devices/DeviceTable';
import { useAuth } from '../hooks/useAuth';
import { useDevices } from '../hooks/useDevices';
import { DEVICE_STATUS, DEVICE_TYPES, ROLES } from '../utils/constants';

function DevicesPage() {
  const { user } = useAuth();
  const { devices, loading, error, pagination, filters, setFilters, setPage, fetchDevices } = useDevices({
    page: 1,
    limit: 10,
  });

  const [viewMode, setViewMode] = useState('table');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isControlOpen, setIsControlOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const canCreateDevice = useMemo(
    () => user?.role === ROLES.ADMIN || user?.role === ROLES.OWNER,
    [user?.role]
  );

  const refreshList = async () => {
    await fetchDevices();
  };

  const handleFilterChange = (nextValues) => {
    setFilters((prev) => ({
      ...prev,
      ...nextValues,
      page: 1,
    }));
  };

  const handleApplySearch = (event) => {
    event.preventDefault();
    handleFilterChange({ search: searchInput.trim() });
  };

  const handleCreate = () => {
    setSelectedDevice(null);
    setIsFormOpen(true);
  };

  const handleEdit = (device) => {
    setSelectedDevice(device);
    setIsFormOpen(true);
  };

  const handleDelete = (device) => {
    setDeviceToDelete(device);
  };

  const handleControl = (device) => {
    setSelectedDevice(device);
    setIsControlOpen(true);
  };

  const handleSubmitForm = async (payload) => {
    setIsSubmitting(true);

    try {
      if (selectedDevice?._id) {
        await updateDevice(selectedDevice._id, payload);
        toast.success('Cập nhật thiết bị thành công');
      } else {
        await createDevice(payload);
        toast.success('Tạo thiết bị thành công');
      }

      setIsFormOpen(false);
      setSelectedDevice(null);
      await refreshList();
    } catch (apiError) {
      const message = apiError?.response?.data?.message || 'Không thể lưu thiết bị';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deviceToDelete?._id) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteDevice(deviceToDelete._id);
      toast.success('Xóa thiết bị thành công');
      setDeviceToDelete(null);
      await refreshList();
    } catch (apiError) {
      const message = apiError?.response?.data?.message || 'Không thể xóa thiết bị';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCommand = async (device, command) => {
    await sendCommand(device._id, command);
    await refreshList();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Devices</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and control your devices.
          </p>
        </div>

        {canCreateDevice ? (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Add Device
          </button>
        ) : null}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
        <form className="grid grid-cols-1 gap-3 md:grid-cols-4" onSubmit={handleApplySearch}>
          <select
            value={filters.deviceType || ''}
            onChange={(event) => handleFilterChange({ deviceType: event.target.value })}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          >
            <option value="">All Types</option>
            <option value={DEVICE_TYPES.DOOR}>Door</option>
            <option value={DEVICE_TYPES.GATE}>Gate</option>
            <option value={DEVICE_TYPES.LOCKER}>Locker</option>
          </select>

          <select
            value={filters.status || ''}
            onChange={(event) => handleFilterChange({ status: event.target.value })}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          >
            <option value="">All Status</option>
            <option value={DEVICE_STATUS.ONLINE}>Online</option>
            <option value={DEVICE_STATUS.OFFLINE}>Offline</option>
          </select>

          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name/serial..."
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />

          <button
            type="submit"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Apply Filters
          </button>
        </form>

        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`rounded-lg px-3 py-2 text-sm ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-200'
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <List className="h-4 w-4" />
              Table
            </span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`rounded-lg px-3 py-2 text-sm ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-200'
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <Grid3X3 className="h-4 w-4" />
              Grid
            </span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {viewMode === 'table' ? (
        <DeviceTable
          devices={devices}
          loading={loading}
          onControl={handleControl}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {devices.map((device) => (
            <DeviceCard
              key={device._id}
              device={device}
              onControl={handleControl}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Pagination
        page={pagination.page || 1}
        totalPages={pagination.totalPages || 1}
        hasNextPage={pagination.hasNextPage || false}
        hasPrevPage={pagination.hasPrevPage || false}
        onPageChange={setPage}
      />

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-5 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {selectedDevice ? 'Edit Device' : 'Add Device'}
            </h2>
            <DeviceForm
              device={selectedDevice}
              onSubmit={handleSubmitForm}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedDevice(null);
              }}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      ) : null}

      {isControlOpen && selectedDevice ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 dark:bg-gray-800">
            <DeviceControl
              device={selectedDevice}
              onCommand={async (device, command) => {
                await handleCommand(device, command);
                setIsControlOpen(false);
                setSelectedDevice(null);
              }}
            />
            <button
              type="button"
              onClick={() => {
                setIsControlOpen(false);
                setSelectedDevice(null);
              }}
              className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      <ConfirmModal
        isOpen={!!deviceToDelete}
        title="Delete Device"
        message={`Bạn có chắc muốn xóa thiết bị "${deviceToDelete?.name || ''}"?`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
        onCancel={() => setDeviceToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default DevicesPage;
