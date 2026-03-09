# Prompt 08 - App Routing

## Mục tiêu
Cấu hình React Router cho toàn bộ ứng dụng: public routes, protected routes, admin routes.

## Context
- Đọc `docs/frontend-architecture.md` phần 3 (Routing Structure)
- Sử dụng ProtectedRoute từ prompt 06
- Sử dụng MainLayout từ prompt 07
- Sử dụng AuthContext từ prompt 04

## Files cần tạo/cập nhật

### 1. `src/App.jsx`
```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Public pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

// Protected pages
import DashboardPage from './pages/DashboardPage';
import DevicesPage from './pages/DevicesPage';
import DeviceDetailPage from './pages/DeviceDetailPage';
import AccessControlPage from './pages/AccessControlPage';
import LogsPage from './pages/LogsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/admin/UsersPage';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected routes - tất cả dùng chung 1 MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/devices" element={<DevicesPage />} />
            <Route path="/devices/:id" element={<DeviceDetailPage />} />
            <Route path="/access" element={<AccessControlPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Admin routes - cùng MainLayout, KHÔNG tạo MainLayout riêng */}
            <Route path="/admin/users" element={<UsersPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
```

> **Quan trọng**: Tất cả protected routes (bao gồm admin) nằm trong cùng 1 `<MainLayout />` wrapper. KHÔNG tạo `<MainLayout />` thứ 2 cho admin routes — điều này sẽ gây re-mount layout (mất sidebar state, flash UI) khi navigate giữa admin và non-admin pages.

### 2. `src/main.jsx`
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
// NotificationProvider sẽ được thêm ở prompt 13
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      {/* <NotificationProvider> sẽ wrap <App /> ở prompt 13 */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

> **Lưu ý**: `NotificationProvider` chưa có ở bước này. Sẽ thêm vào ở Prompt 13 khi tạo Notification module. Đặt comment placeholder để nhắc nhở.

### 3. Tạo placeholder pages
Các pages chưa implement (DashboardPage, DevicesPage, v.v.) → tạo placeholder đơn giản:
```jsx
// VD: src/pages/DashboardPage.jsx
const DashboardPage = () => {
  return <div className="text-gray-900 dark:text-gray-100"><h1 className="text-2xl font-semibold">Dashboard</h1><p>Coming soon...</p></div>;
};
export default DashboardPage;
```

Tạo placeholder cho tất cả pages chưa implement:
- DashboardPage, DevicesPage, DeviceDetailPage
- AccessControlPage, LogsPage
- NotificationsPage, ProfilePage
- admin/UsersPage

## Kiểm tra
- `npm run dev` chạy được
- Truy cập `/login` → thấy LoginPage
- Truy cập `/dashboard` khi chưa login → redirect về `/login`
- Sau login → thấy MainLayout với placeholder page
- Navigate giữa các pages không bị flash/re-mount layout
