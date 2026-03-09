# Prompt 12 - Logs Module

## Mục tiêu
Implement module Access Logs: danh sách logs với filter, chi tiết log entry.

## Context
- Đọc `docs/backend-api.md` phần 6 (Access Log)
- Đọc `docs/ui-spec.md` phần 7 (Logs Page)
- Đọc `docs/business-rules.md` phần "Hiển Thị Dữ Liệu Theo Role"
- Sử dụng: logApi, useAuth, common components

## Files cần tạo

### 1. `src/components/logs/LogTable.jsx`
```
Props: logs, loading

Table columns:
  - Timestamp (formatDateTime)
  - User (name + email, hoặc "Unknown" nếu null)
  - Device (name + type icon)
  - Action: unlock (green), lock (blue), access_denied (red)
  - Method: app / rfid / keypad / auto (badge)
  - Status: success (green) / failed (red)
  - Detail button (expand hoặc modal)

- Loading: skeleton rows
- Empty: EmptyState "No logs found"
- Optional: click row để xem detail
- Responsive: horizontal scroll
```

### 2. `src/components/logs/LogFilter.jsx`
```
Props: filters, onFilterChange, devices?

Filter fields:
  - Device: select dropdown (nếu admin/owner có nhiều devices)
  - Action: select (All, Unlock, Lock, Access Denied)
  - Status: select (All, Success, Failed)
  - Date range: startDate + endDate (date inputs)
  - Search/user filter (admin only)

- Filters nằm trên 1 hàng (responsive: wrap)
- Clear all filters button
- onFilterChange(newFilters) → parent refetch data
```

### 3. `src/components/logs/LogDetail.jsx`
```
Props: log

Hiển thị chi tiết 1 log entry:
  - Timestamp (full format)
  - User info (name, email)
  - Device info (name, type, serial)
  - Action + Status
  - Method
  - Fail reason (nếu status = failed)
  - Metadata: IP address, user agent, RFID card ID
  
Có thể render trong modal hoặc expandable row
```

### 4. `src/pages/LogsPage.jsx`
```
Main page:

- Page header: "Access Logs"
- LogFilter component
- LogTable component
- Pagination

Data fetching theo role:
  - Admin: logApi.getLogs(filters) → tất cả logs
  - Owner: logApi.getLogs(filters) → backend tự filter theo owned devices
  - Member: logApi.getLogs(filters) → backend tự filter theo user's own logs

- Loading + Error states
- Mỗi khi filter thay đổi → reset page về 1
- Auto-refresh? (optional, nếu muốn real-time feel → setInterval 30s)
```

## Lưu ý
- Date range filter: mặc định có thể là 7 ngày gần nhất
- Log entries không thể edit/delete (read-only)
- Timestamps hiển thị theo timezone local
- Sử dụng formatDateTime + formatTimeAgo từ utils
- Log actions có colors riêng: unlock=green, lock=blue, access_denied=red
