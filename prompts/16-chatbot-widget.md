# Prompt 16: Widget Chatbot - Trợ Lý Dự Án

## Mục Tiêu
Tạo một widget chatbot đơn giản có thể tích hợp vào trang home (và các trang khác) để cung cấp thông tin dự án cơ bản và tương tác chào hỏi.

## Yêu Cầu

### 1. Tính Năng Chatbot
- **Chào Hỏi Ban Đầu:** Bot phản hồi với thông điệp chào mừng khi mở lần đầu
- **Q&A Đơn Giản:** Bot có thể trả lời các câu hỏi cơ bản:
  - "Xin chào" / "Hi" → Phản hồi chào hỏi
  - "Cái này là gì?" → Giải thích nền tảng
  - "Cách sử dụng?" → Hướng dẫn sử dụng ngắn
  - "Liên hệ" → Thông tin liên hệ
- **Có Thể Mở Rộng:** Dễ dàng thêm các cặp Q&A từ backend hoặc file config
- **Lưu Trữ Phiên:** Ghi nhớ lịch sử cuộc trò chuyện trong phiên hiện tại
- **Chỉ Báo Nhập:** Hiển thị bot đang "suy nghĩ" trước khi phản hồi

### 2. Các Thành Phần UI

**ChatWidget Component:**
```
src/components/home/ChatWidget.jsx     # Widget chat chính
src/components/home/ChatBubble.jsx     # Bubble tin nhắn riêng lẻ
src/components/home/ChatInput.jsx      # Khu vực nhập tin nhắn
src/hooks/useChat.js                    # Hook logic chat
src/utils/chatBotResponses.js           # Dữ liệu phản hồi bot
```

### 3. Thiết Kế Widget
- **Vị Trí:** Góc dưới bên phải cố định
- **Trạng Thái Đóng:**
  - Nút float với chat icon
  - Badge hiển thị tin nhắn chưa đọc (nếu có)
  - Hiệu ứng hover
- **Trạng Thái Mở:**
  - Cửa sổ chat (rộng 300-400px, cao 500px)
  - Responsive trên mobile (full width hoặc lớn hơn)
  - Header với nút đóng
  - Danh sách tin nhắn với scroll
  - Trường nhập ở dưới

### 4. Cấu Trúc Tin Nhắn

**Tin Nhắn Người Dùng:**
```
{
  id: 'msg-1',
  type: 'user',
  content: 'Xin chào',
  timestamp: Date.now()
}
```

**Tin Nhắn Bot:**
```
{
  id: 'bot-1',
  type: 'bot',
  content: 'Xin chào! Chào mừng đến Nền Tảng Quản Lý Kiểm Soát Truy Cập. Tôi có thể giúp gì?',
  timestamp: Date.now()
}
```

### 5. Cấu Trúc Dữ Liệu Phản Hồi Bot

**File: `src/utils/chatBotResponses.js`**

```javascript
export const botResponses = {
  greeting: [
    'Xin chào! 👋 Chào mừng đến Nền Tảng Quản Lý Kiểm Soát Truy Cập.',
    'Hey 👋 Tôi có thể giúp bạn ngày hôm nay như thế nào?',
    'Chào mừng! 😊 Bạn muốn biết điều gì?'
  ],
  
  whatIs: {
    keywords: ['cái này là gì', 'là gì', 'giới thiệu', 'giải thích', 'platform'],
    response: 'Nền Tảng Quản Lý Kiểm Soát Truy Cập Thông Minh là giải pháp toàn diện để quản lý truy cập thiết bị, quyền hạn và giám sát. Nó cho phép bạn kiểm soát ai có thể truy cập thiết bị của bạn và theo dõi tất cả hoạt động trong thời gian thực.'
  },
  
  howToUse: {
    keywords: ['cách sử dụng', 'làm sao', 'bắt đầu', 'hướng dẫn', 'how'],
    response: '1. Tạo tài khoản\n2. Đăng nhập vào bảng điều khiển\n3. Thêm thiết bị của bạn\n4. Đặt quyền truy cập\n5. Giám sát nhật ký hoạt động\n6. Quản lý thông báo\n\nBạn cần chi tiết về bước nào?'
  },
  
  contact: {
    keywords: ['liên hệ', 'email', 'hỗ trợ', 'giúp đỡ', 'contact', 'support'],
    response: 'Bạn có thể liên hệ với chúng tôi tại:\n📧 Email: support@smartaccess.com\n📞 Điện thoại: +84 (28) 1234-5678\n💬 Chat trực tiếp khả dụng Thứ 2-Thứ 6 9AM-6PM'
  },
  
  features: {
    keywords: ['tính năng', 'có thể làm gì', 'features', 'capabilities'],
    response: '🔐 Quản Lý Thiết Bị\n🔑 Kiểm Soát Truy Cập\n📊 Nhật Ký Hoạt Động\n🔔 Thông Báo Thời Gian Thực\n👥 Quản Lý Người Dùng\n⚙️ Bảng Điều Khiển Admin'
  },
  
  default: 'Hiểu rồi. Bạn có muốn biết gì khác về nền tảng không?'
};
```

### 6. Chi Tiết Triển Khai

