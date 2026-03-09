# Prompt 01 - Project Setup

## Mục tiêu
Khởi tạo project React (Vite), cài dependencies, cấu hình Tailwind CSS v4, tạo folder structure.

## Context
- Dự án: Smart Access Control Platform - Frontend
- Đọc file: `docs/frontend-architecture.md` → mục 1 (Tech Stack) và mục 2 (Folder Structure)

## Yêu cầu chi tiết

### 1. Cài thêm dependencies (project Vite đã tạo sẵn)
```bash
npm install react-router-dom axios zustand react-hot-toast lucide-react date-fns
npm install -D tailwindcss @tailwindcss/vite
```

### 2. Cấu hình Tailwind CSS v4

**vite.config.js:**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**src/index.css:**
```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
}
```

> **Lưu ý**: Tailwind CSS v4 dùng `@import "tailwindcss"` thay vì `@tailwind base/components/utilities` của v3. Dark mode dùng `@custom-variant dark` thay vì `darkMode: 'class'` trong config.

### 3. Cập nhật index.html
- Thêm Google Fonts Inter
- Title: "Smart Access Control Platform"

### 4. Tạo folder structure
```
src/
├── api/
├── components/
│   ├── common/
│   ├── layout/
│   ├── auth/
│   ├── devices/
│   ├── access/
│   ├── logs/
│   └── notifications/
├── contexts/
├── hooks/
├── pages/
│   └── admin/
└── utils/
```

### 5. Xóa files mặc định
- Xóa `src/App.css`
- Xóa nội dung mặc định trong `src/App.jsx` (thay bằng placeholder đơn giản)
- Xóa logo assets mặc định

## Output mong đợi
- Project chạy được với `npm run dev`
- Tailwind CSS v4 hoạt động (test thử class `bg-blue-500`)
- Folder structure đầy đủ
- Không còn code mặc định của Vite template
