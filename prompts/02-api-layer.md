# Prompt 02 - API Layer

## Mục tiêu
Tạo Axios instance với interceptor (auto refresh token, error handling) và tất cả API service files.

## Context
- Đọc `docs/backend-api.md` để biết tất cả endpoints
- Đọc `docs/frontend-architecture.md` phần folder structure

## Yêu cầu

### 1. Axios Instance (`src/api/axios.js`)
```
- Base URL: import từ constants hoặc env (VITE_API_URL, default http://localhost:3000)
- Request interceptor: tự động gắn Authorization: Bearer <accessToken> nếu có
- Response interceptor:
  + Nếu 401 → thử refresh token
  + Nếu refresh thành công → retry request gốc
  + Nếu refresh thất bại → clear tokens, redirect /login
  + Race condition: dùng biến isRefreshing + queue để tránh gọi refresh nhiều lần
- Timeout: 10000ms
```

Lưu ý: Token lưu ở localStorage keys: `accessToken`, `refreshToken`

### 2. API Service Files

#### `src/api/authApi.js`
```
- login(email, password) → POST /api/auth/login
- register({ email, password, fullName, phone? }) → POST /api/auth/register
- refreshToken(refreshToken) → POST /api/auth/refresh-token
- logout(refreshToken) → POST /api/auth/logout
- verifyEmail(token) → GET /api/auth/verify-email?token=xxx
```

#### `src/api/deviceApi.js`
```
- getDevices(params?) → GET /api/devices?page&limit&deviceType&status
- getDevice(id) → GET /api/devices/:id
- createDevice(data) → POST /api/devices
- updateDevice(id, data) → PUT /api/devices/:id
- deleteDevice(id) → DELETE /api/devices/:id
- sendCommand(id, command) → POST /api/devices/:id/command
```

#### `src/api/accessApi.js`
```
- grantAccess(data) → POST /api/access/grant
- revokeAccess(id) → PUT /api/access/revoke/:id
- getDevicePermissions(deviceId) → GET /api/access/device/:deviceId
- getUserPermissions(userId) → GET /api/access/user/:userId
- checkAccess(deviceId) → GET /api/access/check/:deviceId
```

#### `src/api/logApi.js`
```
- getLogs(params?) → GET /api/logs?page&limit&deviceId&userId&action&status&startDate&endDate
- getDeviceLogs(deviceId, params?) → GET /api/logs/device/:deviceId
- getUserLogs(userId, params?) → GET /api/logs/user/:userId
```

#### `src/api/notificationApi.js`
```
- getNotifications(params?) → GET /api/notifications?page&limit&isRead
- markAsRead(id) → PUT /api/notifications/:id/read
- markAllAsRead() → PUT /api/notifications/read-all
- getUnreadCount() → GET /api/notifications/unread-count
```

#### `src/api/userApi.js`
```
- getProfile() → GET /api/users/profile
- updateProfile(data) → PUT /api/users/profile
- changePassword(currentPassword, newPassword) → PUT /api/users/change-password
- getUsers(params?) → GET /api/users?page&limit&search (admin only)
- toggleUserActive(id) → PUT /api/users/:id/toggle-active (admin only)
```

## Lưu ý
- Mỗi function return `response.data` (không cần `.data.data` ở component)
- Sử dụng named exports
- Axios instance export default để dùng lại nếu cần
