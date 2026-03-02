import { formatDate } from '../../utils/formatDate';
import { formatDaysOfWeek, formatTimeRange } from '../../utils/formatSchedule';

function ScheduleDisplay({ schedule }) {
  if (!schedule) {
    return <span className="text-gray-400 dark:text-gray-500">--</span>;
  }

  const dateRange =
    schedule.startTime && schedule.endTime
      ? `${formatDate(schedule.startTime)} - ${formatDate(schedule.endTime)}`
      : '--';
  const days = formatDaysOfWeek(schedule.daysOfWeek || []);
  const time = formatTimeRange(schedule?.timeOfDay?.from, schedule?.timeOfDay?.to);

  return (
    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
      <p>{dateRange}</p>
      <p>{days || '--'}</p>
      <p>{time || '--'}</p>
    </div>
  );
}

export default ScheduleDisplay;
