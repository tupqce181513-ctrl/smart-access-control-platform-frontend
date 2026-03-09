# Prompt 10 - Device Module

## Mục tiêu
Implement đầy đủ module Devices: list, detail, CRUD, control + custom hook useDevices.

## Context
- Đọc `docs/backend-api.md` phần 4 (Device Data Model & API)
- Đọc `docs/ui-spec.md` phần 5 (Devices Page)
- Đọc `docs/business-rules.md` phần "Ma trận quyền" và "Device Status Logic"
- Sử dụng: deviceApi, useAuth, common components, constants

## Files cần tạo

### 0. `src/hooks/useDevices.js` (Custom Hook)
```
Hook quản lý state và logic cho devices module:

State:
  - devices: array
  - loading: boolean
  - error: string | null
  - pagination: object
  - filters: { page, limit, deviceType, status, search }

Functions:
  - fetchDevices(params?) → gọi deviceApi.getDevices, cập nhật state
  - setFilters(newFilters) → cập nhật filters + refetch
  - setPage(page) → cập nhật page + refetch

Return: { devices, loading, error, pagination, filters, fetchDevices, setFilters, setPage }

- Sử dụng useEffect để fetch khi filters thay đổi
- Sử dụng useCallback cho các functions
```

### 1. `src/components/devices/DeviceCard.jsx`
```
Props: device, onControl?, onEdit?, onDelete?

Card hiển thị:
  - Device name (bold)
  - Type icon (Door/Gate/Lock icon từ Lucide)
  - Serial number (text-sm, truncated)
  - Status badge (Online/Offline)
  - State badge (Locked/Unlocked)
  - Location (nếu có)
  - Action buttons: Control (Lock/Unlock), Edit, Delete
  - Buttons hiển thị theo role (dùng canManageDevice helper)
```

### 2. `src/components/devices/DeviceTable.jsx`
```
Props: devices, onControl, onEdit, onDelete, loading

Table columns:
  - Name (với icon theo deviceType)
  - Type
  - Serial Number
  - Status (StatusBadge)
  - State (StatusBadge)
  - Location
  - Actions (dropdown hoặc buttons)
  
- Loading: skeleton rows
- Empty: EmptyState component
- Actions dựa theo role
- Responsive: scroll horizontal trên mobile
```

### 3. `src/components/devices/DeviceForm.jsx`
```
Props: device? (null nếu create), onSubmit, onCancel, isLoading

Form fields:
  - name (text input, required)
  - deviceType (select: door/gate/locker, required)
  - serialNumber (text input, required, disable khi edit)
  - firmwareVersion (text input, optional)
  - location.address (text input, optional)
  - location.description (textarea, optional)

- Validation theo business rules
- Controlled form (useState)
- Submit → gọi onSubmit(formData)
- Có thể render trong modal
```

### 4. `src/components/devices/DeviceDetail.jsx`
```
Props: device, permissions?, recentLogs?, onControl, onEdit

Hiển thị:
  - Device info card (tất cả fields)
  - Control buttons: Lock/Unlock (kiểm tra quyền)
  - Access Permissions section (nếu owner/admin)
  - Recent logs section
```

### 5. `src/components/devices/DeviceControl.jsx`
```
Props: device, onCommand

- Nút Lock/Unlock lớn
- Hiển thị current state
- Loading state khi gửi command
- Confirm trước khi thực hiện (dùng ConfirmModal)
- Gọi deviceApi.sendCommand(id, command)
- Toast success/error
```

### 6. `src/pages/DevicesPage.jsx`
```
Page chính quản lý devices:

- Page header: "Devices" + "Add Device" button (owner/admin only)
- Filter bar: deviceType select, status select, search input
- View toggle: Table / Grid (optional)
- DeviceTable hoặc DeviceCard grid
- Pagination
- Add/Edit Device: mở modal với DeviceForm
- Delete: ConfirmModal → deviceApi.deleteDevice
- Control: DeviceControl → deviceApi.sendCommand

Sử dụng useDevices hook cho state management.
```

### 7. `src/pages/DeviceDetailPage.jsx`
```
- Lấy device ID từ URL params: useParams()
- Fetch device detail: deviceApi.getDevice(id)
- Fetch device permissions (nếu owner/admin): accessApi.getDevicePermissions(id)
- Fetch device logs: logApi.getDeviceLogs(id, { limit: 10 })
- Render DeviceDetail component
- Back button → navigate(-1)
- Loading + Error states
```

## Lưu ý
- CRUD operations: toast feedback + refresh list
- Delete: soft confirm trước
- Control command: kiểm tra device.isEnabled trước khi cho phép
- Device offline: vẫn hiển thị nhưng disable control (hoặc warning)
- Sử dụng constants.js cho DEVICE_TYPES, DEVICE_STATUS, DEVICE_STATE
