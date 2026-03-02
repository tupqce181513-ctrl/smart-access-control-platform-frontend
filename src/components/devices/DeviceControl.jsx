import { useState } from 'react';
import toast from 'react-hot-toast';
import { sendCommand } from '../../api/deviceApi';
import ConfirmModal from '../common/ConfirmModal';
import StatusBadge from '../common/StatusBadge';

function DeviceControl({ device, onCommand }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!device) {
    return null;
  }

  const command = device.currentState === 'unlocked' ? 'lock' : 'unlock';
  const disabled = !device.isEnabled || device.status === 'offline';

  const handleConfirm = async () => {
    setIsSubmitting(true);

    try {
      if (onCommand) {
        await onCommand(device, command);
      } else {
        await sendCommand(device._id, command);
      }

      toast.success(`Đã gửi lệnh ${command}`);
      setIsConfirmOpen(false);
    } catch (error) {
      const message = error?.response?.data?.message || 'Không thể gửi lệnh điều khiển';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Device Control</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Current state</p>
        </div>
        <StatusBadge status={device.currentState} size="md" />
      </div>

      {!device.isEnabled ? (
        <p className="mt-3 text-sm text-amber-600 dark:text-amber-400">
          Thiết bị đang bị vô hiệu hóa. Không thể điều khiển.
        </p>
      ) : null}

      {device.status === 'offline' ? (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">
          Thiết bị đang offline. Vui lòng thử lại khi online.
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => setIsConfirmOpen(true)}
        disabled={disabled}
        className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        {command === 'lock' ? 'Lock Device' : 'Unlock Device'}
      </button>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title={command === 'lock' ? 'Lock Device' : 'Unlock Device'}
        message={`Bạn có chắc muốn ${command} thiết bị "${device.name}"?`}
        confirmText={command === 'lock' ? 'Lock' : 'Unlock'}
        variant={command === 'lock' ? 'warning' : 'info'}
        isLoading={isSubmitting}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

export default DeviceControl;
