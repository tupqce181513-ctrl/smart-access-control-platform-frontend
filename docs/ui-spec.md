# UI Specifications - Smart Access Control Platform

## 1. Color Scheme & Design System

### Colors:
| Tên | Light Mode | Dark Mode | Sử dụng |
|-----|-----------|-----------|---------|
| Primary | Blue-600 `#2563EB` | Blue-500 `#3B82F6` | Buttons, links, active |
| Success | Green-500 `#22C55E` | Green-400 `#4ADE80` | Online, unlocked, success |
| Danger | Red-500 `#EF4444` | Red-400 `#F87171` | Delete, denied, error |
| Warning | Amber-500 `#F59E0B` | Amber-400 `#FBBF24` | Alerts, scheduled |
| Background | Gray-50 `#F9FAFB` | Gray-900 `#111827` | Page background |
| Surface | White `#FFFFFF` | Gray-800 `#1F2937` | Cards, modals |
| Text Primary | Gray-900 `#111827` | Gray-100 `#F3F4F6` | Headings |
| Text Secondary | Gray-500 `#6B7280` | Gray-400 `#9CA3AF` | Descriptions |

### Typography:
- Font: Inter (Google Fonts) hoặc system font stack
- Heading 1: 24px/30px semibold
- Heading 2: 20px/28px semibold
- Body: 14px/20px regular
- Small: 12px/16px regular

### Spacing:
- Sử dụng Tailwind spacing: 4px increments
- Card padding: p-4 hoặc p-6
- Gap giữa sections: gap-6

---

## 2. Layout Chính

```
┌──────────────────────────────────────────────┐
│ Header (h-16, fixed top)                     │
│  [☰ Menu] [Logo] [Search?] [Bell] [Avatar ▾] │
├──────────┬───────────────────────────────────┤
│ Sidebar  │ Main Content                      │
│ (w-64)   │ (flex-1, overflow-y-auto)        │
│          │                                   │
│ Nav items│  ┌─ Page Header ──────────────┐  │
│          │  │ Title + Actions            │  │
│          │  └────────────────────────────┘  │
│          │                                   │
│          │  ┌─ Content ─────────────────┐  │
│          │  │                            │  │
│          │  │                            │  │
│          │  └────────────────────────────┘  │
│          │                                   │
└──────────┴───────────────────────────────────┘
```

- Sidebar: collapsible trên mobile (< 768px)
- Header: sticky, backdrop-blur
- Main content: scroll riêng, padding p-6
- Dark mode toggle: trong header hoặc sidebar

---

## 3. Trang Login / Register

### Login Page:
- Centered card (max-w-md)
- Logo + Title "Smart Access Control"
- Form: email, password, "Remember me" checkbox
- Button: "Sign In" (full width, primary)
- Link: "Forgot password?" (disabled/coming soon)
- Link: "Don't have an account? Register"
- Error message: hiển thị dưới form (red alert)

### Register Page:
- Centered card (max-w-md)
- Form: fullName, email, phone (optional), password, confirm password
- Button: "Create Account"
- Link: "Already have an account? Sign In"
- Success: redirect tới trang "Check your email"

---

## 4. Dashboard Page

### Admin Dashboard:
- Stats cards (grid 4 cols): Total Users, Total Devices, Online Devices, Today's Access
- Recent Activity table (5 rows)
- Device Status pie chart (optional)

### Owner Dashboard:
- Stats cards (grid 3 cols): My Devices, Online Devices, Active Permissions
- My Devices list (card view)
- Recent Access Logs (5 rows)

### Member Dashboard:
- Stats cards (grid 2 cols): Accessible Devices, Recent Access
- Devices I Can Access (card grid)
- My Recent Activity (timeline/list)

---

## 5. Devices Page

### Device List View:
- Page header: "Devices" + "Add Device" button (owner/admin only)
- Filter bar: [Type dropdown] [Status dropdown] [Search input]
- Table columns: Name | Type | Serial | Status | State | Location | Actions
- Status badge: Online (green dot) / Offline (gray dot)
- State badge: Locked (red) / Unlocked (green)
- Actions: View | Edit | Delete | Lock/Unlock
- Pagination bar dưới bảng

### Device Detail (có thể modal hoặc page):
- Device info card
- Access Permissions list (nếu owner/admin)
- Recent Logs cho device
- Control buttons: Lock / Unlock

### Add/Edit Device Form (modal hoặc page):
- Fields: name, deviceType (select), serialNumber, firmwareVersion, location
- Nút Save / Cancel

---

## 6. Access Management Page

### Danh sách Permissions:
- Filter: [Device dropdown] [User search] [Type dropdown] [Status: Active/Revoked]
- Table: User | Device | Type | Schedule | Status | Granted By | Actions
- Actions: Revoke (nếu active)
- Badge: permanent (blue), scheduled (amber), one_time (purple)

### Grant Permission Form (modal):
- Select user (searchable dropdown)
- Select device (dropdown, chỉ devices mình sở hữu)
- Select accessType
- Nếu scheduled: date range picker, days of week checkboxes, time range inputs
- Button: "Grant Access"

---

## 7. Logs Page

- Filter bar: [Device] [User] [Action] [Status] [Date range]
- Table: Time | User | Device | Action | Method | Status | Details
- Action badge: unlock (green), lock (blue), access_denied (red)
- Status badge: success (green), failed (red)
- Có thể click row để xem detail
- Export CSV? (nice to have)

---

## 8. Notifications Page

- Header: "Notifications" + "Mark all read" button
- List view (không phải table):
  - Icon theo type (shield, wifi-off, key, x-circle)
  - Title + message
  - Time ago (relative)
  - Unread: có blue dot indicator + background highlight
- Click → đánh dấu đã đọc
- Bell icon trong header: badge count unread

---

## 9. Profile Page

- Avatar (với upload / placeholder)
- Form: fullName, email (readonly), phone
- Button: "Update Profile"
- Section: "Change Password"
  - currentPassword, newPassword, confirmNewPassword
  - Button: "Change Password"

---

## 10. Admin - Users Management

- Page header: "User Management"
- Search bar
- Table: Avatar | Name | Email | Role | Status | Last Login | Actions
- Status: Active (green) / Inactive (red)
- Actions: Toggle Active (lock/unlock icon)
- Pagination

---

## UI/UX Guidelines

1. **Loading states**: Skeleton hoặc spinner cho mọi API call
2. **Empty states**: Illustration + message khi không có data
3. **Confirmation**: Modal confirm trước khi delete/revoke
4. **Toast notifications**: Dùng react-hot-toast cho success/error feedback
5. **Responsive**: Mobile-first, breakpoints: sm(640) md(768) lg(1024) xl(1280)
6. **Accessibility**: Proper labels, focus states, keyboard navigation
7. **Form validation**: Inline errors, disable submit khi invalid
