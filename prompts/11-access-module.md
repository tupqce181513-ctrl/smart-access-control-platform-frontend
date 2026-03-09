# Prompt 11 - Access Module

## Mục tiêu
Implement module Access Management: danh sách permissions, grant permission, revoke.

## Context
- Đọc `docs/backend-api.md` phần 5 (Access Permission)
- Đọc `docs/ui-spec.md` phần 6 (Access Management Page)
- Đọc `docs/business-rules.md` phần 2 (Access Check Logic) và phần 4 (Permission Types)
- Sử dụng: accessApi, deviceApi, userApi, useAuth, common components

## Files cần tạo

### 1. `src/components/access/PermissionTable.jsx`
```
Props: permissions, onRevoke, loading

Table columns:
  - User (avatar + name + email)
  - Device (name + type)
  - Access Type (AccessTypeBadge)
  - Schedule (ScheduleDisplay, nếu scheduled)
  - Status (Active/Revoked badge)
  - Granted By (name)
  - Created At
  - Actions: Revoke button (chỉ hiện nếu active + có quyền)

- Loading: skeleton rows
- Empty: EmptyState "No permissions found"
- Responsive: horizontal scroll trên mobile
```

### 2. `src/components/access/GrantPermissionForm.jsx`
```
Props: devices, onSubmit, onCancel, isLoading

Form fields:
  - userId: searchable input
    → Khi user gõ email/name → gọi userApi.getUsers({ search: keyword }) để search
    → Hiển thị dropdown kết quả
    → Chọn user → set userId
  - deviceId: select dropdown (từ props.devices)
  - accessType: radio/select (permanent | scheduled | one_time)
  - Nếu accessType === 'scheduled':
    - startTime: date input
    - endTime: date input
    - daysOfWeek: checkbox group (T2-CN)
    - timeOfDay.from: time input (HH:mm)
    - timeOfDay.to: time input (HH:mm)

Validation:
  - userId: required
  - deviceId: required
  - accessType: required
  - scheduled: startTime < endTime, ít nhất 1 ngày trong tuần, time range hợp lệ

Submit → onSubmit({ userId, deviceId, accessType, schedule })
```

### 3. `src/components/access/PermissionDetail.jsx`
```
Props: permission

Hiển thị chi tiết permission:
  - User info
  - Device info
  - Access type + badge
  - Schedule details (nếu scheduled)
  - Status (active/revoked)
  - Revoked info (nếu có): by whom, when, type (user/system)
  - Created by + created at
```

### 4. `src/components/access/ScheduleDisplay.jsx`
```
Props: schedule

Hiển thị schedule ở dạng human-readable:
  - Date range: "01/01/2024 - 31/12/2024"
  - Days: "T2, T4, T6"
  - Time: "08:00 - 17:00"
  
Sử dụng utils/formatSchedule.js
```

### 5. `src/components/access/AccessTypeBadge.jsx`
```
Props: type ("permanent" | "scheduled" | "one_time")

Badge colors:
  - permanent: blue
  - scheduled: amber/yellow
  - one_time: purple
  
Label: "Permanent" / "Scheduled" / "One-time"
```

### 6. `src/pages/AccessControlPage.jsx`
```
Main page:

- Page header: "Access Management" + "Grant Access" button (owner/admin only)
- Filter bar:
  - Device dropdown (fetch user's devices)
  - Access type select
  - Status: All / Active / Revoked
- PermissionTable
- Pagination

Actions:
  - Grant Access: mở modal với GrantPermissionForm
    → Submit: accessApi.grantAccess(data)
    → Success: toast + refresh list
    → Error: hiển thị error (VD: 409 duplicate, 403 forbidden)
  - Revoke: ConfirmModal → accessApi.revokeAccess(id)
    → Success: toast + refresh list

Data fetching:
  - Owner: accessApi.getDevicePermissions cho từng device (hoặc fetch all devices first)
  - Admin: tương tự nhưng cho tất cả devices
  - Member: accessApi.getUserPermissions(myId) - chỉ xem, không có actions
```

## Lưu ý
- User search trong GrantPermissionForm: debounce 300ms
- Khi device không có permissions: hiển thị EmptyState
- Permission đã revoked: text mờ (opacity-50), không có action
- one_time permission đã dùng: hiển thị "Used" badge
- Error 409 (duplicate): hiển thị message rõ ràng "User already has active permission for this device"
