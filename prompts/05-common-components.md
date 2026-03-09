# Prompt 05 - Common Components

## Mục tiêu
Tạo 6 components dùng chung (common) cho toàn bộ ứng dụng.

## Context
- Đọc `docs/ui-spec.md` → phần 1 (Color Scheme) và UI/UX Guidelines
- Sử dụng Tailwind CSS v4, Lucide React icons
- Hỗ trợ dark mode (class `dark` trên html/body)

## Yêu cầu

### 1. `src/components/common/LoadingSpinner.jsx`
```
Props:
  - size: "sm" | "md" | "lg" (default: "md")
  - className: string?
  
- Spinner animation (animate-spin)
- Có thể dùng full-page overlay hoặc inline
- Khi fullPage: centered trên toàn màn hình
```

### 2. `src/components/common/Pagination.jsx`
```
Props:
  - page: number (current page)
  - totalPages: number
  - onPageChange: (page) => void
  - hasNextPage: boolean
  - hasPrevPage: boolean

- Hiển thị: [Prev] [1] [2] [3] ... [10] [Next]
- Prev disable khi page = 1
- Next disable khi page = totalPages
- Current page highlighted
- Responsive: trên mobile chỉ hiện Prev/Next + current/total
```

### 3. `src/components/common/ConfirmModal.jsx`
```
Props:
  - isOpen: boolean
  - title: string
  - message: string
  - confirmText: string (default: "Confirm")
  - cancelText: string (default: "Cancel")
  - variant: "danger" | "warning" | "info" (default: "danger")
  - onConfirm: () => void
  - onCancel: () => void
  - isLoading: boolean (default: false)

- Overlay backdrop (semi-transparent)
- Centered modal card
- variant ảnh hưởng màu nút confirm (red/amber/blue)
- isLoading: disable buttons + show spinner trên confirm button
- Close khi click backdrop hoặc nhấn Escape
```

### 4. `src/components/common/EmptyState.jsx`
```
Props:
  - icon: LucideIcon component (optional)
  - title: string
  - description: string?
  - action: { label: string, onClick: () => void }? (optional button)

- Centered layout
- Icon lớn (48px), màu gray
- Title semibold, description text-secondary
- Optional action button (primary style)
```

### 5. `src/components/common/StatusBadge.jsx`
```
Props:
  - status: "online" | "offline" | "locked" | "unlocked" | "success" | "failed" | "active" | "inactive"
  - size: "sm" | "md" (default: "sm")

Mapping:
  - online: green dot + "Online"
  - offline: gray dot + "Offline"
  - locked: red badge "Locked"
  - unlocked: green badge "Unlocked"
  - success: green badge "Success"
  - failed: red badge "Failed"
  - active: green badge "Active"
  - inactive: red badge "Inactive"
```

### 6. `src/components/common/RoleBadge.jsx`
```
Props:
  - role: "admin" | "owner" | "member"

Mapping:
  - admin: purple badge "Admin"
  - owner: blue badge "Owner"
  - member: gray badge "Member"
```

## Lưu ý
- Tất cả component hỗ trợ dark mode
- Sử dụng Lucide React cho icons (import { X, AlertTriangle, ... } from 'lucide-react')
- Mỗi component trong 1 file riêng
- Export default cho mỗi component
