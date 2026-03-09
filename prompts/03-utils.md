# Prompt 03 - Utils

## Mục tiêu
Tạo các utility functions và constants dùng chung trong toàn bộ dự án.

## Context
- Đọc `docs/backend-api.md` → data models để biết các giá trị enum
- Đọc `docs/business-rules.md` → validation rules, role permissions
- Đọc `docs/ui-spec.md` → color scheme

## Yêu cầu

### 1. `src/utils/constants.js`
```js
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
```

### 2. `src/utils/formatDate.js`
```
- formatDate(date) → "dd/MM/yyyy" (VD: "15/01/2024")
- formatDateTime(date) → "dd/MM/yyyy HH:mm" (VD: "15/01/2024 14:30")
- formatTimeAgo(date) → relative time (VD: "5 phút trước", "2 giờ trước")
- Sử dụng date-fns với locale vi (Vietnamese)
```

### 3. `src/utils/formatSchedule.js`
```
- formatSchedule(schedule) → human-readable string
  VD: "T2, T4, T6 | 08:00 - 17:00 | 01/01/2024 - 31/12/2024"
- formatDaysOfWeek(daysArray) → "T2, T4, T6"
- formatTimeRange(from, to) → "08:00 - 17:00"
```

### 4. `src/utils/permissionHelpers.js`
```
- canManageDevice(user, device) → boolean
  // admin: true, owner of device: true, else: false
  
- canGrantAccess(user, device) → boolean
  // admin: true, owner of device: true, else: false
  
- canRevokeAccess(user, permission, device) → boolean
  // admin: true, owner of device: true, created by user: true, else: false

- getNavItems(role) → array of nav items theo role
  // Tham khảo business-rules.md "Sidebar Navigation"
  
- isAdmin(user) → user?.role === 'admin'
- isOwner(user) → user?.role === 'owner'
- isMember(user) → user?.role === 'member'
```

## Lưu ý
- Tất cả sử dụng named exports
- Các format functions phải handle null/undefined inputs gracefully
- Sử dụng date-fns (đã cài ở prompt 01)
