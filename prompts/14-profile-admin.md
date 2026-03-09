# Prompt 14 - Profile & Admin Pages

## Mục tiêu
Implement trang Profile (cho tất cả users) và trang Admin Users Management.

## Context
- Đọc `docs/backend-api.md` phần 8 (User Management API)
- Đọc `docs/ui-spec.md` phần 9 (Profile) và phần 10 (Users Management)
- Đọc `docs/business-rules.md` phần "Ma trận quyền"
- Sử dụng: userApi, useAuth, common components

## Files cần tạo

### 1. `src/pages/ProfilePage.jsx`
```
Hai sections chính:

Section 1 - Profile Info:
  - Avatar (hiển thị hoặc placeholder nếu không có)
    - Upload avatar button (gọi updateProfile với avatar URL)
    - Hoặc đơn giản: hiển thị initials trong circle
  - Form fields:
    - fullName (text input)
    - email (text input, readonly/disabled)
    - phone (text input)
  - Button: "Update Profile"
  - Submit → userApi.updateProfile({ fullName, phone })
  - Success → toast + update AuthContext user

Section 2 - Change Password:
  - currentPassword (password input)
  - newPassword (password input, min 6 chars)
  - confirmNewPassword (password input, must match)
  - Button: "Change Password"
  - Submit → userApi.changePassword(currentPassword, newPassword)
  - Success → toast + clear form
  - Error: hiển thị inline (VD: "Current password is incorrect")

Layout:
  - 2 sections có thể nằm trên 2 cards riêng biệt
  - Max-width cho form (max-w-2xl)
  - Responsive
```

### 2. `src/pages/admin/UsersPage.jsx`
```
Admin only page:

- Page header: "User Management"
- Search bar: search by name/email → debounce 300ms
- Users table:
  - Avatar (hoặc initials)
  - Full Name
  - Email
  - Role (RoleBadge)
  - Status (Active/Inactive badge)
  - Last Login (formatDateTime)
  - Actions:
    - Toggle Active: switch/button
      - Active → "Deactivate" (danger)
      - Inactive → "Activate" (success)
      - Confirm modal trước khi thực hiện
      - Gọi userApi.toggleUserActive(id)

- Pagination
- Loading + Empty states

Lưu ý:
  - Không cho phép admin tự deactivate chính mình
  - Hiển thị warning nếu user là admin
  - Sau toggle → refresh list + toast
```

### 3. Route protection
```
UsersPage chỉ accessible bởi admin.
Có 2 cách implement:
a. ProtectedRoute với allowedRoles={['admin']} (đã implement ở prompt 06)
b. Kiểm tra role trong UsersPage component → redirect nếu không phải admin

Recommendation: dùng cách (b) trong component + hiển thị "Unauthorized" page
vì routing đã flat (không nested admin route riêng)
```

## Kiểm tra cuối cùng
Sau khi hoàn thành prompt 14, toàn bộ frontend đã implement:
- ✅ Auth (Login/Register/Verify)
- ✅ Dashboard (3 role views)
- ✅ Devices (CRUD + Control)
- ✅ Access Management (Grant/Revoke)
- ✅ Logs (View + Filter)
- ✅ Notifications (List + Bell + Context)
- ✅ Profile (Update + Change Password)
- ✅ Admin Users (List + Toggle Active)

## Lưu ý
- Profile page: tất cả roles đều access được
- UsersPage: chỉ admin
- Avatar upload: có thể đơn giản hóa thành display-only (không cần upload file thực sự, chỉ URL)
- Change password: clear form sau khi thành công, KHÔNG logout user
