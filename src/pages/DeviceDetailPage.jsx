import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { getDevicePermissions } from '../api/accessApi';
import { getDevice, sendCommand } from '../api/deviceApi';
import { getDeviceLogs } from '../api/logApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DeviceDetail from '../components/devices/DeviceDetail';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

const extractPayload = (response) => response?.data ?? response ?? {};

function DeviceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [device, setDevice] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const canViewPermissions = user?.role === ROLES.ADMIN || user?.role === ROLES.OWNER;

  const fetchDetail = useCallback(async () => {
    if (!id) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const requests = [getDevice(id), getDeviceLogs(id, { page: 1, limit: 10 })];

      if (canViewPermissions) {
        requests.push(getDevicePermissions(id));
      }

      const results = await Promise.all(requests);

      const devicePayload = extractPayload(results[0]);
      const logsPayload = extractPayload(results[1]);
      const permissionsPayload = canViewPermissions ? extractPayload(results[2]) : { data: [] };

      setDevice(devicePayload);
      setRecentLogs(Array.isArray(logsPayload.data) ? logsPayload.data : []);
      setPermissions(Array.isArray(permissionsPayload.data) ? permissionsPayload.data : []);
    } catch (apiError) {
      const message = apiError?.response?.data?.message || 'Không thể tải chi tiết thiết bị';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [canViewPermissions, id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleCommand = async (targetDevice, command) => {
    await sendCommand(targetDevice._id, command);
    toast.success(`Đã gửi lệnh ${command}`);
    await fetchDetail();
  };

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <DeviceDetail
        device={device}
        permissions={permissions}
        recentLogs={recentLogs}
        onControl={handleCommand}
        onEdit={() => navigate('/devices')}
      />
    </div>
  );
}

export default DeviceDetailPage;
