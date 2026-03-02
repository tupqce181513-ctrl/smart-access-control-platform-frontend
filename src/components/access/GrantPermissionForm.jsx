import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { getUsers } from '../../api/userApi';
import { ACCESS_TYPES, DAYS_OF_WEEK } from '../../utils/constants';

const defaultState = {
  userId: '',
  selectedUser: null,
  deviceId: '',
  accessType: ACCESS_TYPES.PERMANENT,
  startTime: '',
  endTime: '',
  daysOfWeek: [],
  fromTime: '',
  toTime: '',
};

function GrantPermissionForm({ devices, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState(defaultState);
  const [errors, setErrors] = useState({});
  const [query, setQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const isScheduled = formData.accessType === ACCESS_TYPES.SCHEDULED;

  useEffect(() => {
    const keyword = query.trim();

    if (!keyword) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);

      try {
        const response = await getUsers({ page: 1, limit: 10, search: keyword });
        const payload = response?.data ?? response ?? {};
        const users = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];
        setSearchResults(users);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const validate = () => {
    const nextErrors = {};

    if (!formData.userId) {
      nextErrors.userId = 'User là bắt buộc';
    }

    if (!formData.deviceId) {
      nextErrors.deviceId = 'Device là bắt buộc';
    }

    if (!formData.accessType) {
      nextErrors.accessType = 'Access type là bắt buộc';
    }

    if (isScheduled) {
      if (!formData.startTime || !formData.endTime) {
        nextErrors.dateRange = 'Vui lòng chọn khoảng ngày';
      } else if (new Date(formData.startTime) >= new Date(formData.endTime)) {
        nextErrors.dateRange = 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc';
      }

      if (!formData.fromTime || !formData.toTime) {
        nextErrors.timeRange = 'Vui lòng chọn khoảng giờ';
      } else if (formData.fromTime >= formData.toTime) {
        nextErrors.timeRange = 'Giờ bắt đầu phải nhỏ hơn giờ kết thúc';
      }

      if (formData.daysOfWeek.length === 0) {
        nextErrors.daysOfWeek = 'Chọn ít nhất 1 ngày trong tuần';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = {
      userId: formData.userId,
      deviceId: formData.deviceId,
      accessType: formData.accessType,
    };

    if (isScheduled) {
      payload.schedule = {
        startTime: formData.startTime,
        endTime: formData.endTime,
        daysOfWeek: formData.daysOfWeek,
        timeOfDay: {
          from: formData.fromTime,
          to: formData.toTime,
        },
      };
    }

    onSubmit(payload);
  };

  const selectedUserLabel = useMemo(() => {
    if (!formData.selectedUser) {
      return '';
    }

    return `${formData.selectedUser.fullName || ''} (${formData.selectedUser.email || ''})`.trim();
  }, [formData.selectedUser]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">User</label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={selectedUserLabel || query}
            onChange={(event) => {
              setQuery(event.target.value);
              setFormData((prev) => ({
                ...prev,
                userId: '',
                selectedUser: null,
              }));
            }}
            placeholder="Search name/email..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />

          {query && !selectedUserLabel ? (
            <div className="absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              {searchLoading ? (
                <p className="px-2 py-2 text-sm text-gray-500 dark:text-gray-400">Searching...</p>
              ) : null}

              {!searchLoading && searchResults.length === 0 ? (
                <p className="px-2 py-2 text-sm text-gray-500 dark:text-gray-400">No users found</p>
              ) : null}

              {!searchLoading
                ? searchResults.map((result) => (
                    <button
                      key={result._id}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          userId: result._id,
                          selectedUser: result,
                        }));
                        setQuery('');
                      }}
                      className="block w-full rounded-md px-2 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <p className="font-medium">{result.fullName || result.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{result.email}</p>
                    </button>
                  ))
                : null}
            </div>
          ) : null}
        </div>
        {errors.userId ? <p className="mt-1 text-xs text-red-500">{errors.userId}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Device</label>
        <select
          value={formData.deviceId}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              deviceId: event.target.value,
            }))
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          <option value="">Select device</option>
          {devices.map((device) => (
            <option key={device._id} value={device._id}>
              {device.name}
            </option>
          ))}
        </select>
        {errors.deviceId ? <p className="mt-1 text-xs text-red-500">{errors.deviceId}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
          Access Type
        </label>
        <select
          value={formData.accessType}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              accessType: event.target.value,
            }))
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          <option value={ACCESS_TYPES.PERMANENT}>Permanent</option>
          <option value={ACCESS_TYPES.SCHEDULED}>Scheduled</option>
          <option value={ACCESS_TYPES.ONE_TIME}>One-time</option>
        </select>
      </div>

      {isScheduled ? (
        <div className="space-y-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startTime}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    startTime: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                End Date
              </label>
              <input
                type="date"
                value={formData.endTime}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    endTime: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          {errors.dateRange ? <p className="text-xs text-red-500">{errors.dateRange}</p> : null}

          <div>
            <p className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-300">Days of Week</p>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <label
                  key={day.value}
                  className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-2.5 py-1 text-xs text-gray-700 dark:border-gray-700 dark:text-gray-200"
                >
                  <input
                    type="checkbox"
                    checked={formData.daysOfWeek.includes(day.value)}
                    onChange={(event) => {
                      setFormData((prev) => ({
                        ...prev,
                        daysOfWeek: event.target.checked
                          ? [...prev.daysOfWeek, day.value]
                          : prev.daysOfWeek.filter((value) => value !== day.value),
                      }));
                    }}
                    className="h-3.5 w-3.5"
                  />
                  {day.label}
                </label>
              ))}
            </div>
            {errors.daysOfWeek ? <p className="mt-1 text-xs text-red-500">{errors.daysOfWeek}</p> : null}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                From
              </label>
              <input
                type="time"
                value={formData.fromTime}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    fromTime: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                To
              </label>
              <input
                type="time"
                value={formData.toTime}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    toTime: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          {errors.timeRange ? <p className="text-xs text-red-500">{errors.timeRange}</p> : null}
        </div>
      ) : null}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isLoading ? 'Granting...' : 'Grant Access'}
        </button>
      </div>
    </form>
  );
}

export default GrantPermissionForm;
