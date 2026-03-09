# Prompt 15: Trang Home - Giới Thiệu Dự Án

## Mục Tiêu
Tạo một trang landing page hấp dẫn tại `/home` giới thiệu nền tảng Smart Access Control Platform với thiết kế hiện đại, chuyên nghiệp.

## Yêu Cầu

### 1. Cấu Trúc Trang
- **Header/Hero Section**
  - Tiêu đề nổi bật: "Nền Tảng Quản Lý Kiểm Soát Truy Cập Thông Minh"
  - Slogan mô tả mục đích của dự án
  - Nền tảng với gradient hoặc ảnh
  - Nút CTA: "Bắt Đầu Ngay" (đến login), "Đăng Ký" (đến register)

- **Phần Tính Năng**
  - Hiển thị 3-4 tính năng chính với icons:
    - Quản Lý Thiết Bị
    - Kiểm Soát Truy Cập
    - Nhật Ký Hoạt Động
    - Thông Báo Thời Gian Thực
  - Mỗi tính năng có mô tả và icon

- **Phần Lợi Ích**
  - Tại sao sử dụng nền tảng này
  - Bảo mật, hiệu quả, độ tin cây, khả năng mở rộng
  - Sử dụng card hoặc grid layout

- **Phần Cách Hoạt Động**
  - Tổng quan từng bước (3-4 bước)
  - Biểu diễn trực quan với icons/números

- **Footer**
  - Thông tin công ty, links, bản quyền
  - Thông tin liên hệ (tùy chọn)

### 2. Yêu Cầu Thiết Kế
- Sử dụng **Lucide React** cho icons
- Sử dụng **TailwindCSS** cho styling với hỗ trợ dark mode
- Thiết kế responsive (mobile, tablet, desktop)
- Animations/transitions mượt mà
- Bảng màu: Xanh (#3B82F6) làm màu chủ với nền trắng/xám
- Typography: Font Inter (đã import)

### 3. Components Cần Tạo
```
src/pages/HomePage.jsx              # Trang chủ
src/components/home/HeroSection.jsx # Banner hero với CTA
src/components/home/FeaturesGrid.jsx # Showcase tính năng
src/components/home/BenefitsCard.jsx # Phần lợi ích
src/components/home/StepsSection.jsx # Cách hoạt động
src/components/home/Footer.jsx      # Thành phần footer
```

### 4. Chi Tiết Triển Khai

**HeroSection Component:**
- Hiển thị tiêu đề và mô tả dự án
- Hai nút Call-to-Action
  - "Đăng Nhập" → navigate tới `/login`
  - "Bắt Đầu Ngay" → navigate tới `/register`
- Nền gradient với animation tinh tế

**FeaturesGrid Component:**
- Map array các tính năng với icons
- Mỗi card tính năng hiển thị:
  - Icon (từ lucide-react)
  - Tiêu đề
  - Mô tả
- Sử dụng grid layout (responsive columns)

**BenefitsCard Component:**
- Hiển thị các lợi ích chính dưới dạng card
- Icon + tiêu đề + mô tả
- Hiệu ứng hover

**StepsSection Component:**
- Hiển thị 3-4 bước bắt đầu
- Số bước/icon
- Tiêu đề bước và mô tả
- Trực quan kiểu timeline

**Footer Component:**
- Tên công ty
- Quick links
- Social media links (tùy chọn)
- Thông tin bản quyền
- Thông tin liên hệ

### 5. Tích Hợp Navigation
- Cập nhật `src/App.jsx` để thêm route:
  ```jsx
  {
    path: '/home',
    element: <HomePage />
  }
  ```
- Làm trang đích mặc định (có thể truy cập trước khi login)
- Thêm link tới home từ protected routes nếu cần

### 6. Hướng Dẫn Styling
- Sử dụng TailwindCSS utility classes
- **Container:** `max-w-7xl mx-auto px-4`
- **Spacing:** Padding rộng giữa các phần (py-12 to py-20)
- **Màu Text:**
  - Chính: `text-gray-900 dark:text-gray-100`
  - Phụ: `text-gray-600 dark:text-gray-300`
- **Button**: Góc vuông hoặc bo tròn (rounded-lg)
- **Icons:** Kích thước 24 đến 48 tùy theo ngữ cảnh

### 7. Ví Dụ Cấu Trúc Dữ Liệu
```javascript
const features = [
  {
    icon: 'Lock',
    title: 'Truy Cập An Toàn',
    description: 'Kiểm soát ai có thể truy cập thiết bị của bạn với quyền hạn chi tiết'
  },
  {
    icon: 'BarChart3',
    title: 'Nhật Ký Hoạt Động',
    description: 'Theo dõi tất cả các nỗ lực truy cập và tương tác thiết bị'
  },
  {
    icon: 'Bell',
    title: 'Cảnh Báo Thời Gian Thực',
    description: 'Nhận thông báo ngay lập tức cho các sự kiện quan trọng'
  },
  {
    icon: 'Smartphone',
    title: 'Quản Lý Thiết Bị',
    description: 'Quản lý và giám sát tất cả thiết bị của bạn từ một nơi'
  }
];
```

### 8. Cân Nhắc Hiệu Năng
- Lazy load hình ảnh không quan trọng
- Sử dụng React.memo cho static components
- Tối ưu animations (không JS nặng, dùng CSS nếu có thể)

### 9. Testing
- Kiểm tra tất cả các nút và xác minh navigation
- Test responsive design trên mobile (375px), tablet (768px), desktop (1920px)
- Xác minh dark mode hoạt động
- Test trên Chrome, Firefox, Safari

### 10. Deliverables Cuối Cùng
- Home page được styling đầy đủ và responsive
- Tất cả CTAs hoạt động
- Navigation mượt mà giữa home, login, và register
- Sẵn sàng cho deployment production
