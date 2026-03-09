import { LOG_ACTIONS, LOG_STATUS } from '../../utils/constants';

function LogFilter({ filters, onFilterChange, devices = [], isAdmin = false }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filters.deviceId}
          onChange={(event) => onFilterChange({ deviceId: event.target.value })}
          className="min-w-40 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          <option value="">All Devices</option>
          {devices.map((device) => (
            <option key={device._id} value={device._id}>
              {device.name}
            </option>
          ))}
        </select>

        <select
          value={filters.action}
          onChange={(event) => onFilterChange({ action: event.target.value })}
          className="min-w-36 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          <option value="">All Actions</option>
          <option value={LOG_ACTIONS.UNLOCK}>Unlock</option>
          <option value={LOG_ACTIONS.LOCK}>Lock</option>
          <option value={LOG_ACTIONS.ACCESS_DENIED}>Access Denied</option>
        </select>

        <select
          value={filters.status}
          onChange={(event) => onFilterChange({ status: event.target.value })}
          className="min-w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          <option value="">All Status</option>
          <option value={LOG_STATUS.SUCCESS}>Success</option>
          <option value={LOG_STATUS.FAILED}>Failed</option>
        </select>

        <input
          type="date"
          value={filters.startDate}
          onChange={(event) => onFilterChange({ startDate: event.target.value })}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(event) => onFilterChange({ endDate: event.target.value })}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />

        {isAdmin ? (
          <input
            value={filters.userSearch || ''}
            onChange={(event) => onFilterChange({ userSearch: event.target.value })}
            placeholder="Filter user..."
            className="min-w-44 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />
        ) : null}

        <button
          type="button"
          onClick={() =>
            onFilterChange({
              deviceId: '',
              action: '',
              status: '',
              userSearch: '',
              startDate: '',
              endDate: '',
              clearAll: true,
            })
          }
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default LogFilter;
