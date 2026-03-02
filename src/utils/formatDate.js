import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format date to dd/MM/yyyy
 * @param {Date|string|number} date - Date object, ISO string, or timestamp
 * @returns {string} Formatted date string or empty string if invalid
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    return format(dateObj, 'dd/MM/yyyy');
  } catch {
    return '';
  }
};

/**
 * Format date and time to dd/MM/yyyy HH:mm
 * @param {Date|string|number} date - Date object, ISO string, or timestamp
 * @returns {string} Formatted datetime string or empty string if invalid
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    return format(dateObj, 'dd/MM/yyyy HH:mm');
  } catch {
    return '';
  }
};

/**
 * Format date as relative time (e.g., "5 phút trước", "2 giờ trước")
 * @param {Date|string|number} date - Date object, ISO string, or timestamp
 * @returns {string} Relative time string or empty string if invalid
 */
export const formatTimeAgo = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: vi });
  } catch {
    return '';
  }
};
