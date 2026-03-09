# Prompt 09 - Dashboard

## Mục tiêu
Implement DashboardPage với 3 views khác nhau theo role: admin, owner, member.

## Context
- Đọc `docs/ui-spec.md` phần 4 (Dashboard Page)
- Đọc `docs/business-rules.md` phần "Hiển Thị Dữ Liệu Theo Role"
- Đọc `docs/backend-api.md` để biết API endpoints cần dùng
- Sử dụng: useAuth(), API services, common components, Lucide icons

## Yêu cầu

### `src/pages/DashboardPage.jsx`

Dùng `useAuth()` để lấy `user.role`, render view tương ứng:

#### Admin Dashboard:
```
Stats cards (grid 2-4 cols responsive):
  - Total Users: GET /api/users?limit=1 → pagination.total
  - Total Devices: GET /api/devices?limit=1 → pagination.total
  - Online Devices: GET /api/devices?status=online&limit=1 → pagination.total
  - Today's Access: GET /api/logs?startDate=today&limit=1 → pagination.total

Recent Activity:
  - GET /api/logs?limit=5&sort=-timestamp
  - Table: Time | User | Device | Action | Status
```

#### Owner Dashboard:
```
Stats cards (grid 2-3 cols):
  - My Devices: GET /api/devices?limit=1 → pagination.total
  - Online Devices: GET /api/devices?status=online&limit=1 → pagination.total
  - Active Permissions: (tính từ devices → permissions)

My Devices:
  - GET /api/devices?limit=6
  - Card grid: name, type, status, state, quick control button

Recent Access:
  - GET /api/logs?limit=5
  - Simple list/table
```

#### Member Dashboard:
```
Stats cards (grid 2 cols):
  - Accessible Devices: GET /api/devices?limit=1 → pagination.total (API trả về devices member có quyền)
  - Recent Access count

Devices I Can Access:
  - GET /api/devices
  - Card grid: name, type, status, quick control button

My Recent Activity:
  - GET /api/logs?limit=5
  - Timeline/list view
```

### Stats Card Component (có thể tạo inline hoặc tách riêng):
```
Props: title, value, icon, color, trend?
- Icon ở bên trái hoặc góc
- Value lớn, bold
- Title nhỏ, text-secondary
- Optional: trend indicator (up/down arrow + percentage)
```

## Lưu ý
- Loading state: skeleton cards hoặc spinner
- Error handling: toast notification
- Responsive grid: 1 col mobile, 2 cols tablet, 3-4 cols desktop
- Số liệu lấy từ pagination.total (API đã hỗ trợ)
- Nếu API chưa sẵn sàng → dùng mock data tạm, comment rõ
