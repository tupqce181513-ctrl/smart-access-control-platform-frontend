import { formatDate } from './formatDate';
import { DAYS_OF_WEEK } from './constants';

/**
 * Format days of week array to string (e.g., [1, 3, 5] -> "T2, T4, T6")
 * @param {number[]} daysArray - Array of day numbers (0-6)
 * @returns {string} Formatted days string
 */
export const formatDaysOfWeek = (daysArray) => {
  if (!daysArray || !Array.isArray(daysArray) || daysArray.length === 0) {
    return '';
  }

  return daysArray
    .sort((a, b) => a - b)
    .map(day => {
      const dayObj = DAYS_OF_WEEK.find(d => d.value === day);
      return dayObj ? dayObj.label : '';
    })
    .filter(Boolean)
    .join(', ');
};

/**
 * Format time range (e.g., "08:00 - 17:00")
 * @param {string} from - Start time in HH:mm format
 * @param {string} to - End time in HH:mm format
 * @returns {string} Formatted time range
 */
export const formatTimeRange = (from, to) => {
  if (!from || !to) return '';
  return `${from} - ${to}`;
};

/**
 * Format schedule object to human-readable string
 * Example: "T2, T4, T6 | 08:00 - 17:00 | 01/01/2024 - 31/12/2024"
 * @param {Object} schedule - Schedule object with daysOfWeek, timeOfDay, startTime, endTime
 * @returns {string} Formatted schedule string
 */
export const formatSchedule = (schedule) => {
  if (!schedule) return '';

  const parts = [];

  // Format days of week
  if (schedule.daysOfWeek && schedule.daysOfWeek.length > 0) {
    parts.push(formatDaysOfWeek(schedule.daysOfWeek));
  }

  // Format time range
  if (schedule.timeOfDay) {
    const timeRange = formatTimeRange(schedule.timeOfDay.from, schedule.timeOfDay.to);
    if (timeRange) {
      parts.push(timeRange);
    }
  }

  // Format date range
  if (schedule.startTime && schedule.endTime) {
    const startDate = formatDate(schedule.startTime);
    const endDate = formatDate(schedule.endTime);
    if (startDate && endDate) {
      parts.push(`${startDate} - ${endDate}`);
    }
  }

  return parts.filter(Boolean).join(' | ');
};
