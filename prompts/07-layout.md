# Prompt 07 - Layout Components

## Mục tiêu
Tạo layout components: Sidebar, Header, MainLayout, MobileNav cho ứng dụng chính (sau khi đăng nhập).

## Context
- Đọc `docs/ui-spec.md` phần 2 (Layout Chính) và phần 1 (Color Scheme)
- Đọc `docs/business-rules.md` phần "Sidebar Navigation" để biết menu items theo role
- Sử dụng AuthContext (useAuth) để lấy user info + role
- Sử dụng `utils/permissionHelpers.js` → `getNavItems(role)`
- Tailwind CSS v4: dark mode dùng `@custom-variant dark` (đã cấu hình ở index.css)

## Files cần tạo

### 1. `src/components/layout/Sidebar.jsx`
```
- Width: w-64 (desktop), hidden trên mobile
- Logo/Brand ở trên cùng
- Navigation items (icon + label)
- Active item: highlighted background
- Items theo role (từ getNavItems):
  - Tất cả: Dashboard, Notifications, Profile
  - owner + admin: Devices, Access Management
  - admin only: Users Management, Logs
  - member: My Devices, My Access
- Logout button ở dưới cùng
- Sử dụng Lucide icons cho mỗi nav item
- Sử dụng NavLink từ react-router-dom (active state)
```

### 2. `src/components/layout/Header.jsx`
```
- Height: h-16, sticky top
- Left: hamburger menu (mobile only) + breadcrumb/page title
- Right: 
  - Dark mode toggle button (Sun/Moon icon)
  - Notification bell + unread count badge (từ NotificationContext nếu có, hoặc placeholder)
  - User avatar + name dropdown
    - Profile link
    - Logout button
- Dark mode: toggle class 'dark' trên document.documentElement
  - Lưu preference vào localStorage key 'theme'
  - Khi init: đọc từ localStorage hoặc prefer-color-scheme
```

### 3. `src/components/layout/MainLayout.jsx`
```jsx
// Layout wrapper cho tất cả authenticated pages
// Bao gồm Sidebar + Header + Main content area
import { Outlet } from 'react-router-dom';

// Structure:
// <div className="flex h-screen">
//   <Sidebar />
//   <div className="flex-1 flex flex-col">
//     <Header />
//     <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
//       <Outlet />
//     </main>
//   </div>
// </div>

// Quản lý sidebar collapsed state
// Mobile: sidebar overlay khi mở
```

### 4. `src/components/layout/MobileNav.jsx`
```
- Overlay sidebar cho mobile (< 768px)
- Slide-in từ trái
- Backdrop semi-transparent
- Close khi click backdrop hoặc chọn nav item
- Cùng nav items với Sidebar
```

## Dark Mode Implementation
```
// Toggle function:
const toggleDarkMode = () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

// Init (trong useEffect hoặc script):
const theme = localStorage.getItem('theme');
if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
}
```

> **Lưu ý Tailwind v4**: Dark mode đã được khai báo `@custom-variant dark (&:where(.dark, .dark *))` trong `index.css` (Prompt 01). Không cần config `darkMode: 'class'` trong file cấu hình nào.

## Lưu ý
- Sidebar + Header dùng chung 1 `MainLayout`, đặt tại route level
- MainLayout sử dụng `<Outlet />` để render child routes
- Tất cả protected routes (bao gồm admin) nằm trong cùng 1 MainLayout (xem prompt 08)
- Responsive: mobile breakpoint md (768px)
