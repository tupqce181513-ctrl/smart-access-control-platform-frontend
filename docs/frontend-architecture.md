# Frontend Architecture - Smart Access Control Platform

## 1. Tech Stack

| Công nghệ | Version | Mục đích |
|-----------|---------|----------|
| React | 18+ | UI Library |
| Vite | 5+ | Build tool |
| React Router | v6 | Client-side routing |
| Zustand / Context API | - | State management |
| Axios | - | HTTP client |
| Tailwind CSS | v4 | Utility CSS |
| react-hot-toast | - | Toast notifications |
| Lucide React | - | Icon library |
| date-fns | - | Date formatting |

---

## 2. Folder Structure

```
src/
├── api/                      # API layer
│   ├── axios.js              # Axios instance + interceptors
│   ├── authApi.js            # Auth endpoints
│   ├── deviceApi.js          # Device endpoints
│   ├── accessApi.js          # Access permission endpoints
│   ├── logApi.js             # Access log endpoints
│   ├── notificationApi.js    # Notification endpoints
│   └── userApi.js            # User management endpoints
│
├── components/               # Reusable components
│   ├── common/               # Shared UI components
│   │   ├── LoadingSpinner.jsx
│   │   ├── Pagination.jsx
│   │   ├── ConfirmModal.jsx
│   │   ├── EmptyState.jsx
│   │   ├── StatusBadge.jsx
│   │   └── RoleBadge.jsx
│   │
│   ├── layout/               # Layout components
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   ├── MainLayout.jsx
│   │   └── MobileNav.jsx
│   │
│   ├── auth/                 # Auth components
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── devices/              # Device components
│   │   ├── DeviceCard.jsx
│   │   ├── DeviceTable.jsx
│   │   ├── DeviceForm.jsx
│   │   ├── DeviceDetail.jsx
│   │   └── DeviceControl.jsx
│   │
│   ├── access/               # Access management components
│   │   ├── PermissionTable.jsx
│   │   ├── GrantPermissionForm.jsx
│   │   ├── PermissionDetail.jsx
│   │   ├── ScheduleDisplay.jsx
│   │   └── AccessTypeBadge.jsx
│   │
│   ├── logs/                 # Log components
│   │   ├── LogTable.jsx
│   │   ├── LogFilter.jsx
│   │   └── LogDetail.jsx
│   │
│   └── notifications/        # Notification components
│       ├── NotificationList.jsx
│       ├── NotificationItem.jsx
│       └── NotificationBell.jsx
│
├── contexts/                 # React contexts
│   ├── AuthContext.jsx        # Auth state + actions
│   └── NotificationContext.jsx # Notification state
│
├── hooks/                    # Custom hooks
│   ├── useDevices.js
│   └── ...
│
├── pages/                    # Page components (route-level)
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── VerifyEmailPage.jsx
│   ├── DashboardPage.jsx
│   ├── DevicesPage.jsx
│   ├── DeviceDetailPage.jsx
│   ├── AccessControlPage.jsx
│   ├── LogsPage.jsx
│   ├── NotificationsPage.jsx
│   ├── ProfilePage.jsx
│   └── admin/
│       └── UsersPage.jsx
│
├── utils/                    # Utility functions
│   ├── constants.js           # API_URL, ROLES, DEVICE_TYPES, etc.
│   ├── formatDate.js
│   ├── formatSchedule.js
│   └── permissionHelpers.js
│
├── App.jsx                   # Root component + Router
├── main.jsx                  # Entry point
└── index.css                 # Tailwind imports
```

---

## 3. Routing Structure

```jsx
<BrowserRouter>
  {/* Public routes */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/verify-email" element={<VerifyEmailPage />} />
  
  {/* Protected routes - wrapped in MainLayout */}
  <Route element={<ProtectedRoute />}>
    <Route element={<MainLayout />}>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/devices" element={<DevicesPage />} />
      <Route path="/devices/:id" element={<DeviceDetailPage />} />
      <Route path="/access" element={<AccessControlPage />} />
      <Route path="/logs" element={<LogsPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      
      {/* Admin only */}
      <Route path="/admin/users" element={<UsersPage />} />
    </Route>
  </Route>
</BrowserRouter>
```

Lưu ý: Tất cả protected routes (bao gồm admin) dùng chung 1 `<MainLayout />` wrapper duy nhất để tránh re-mount layout khi navigate giữa các trang.

---

## 4. State Management

### AuthContext:
```
State:
  - user: object | null
  - accessToken: string | null
  - refreshToken: string | null
  - isAuthenticated: boolean
  - isLoading: boolean

Actions:
  - login(email, password)
  - register(data)
  - logout()
  - refreshAccessToken()
  - updateProfile(data)
```

### NotificationContext:
```
State:
  - unreadCount: number
  - notifications: array

Actions:
  - fetchUnreadCount()
  - markAsRead(id)
  - markAllAsRead()
```

---

## 5. Axios Interceptor Flow

```
Request Interceptor:
  → Nếu có accessToken → thêm header Authorization: Bearer <token>

Response Interceptor:
  → Status 401:
    → Thử refresh token
    → Nếu refresh thành công → retry request gốc
    → Nếu refresh thất bại → logout, redirect /login
  → Các error khác → trả về error cho caller xử lý
```

Xử lý refresh token race condition:
- Dùng biến `isRefreshing` và queue để tránh gọi refresh nhiều lần đồng thời

---

## 6. Implementation Order (Recommended)

| Order | Module | Phụ thuộc |
|-------|--------|----------|
| 1 | Project Setup (Vite, Tailwind, folder structure) | - |
| 2 | API Layer (Axios + service files) | - |
| 3 | Utils (constants, formatters) | - |
| 4 | Auth Context | API Layer |
| 5 | Common Components | - |
| 6 | Auth Module (Login/Register/Protected) | Auth Context |
| 7 | Layout (Sidebar, Header, MainLayout) | Auth Context |
| 8 | App Routing | Auth, Layout |
| 9 | Dashboard | API, Auth |
| 10 | Device Module | API, Auth, Common |
| 11 | Access Module | API, Auth, Common |
| 12 | Logs Module | API, Auth, Common |
| 13 | Notifications Module | API, Auth, Common |
| 14 | Profile + Admin Pages | API, Auth |
