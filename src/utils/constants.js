export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const ROLES = {
  ADMIN: 'admin',
  OWNER: 'owner',
  MEMBER: 'member',
};

export const DEVICE_TYPES = {
  DOOR: 'door',
  GATE: 'gate',
  LOCKER: 'locker',
};

export const DEVICE_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
};

export const DEVICE_STATE = {
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
};

export const ACCESS_TYPES = {
  PERMANENT: 'permanent',
  SCHEDULED: 'scheduled',
  ONE_TIME: 'one_time',
};

export const LOG_ACTIONS = {
  UNLOCK: 'unlock',
  LOCK: 'lock',
  ACCESS_DENIED: 'access_denied',
};

export const LOG_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
};

export const NOTIFICATION_TYPES = {
  ACCESS_ALERT: 'access_alert',
  DEVICE_OFFLINE: 'device_offline',
  PERMISSION_GRANTED: 'permission_granted',
  PERMISSION_REVOKED: 'permission_revoked',
};

export const DAYS_OF_WEEK = [
  { value: 0, label: 'CN' },
  { value: 1, label: 'T2' },
  { value: 2, label: 'T3' },
  { value: 3, label: 'T4' },
  { value: 4, label: 'T5' },
  { value: 5, label: 'T6' },
  { value: 6, label: 'T7' },
];
