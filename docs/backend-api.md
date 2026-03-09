# Backend API Reference

## 1. Thông Tin Kỹ Thuật Backend

Base URL: `http://localhost:3000`
CORS: cho phép credentials từ CLIENT_URL (mặc định `http://localhost:3000`)
Body: JSON, limit 10kb
Auth: Bearer token (JWT) trong header `Authorization`

### Response format chuẩn:
```json
{
  "success": true,
  "message": "...",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error format:
```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400
}
```

---

## 2. Authentication System

### 2.1 Đăng ký
```
POST /api/auth/register
Body: { email, password, fullName, phone? }
```
- password tối thiểu 6 ký tự
- email tự động lowercase
- Sau đăng ký → gửi email xác thực, user chưa thể login

### 2.2 Xác thực email
```
GET /api/auth/verify-email?token=xxx
```
- Redirect user tới trang này từ link email
- Sau verify → gửi welcome email

### 2.3 Đăng nhập
```
POST /api/auth/login
Body: { email, password }
```
Response data:
```json
{
  "accessToken": "jwt...",
  "refreshToken": "hex...",
  "user": {
    "_id": "...",
    "email": "...",
    "fullName": "...",
    "phone": "...",
    "avatar": "...",
    "role": "owner" | "member" | "admin",
    "isVerified": true,
    "isActive": true,
    "lastLoginAt": "...",
    "lastLoginIP": "..."
  }
}
```
Lưu ý:
- Sai mật khẩu 5 lần → khóa 30 phút
- Email chưa verify → 403 "Please verify your email first"
- Tài khoản bị khóa (isActive=false) → 403 "Account is inactive"

### 2.4 Refresh token
```
POST /api/auth/refresh-token
Body: { refreshToken }
Response: { accessToken (mới), refreshToken (mới) }
```

### 2.5 Đăng xuất
```
POST /api/auth/logout
Header: Authorization: Bearer <accessToken>
Body: { refreshToken }
```

### Token management ở frontend:
- Lưu accessToken + refreshToken (localStorage hoặc memory)
- accessToken expires: 15 phút
- refreshToken expires: 7 ngày
- Khi accessToken hết hạn → tự gọi refresh-token
- Khi refreshToken cũng hết → redirect về login

---

## 3. User Data Model

```
User {
  _id: ObjectId
  email: String (unique, lowercase)
  fullName: String
  phone: String?
  avatar: String?
  role: "owner" | "member" | "admin"
  isVerified: Boolean
  isActive: Boolean
  failedLoginAttempts: Number
  lockUntil: Date?
  lastLoginAt: Date?
  lastLoginIP: String?
  createdAt: Date
  updatedAt: Date
}
```

3 roles:
- **admin**: xem tất cả, quản lý tất cả
- **owner**: sở hữu thiết bị, cấp quyền cho người khác
- **member**: chỉ sử dụng thiết bị khi được cấp quyền

---

## 4. Device Data Model & API

```
Device {
  _id: ObjectId
  name: String
  deviceType: "door" | "gate" | "locker"
  serialNumber: String (unique)
  firmwareVersion: String?
  mqttTopic: String (auto: "devices/{serialNumber}")
  ownerId: ObjectId → User
  location: {
    address: String?,
    description: String?,
    coordinates: { lat: Number, lng: Number }
  }
  status: "online" | "offline"
  currentState: "locked" | "unlocked"
  lastHeartbeat: Date?
  isEnabled: Boolean
  createdAt, updatedAt
}
```

### API Endpoints:

#### Danh sách devices
```
GET /api/devices?page=1&limit=10&deviceType=door&status=online
```
- admin: xem tất cả devices
- owner: chỉ xem devices mình sở hữu
- member: chỉ xem devices mình có permission
- Response: `{ data: [Device...], pagination }`

#### Chi tiết device
```
GET /api/devices/:id
```
- Cần là admin, owner, hoặc có permission
- Response: `{ data: Device }`

#### Tạo device
```
POST /api/devices
Header: Bearer token
Body: { name, deviceType, serialNumber, firmwareVersion?, location? }
```
- Chỉ role owner/admin mới tạo được
- ownerId tự động = req.user._id
- Response: 201, `{ data: Device }`

#### Cập nhật device
```
PUT /api/devices/:id
Body: { name?, deviceType?, firmwareVersion?, location?, isEnabled? }
```
- Chỉ device owner hoặc admin

#### Xóa device
```
DELETE /api/devices/:id
```
- Chỉ device owner hoặc admin
- Xóa device → xóa tất cả AccessPermission liên quan

#### Gửi lệnh điều khiển
```
POST /api/devices/:id/command
Body: { command: "unlock" | "lock" }
```
- Kiểm tra quyền theo business rules
- Gửi lệnh qua MQTT
- Tạo AccessLog + Notification
- Response: `{ data: { device, action, status } }`

---

## 5. Access Permission Data Model & API

```
AccessPermission {
  _id: ObjectId
  userId: ObjectId → User       // người được cấp quyền
  deviceId: ObjectId → Device   // thiết bị
  accessType: "permanent" | "scheduled" | "one_time"
  schedule: {
    startTime: Date?,           // ngày bắt đầu hiệu lực
    endTime: Date?,             // ngày kết thúc hiệu lực
    daysOfWeek: [Number]?,      // 0=CN, 1=T2, ..., 6=T7
    timeOfDay: {
      from: String?,            // "HH:mm"
      to: String?               // "HH:mm"
    }
  }
  isRevoked: Boolean
  revokedAt: Date?
  revokedBy: ObjectId → User?
  revokedByType: "user" | "system"
  createdBy: ObjectId → User    // người cấp quyền
  createdAt, updatedAt
}
```

### API Endpoints:

#### Cấp quyền
```
POST /api/access/grant
Body: { userId, deviceId, accessType, schedule? }
```
Validation rules (backend đã implement):
1. userId tồn tại, isActive=true, isVerified=true
2. deviceId tồn tại
3. Người gọi phải là admin HOẶC owner của device
4. Không cấp cho chính mình
5. Không cấp cho owner của device (đã có quyền mặc nhiên)
6. Không trùng permission active (cùng userId+deviceId, isRevoked=false) → 409
7. Nếu scheduled: validate schedule fields (startTime < endTime, daysOfWeek 0-6, timeOfDay HH:mm)
- Response: 201, `{ data: AccessPermission }`

#### Thu hồi quyền
```
PUT /api/access/revoke/:id
```
- Admin: thu hồi bất kỳ
- Owner: thu hồi permission của device mình
- createdBy: thu hồi permission mình đã tạo
- Set isRevoked=true, revokedAt, revokedBy
- Response: `{ data: AccessPermission }`

#### Permissions của device
```
GET /api/access/device/:deviceId
```
- Lấy tất cả permissions của 1 device
- Chỉ admin hoặc device owner

#### Permissions của user
```
GET /api/access/user/:userId
```
- Lấy tất cả permissions của 1 user
- Admin: xem bất kỳ user
- User: chỉ xem của mình

#### Kiểm tra quyền truy cập
```
GET /api/access/check/:deviceId
```
- Kiểm tra user hiện tại có quyền truy cập device không
- Response: `{ hasAccess: true/false, reason, permissionType }`

---

## 6. Access Log Data Model & API

```
AccessLog {
  _id: ObjectId
  deviceId: ObjectId → Device
  userId: ObjectId → User?
  action: "unlock" | "lock" | "access_denied"
  method: "app" | "rfid" | "keypad" | "auto"
  status: "success" | "failed"
  failReason: String?
  metadata: { ipAddress, userAgent, rfidCardId }
  timestamp: Date
}
```

### API Endpoints:

#### Danh sách logs
```
GET /api/logs?page=1&limit=20&deviceId=x&userId=x&action=x&status=x&startDate=x&endDate=x
```
- admin: xem tất cả logs
- owner: xem logs của devices mình sở hữu
- member: chỉ xem logs của mình

#### Logs theo device
```
GET /api/logs/device/:deviceId?...filters
```
- Chỉ admin hoặc device owner

#### Logs theo user
```
GET /api/logs/user/:userId?...filters
```
- Admin: xem bất kỳ
- User: chỉ xem của mình

---

## 7. Notification Data Model & API

```
Notification {
  _id: ObjectId
  userId: ObjectId → User
  type: "access_alert" | "device_offline" | "permission_granted" | "permission_revoked"
  title: String
  message: String
  relatedDevice: ObjectId → Device?
  isRead: Boolean
  createdAt, updatedAt
}
```

### API Endpoints:

#### Danh sách notifications
```
GET /api/notifications?page=1&limit=10&isRead=true|false
```
- Chỉ xem notifications của chính mình
- Response: `{ data: [Notification...], pagination }`

#### Đánh dấu đã đọc
```
PUT /api/notifications/:id/read
```
- Chỉ owner notification

#### Đánh dấu tất cả đã đọc
```
PUT /api/notifications/read-all
```

#### Đếm chưa đọc
```
GET /api/notifications/unread-count
```
- Response: `{ data: { unreadCount: 5 } }`

---

## 8. User Management API

### Profile (tất cả user):
```
GET  /api/users/profile          → lấy profile bản thân
PUT  /api/users/profile          → update (fullName, phone, avatar)
PUT  /api/users/change-password  → { currentPassword, newPassword }
```

### Admin only:
```
GET  /api/users?page=1&limit=10&search=keyword  → danh sách users
PUT  /api/users/:id/toggle-active                → khóa/mở khóa user
```
