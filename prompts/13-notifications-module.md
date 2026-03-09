# Prompt 13 - Notifications Module

## Mục tiêu
Implement NotificationContext và module Notifications: bell indicator, notification list, notification page.

## Context
- Đọc `docs/backend-api.md` phần 7 (Notification)
- Đọc `docs/ui-spec.md` phần 8 (Notifications Page)
- Sử dụng: notificationApi, useAuth, common components

## Files cần tạo

### 1. `src/contexts/NotificationContext.jsx`
```
State:
  - unreadCount: number (default: 0)
  - notifications: array (for current page view)
  - loading: boolean

Actions:
  - fetchUnreadCount():
    → notificationApi.getUnreadCount()
    → update unreadCount
  
  - fetchNotifications(params?):
    → notificationApi.getNotifications(params)
    → update notifications + pagination
  
  - markAsRead(id):
    → notificationApi.markAsRead(id)
    → update local state (set isRead=true)
    → decrease unreadCount
  
  - markAllAsRead():
    → notificationApi.markAllAsRead()
    → update all local to isRead=true
    → set unreadCount = 0

Init:
  - Khi user đã authenticated → fetchUnreadCount()
  - Poll mỗi 60 giây (setInterval) → fetchUnreadCount()
  - Clear interval khi unmount hoặc logout
```

**NotificationProvider** wraps the app (bên trong AuthProvider):
```jsx
export const NotificationProvider = ({ children }) => {
  // ... context logic
  return (
    <NotificationContext.Provider value={...}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
```

### 2. `src/components/notifications/NotificationBell.jsx`
```
- Bell icon (từ Lucide: Bell)
- Badge đỏ hiển thị unreadCount (nếu > 0)
- Badge: min-w, rounded-full, absolute positioned
- Nếu unreadCount > 99 → hiển thị "99+"
- Click → navigate to /notifications
- Sử dụng useNotifications() hook
```

### 3. `src/components/notifications/NotificationItem.jsx`
```
Props: notification, onMarkRead

- Icon theo type:
  - access_alert: Shield icon (amber)
  - device_offline: WifiOff icon (red)
  - permission_granted: Key icon (green)
  - permission_revoked: XCircle icon (red)
- Title (bold nếu unread)
- Message (text-secondary)
- Time ago (formatTimeAgo)
- Unread indicator: blue dot bên trái + bg highlight
- Click → onMarkRead(id) → đánh dấu đã đọc
- Related device link (nếu có)
```

### 4. `src/components/notifications/NotificationList.jsx`
```
Props: notifications, onMarkRead, loading

- List layout (không phải table)
- Mỗi item là NotificationItem
- Loading: skeleton items
- Empty: EmptyState "No notifications"
- Grouped by date? (optional: Today, Yesterday, Earlier)
```

### 5. `src/pages/NotificationsPage.jsx`
```
- Page header: "Notifications" + "Mark all as read" button
- NotificationList
- Pagination
- Filter: All / Unread only toggle

Data: useNotifications().fetchNotifications()
```

### 6. Cập nhật `src/main.jsx`
```jsx
import { NotificationProvider } from './contexts/NotificationContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
```

> **Quan trọng**: Thêm `NotificationProvider` vào `main.jsx`, wrap bên ngoài `<App />` nhưng bên trong `<AuthProvider>` (vì NotificationContext cần dùng auth state).

### 7. Cập nhật `src/components/layout/Header.jsx`
```
- Thay thế notification bell placeholder (nếu có) bằng component NotificationBell thật
- Import NotificationBell từ '../notifications/NotificationBell'
- Đặt vào vị trí bên trái user avatar dropdown
```

## Lưu ý
- NotificationProvider phải nằm BÊN TRONG AuthProvider (cần biết user đã login chưa)
- Polling 60s cho unread count (không phải full list)
- Khi logout → clear notifications state + stop polling
- Toast notification cho real-time events (optional, có thể dùng kết hợp)