**ChatWidget Component:**
- State: `isOpen`, `messages`, `inputValue`
- Functions:
  - `handleSendMessage()` - Thêm tin nhắn người dùng và lấy phản hồi bot
  - `toggleChat()` - Mở/đóng widget chat
  - `handleInputChange()` - Cập nhật text nhập
  - `scrollToBottom()` - Tự động scroll đến tin nhắn mới nhất

**useChat Hook:**
```javascript
export const useChat = () => {
  const [messages, setMessages] = useState([
    { id: 'initial', type: 'bot', content: 'Xin chào! Tôi có thể giúp gì?', timestamp: Date.now() }
  ]);
  
  const addMessage = (content, type) => {
    // Thêm tin nhắn vào lịch sử
  };
  
  const getBotResponse = (userMessage) => {
    // Khớp từ khóa và trả về phản hồi phù hợp
    // Thêm độ trễ typing để thực tế
  };
  
  return { messages, addMessage, getBotResponse };
};
```

**ChatBubble Component:**
- Props: `message`, `isBot`
- Style khác nhau cho tin nhắn người dùng vs bot
- Người dùng: Căn phải, nền xanh
- Bot: Căn trái, nền xám
- Hiển thị timestamp khi hover

**ChatInput Component:**
- Trường nhập với placeholder
- Nút gửi với icon
- Phím Enter để gửi
- Tắt khi bot đang nhập

### 7. Hướng Dẫn Styling

**Chat Widget Container:**
```
- Position: fixed bottom-right (góc dưới bên phải cố định)
- Width: 350px (desktop), 100% (mobile < 640px)
- Height: 500px (desktop), 70vh (mobile)
- Border-radius: rounded-lg
- Shadow: shadow-2xl
- z-index: z-50
```

**Chat Bubble (Người Dùng):**
```
- Background: bg-blue-600 text-white
- Alignment: ml-auto (bên phải)
- Margin: mr-4, mb-3
- Border-radius: rounded-lg rounded-br-none
- Max-width: w-3/4 or max-w-xs
```

**Chat Bubble (Bot):**
```
- Background: bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100
- Alignment: mr-auto (bên trái)
- Margin: ml-4, mb-3
- Border-radius: rounded-lg rounded-bl-none
- Max-width: w-3/4 or max-w-xs
```

**Float Button (Đóng):**
```
- Size: w-14 h-14
- Icon: MessageCircle từ lucide-react
- Background: bg-blue-600 hover:bg-blue-700
- Position: fixed bottom-6 right-6
- Border-radius: rounded-full
- Shadow: shadow-lg
- Transition: transition-all
```

### 8. Tính Năng Cần Triển Khai

**Phase 1 (MVP):**
- ✅ Widget chat với toggle
- ✅ Phản hồi cố định cho từ khóa
- ✅ Lịch sử tin nhắn trong phiên hiện tại
- ✅ Chỉ báo nhập
- ✅ Styling cơ bản

**Phase 2 (Tương Lai):**
- Lịch sử chat lâu dài (localStorage)
- Phản hồi thông minh hơn (fuzzy matching)
- Tích hợp database cho phản hồi tùy chỉnh
- Admin panel để cập nhật phản hồi bot
- Hỗ trợ đa ngôn ngữ
- Tích hợp backend API cho queries phức tạp

### 9. Các Điểm Tích Hợp

**Thêm vào HomePage:**
```jsx
import ChatWidget from '../components/home/ChatWidget';

// Trong HomePage JSX:
<ChatWidget />
```

**Tùy chọn: Thêm vào các trang khác**
```jsx
// Trong App.jsx, wrap tất cả routes
<ChatWidget /> // Hoặc hiển thị có điều kiện chỉ trên một số trang
```

### 10. Những Cân Nhắc Khi Triển Khai
- Widget chat không nên can thiệp vào các phần tử UI khác
- Xử lý bàn phím mobile đúng cách (iOS/Android)
- Đảm bảo chat không chặn nội dung quan trọng trên mobile
- Test với mạng chậm (thêm simulation độ trễ phản hồi)
- Xem xét quyền riêng tư dữ liệu chat (không lưu info nhạy cảm)

### 11. Danh Sách Kiểm Tra Testing
- [ ] Widget mở và đóng mượt mà
- [ ] Tin nhắn gửi và hiển thị đúng
- [ ] Bot phản hồi khớp từ khóa
- [ ] Chỉ báo nhập hiển thị/ẩn
- [ ] Scroll to bottom hoạt động
- [ ] Layout mobile responsive
- [ ] Dark mode hoạt động
- [ ] Không có lỗi console

### 12. Ghi Chú Mở Rộng

**Thêm Phản Hồi Mới:**
1. Thêm keyword set mới vào `chatBotResponses.js`
2. Cập nhật logic matching keywords trong `getBotResponse()`
3. Test với các input người dùng khác nhau
4. Document phản hồi mới trong response file

**Tích Hợp Backend Tương Lai:**
```javascript
// Có thể fetch responses từ API
const response = await fetch('/api/chat/query', {
  method: 'POST',
  body: JSON.stringify({ message: userMessage })
});
const botMessage = await response.json();
```

### 13. Deliverables Cuối Cùng
- Chat widget đầy đủ chức năng
- Phản hồi các câu chào hỏi và câu hỏi cơ bản
- Animations và transitions mượt mà
- Responsive trên mobile
- Được chuẩn bị để mở rộng với nhiều phản hồi hơn
- Có tài liệu và dễ bảo trì
