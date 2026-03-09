# Prompt 06 - Auth Module

## Mục tiêu
Tạo các components và pages cho chức năng authentication: Login, Register, ProtectedRoute, và các auth pages.

## Context
- Đọc `docs/backend-api.md` phần 2 (Authentication System)
- Đọc `docs/ui-spec.md` phần Login/Register
- Đọc `docs/business-rules.md` phần validation
- Sử dụng AuthContext từ prompt 04
- Sử dụng API layer từ prompt 02

## Files cần tạo

### 1. `src/components/auth/LoginForm.jsx`
- Form fields: email, password
- "Remember me" checkbox (optional, lưu email vào localStorage)
- Submit → gọi `useAuth().login(email, password)`
- Hiển thị error message từ API (sai mật khẩu, account locked, email chưa verify)
- Loading state khi submit
- Link tới Register page
- Validation: email required + format, password required

### 2. `src/components/auth/RegisterForm.jsx`
- Form fields: fullName, email, password, confirmPassword, phone (optional)
- Submit → gọi `authApi.register(data)`
- Sau register thành công → hiển thị thông báo "Check your email to verify"
- Validation:
  - fullName: required, min 2 chars
  - email: required, valid format
  - password: required, min 6 chars
  - confirmPassword: match password
  - phone: optional
- Loading state, error handling
- Link tới Login page

### 3. `src/components/auth/ProtectedRoute.jsx`
```jsx
// Wrap protected routes
// Kiểm tra isAuthenticated từ AuthContext
// Nếu chưa login → redirect to /login
// Nếu đang loading (check token) → show LoadingSpinner
// Props: allowedRoles? (optional array of roles)
// Nếu có allowedRoles và user.role không nằm trong → redirect to /dashboard

import { Navigate, Outlet } from 'react-router-dom';
```

### 4. `src/pages/LoginPage.jsx`
- Layout: centered card trên background
- Chứa LoginForm
- Logo/title ở trên
- Nếu đã authenticated → redirect to /dashboard

### 5. `src/pages/RegisterPage.jsx`
- Layout tương tự LoginPage
- Chứa RegisterForm
- Nếu đã authenticated → redirect to /dashboard

### 6. `src/pages/VerifyEmailPage.jsx`
- Đọc token từ URL query params: `/verify-email?token=xxx`
- Tự động gọi `authApi.verifyEmail(token)` khi mount
- Hiển thị 3 states:
  - Loading: "Đang xác thực email..."
  - Success: "Email đã được xác thực! Bạn có thể đăng nhập."
  - Error: "Link xác thực không hợp lệ hoặc đã hết hạn."
- Link về trang Login

## Lưu ý
- Tất cả component sử dụng Tailwind CSS v4
- Form handling đơn giản (useState), không cần thư viện form
- Toast notifications cho success/error dùng react-hot-toast
- Support dark mode
