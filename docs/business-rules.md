# Business Rules - Smart Access Control Platform

## 1. Hệ Thống Phân Quyền (Role-Based Access)

### Ba vai trò (role):
| Role | Mô tả |
|------|--------|
| **admin** | Quản trị viên hệ thống - toàn quyền |
| **owner** | Chủ sở hữu thiết bị - quản lý devices & cấp quyền |
| **member** | Thành viên - sử dụng thiết bị khi được cấp quyền |

### Ma trận quyền chi tiết:

| Hành động | admin | owner | member |
|-----------|-------|-------|--------|
| Xem tất cả devices | ✅ | ❌ (chỉ devices mình sở hữu) | ❌ (chỉ devices được cấp quyền) |
| Thêm device | ✅ | ✅ | ❌ |
| Sửa/Xóa device | ✅ | ✅ (chỉ devices mình) | ❌ |
| Gửi lệnh điều khiển | ✅ | ✅ (devices mình) | ✅ (nếu có permission hợp lệ) |
| Cấp quyền truy cập | ✅ | ✅ (chỉ cho devices mình) | ❌ |
| Thu hồi quyền | ✅ | ✅ (devices mình) | ❌ |
| Xem logs | ✅ (tất cả) | ✅ (devices mình) | ✅ (chỉ logs của mình) |
| Quản lý users | ✅ | ❌ | ❌ |
| Xem notifications | ✅ (của mình) | ✅ (của mình) | ✅ (của mình) |

---

## 2. Logic Kiểm Tra Quyền Truy Cập (Access Check)

Khi user gửi lệnh điều khiển device:

```
1. Device có isEnabled = true?
   → false: DENIED ("Device is disabled")

2. User là admin?
   → true: ALLOWED (admin luôn có quyền)

3. User là owner của device (device.ownerId === userId)?
   → true: ALLOWED (owner luôn có quyền trên device mình)

4. User có AccessPermission active (isRevoked=false)?
   → false: DENIED ("No permission")
   
5. Kiểm tra accessType:
   a. "permanent": ALLOWED
   b. "one_time": ALLOWED (sau khi dùng → tự động revoke)
   c. "scheduled": kiểm tra schedule:
      - Ngày hiện tại nằm trong [startTime, endTime]?
      - Thứ trong tuần có nằm trong daysOfWeek?
      - Giờ hiện tại nằm trong [timeOfDay.from, timeOfDay.to]?
      → Tất cả đúng: ALLOWED
      → Sai bất kỳ: DENIED ("Outside scheduled time")
```

---

## 3. Device Status Logic

### status (connectivity):
- `"online"`: device đang kết nối (heartbeat < 5 phút)
- `"offline"`: device mất kết nối (heartbeat > 5 phút)
- Frontend chỉ HIỂN THỊ trạng thái, KHÔNG tự phán đoán

### currentState (lock/unlock):
- `"locked"`: đang khóa
- `"unlocked"`: đang mở
- Chỉ thay đổi khi có lệnh hoặc auto-lock

### isEnabled:
- `true`: device hoạt động bình thường
- `false`: device bị vô hiệu hóa bởi owner/admin
- Khi disabled: không ai có thể điều khiển

---

## 4. Access Permission Types

### permanent:
- Quyền vĩnh viễn, không giới hạn thời gian
- Chỉ mất khi bị thu hồi (revoke)

### scheduled:
- Có thời hạn và lịch cụ thể
- Các trường schedule:
  - `startTime/endTime`: khoảng thời gian hiệu lực (date range)
  - `daysOfWeek`: mảng số [0-6], 0=Chủ nhật
  - `timeOfDay.from/to`: giờ trong ngày, format "HH:mm"

### one_time:
- Dùng 1 lần duy nhất
- Sau khi unlock thành công → backend tự revoke
- `revokedByType: "system"` (phân biệt với revoke thủ công)

---

## 5. Validation Rules (Frontend)

### Register:
- email: required, valid email format
- password: required, min 6 chars
- fullName: required, tối thiểu 2 ký tự
- phone: optional, không validate format ở frontend

### Login:
- email: required
- password: required

### Device:
- name: required
- deviceType: required, chỉ "door" | "gate" | "locker"
- serialNumber: required, unique (backend sẽ trả 409 nếu trùng)
- location.address: optional
- location.description: optional
- coordinates: optional

### Grant Permission:
- userId: required (chọn từ dropdown/search user)
- deviceId: required (chọn từ dropdown)
- accessType: required
- Nếu scheduled: validate startTime < endTime, daysOfWeek không rỗng, timeOfDay hợp lệ

---

## 6. Hiển Thị Dữ Liệu Theo Role

### Dashboard:
- **admin**: tổng quan toàn hệ thống (total users, devices, logs)
- **owner**: overview devices mình sở hữu + recent activities
- **member**: danh sách devices được cấp quyền + recent activities

### Sidebar Navigation:
- **Tất cả roles**: Dashboard, Notifications, Profile
- **owner + admin**: Devices (CRUD), Access Management
- **admin only**: Users Management, All Logs
- **member**: My Devices (chỉ xem), My Access

### Trang Devices:
- admin: bảng tất cả devices, có action edit/delete/command tất cả
- owner: bảng devices mình sở hữu, có action edit/delete/command + nút "Add Device"
- member: bảng devices được cấp quyền, chỉ có action command (unlock/lock)
