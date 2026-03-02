export const botResponses = {
  greeting: [
    'Xin chào! 👋 Chào mừng đến Nền Tảng Quản Lý Kiểm Soát Truy Cập Thông Minh.',
    'Hey 👋 Tôi có thể giúp bạn ngày hôm nay như thế nào?',
    'Chào mừng! 😊 Bạn muốn biết điều gì?',
  ],

  whatIs: {
    keywords: ['cái này là gì', 'là gì', 'giới thiệu', 'giải thích', 'platform', 'nền tảng'],
    response:
      'Nền Tảng Quản Lý Kiểm Soát Truy Cập Thông Minh là giải pháp toàn diện để quản lý truy cập thiết bị, quyền hạn và giám sát. Nó cho phép bạn kiểm soát ai có thể truy cập thiết bị của bạn và theo dõi tất cả hoạt động trong thời gian thực.',
  },

  howToUse: {
    keywords: ['cách sử dụng', 'làm sao', 'bắt đầu', 'hướng dẫn', 'how'],
    response:
      '1. Tạo tài khoản\n2. Đăng nhập vào bảng điều khiển\n3. Thêm thiết bị của bạn\n4. Đặt quyền truy cập\n5. Giám sát nhật ký hoạt động\n6. Quản lý thông báo\n\nBạn cần chi tiết về bước nào?',
  },

  contact: {
    keywords: ['liên hệ', 'email', 'hỗ trợ', 'giúp đỡ', 'contact', 'support', 'phone'],
    response:
      'Bạn có thể liên hệ với chúng tôi tại:\n📧 Email: support@smartaccess.com\n📞 Điện thoại: +84 (28) 1234-5678\n💬 Chat trực tiếp khả dụng Thứ 2-Thứ 6 9AM-6PM',
  },

  features: {
    keywords: ['tính năng', 'có thể làm gì', 'features', 'capabilities', 'khả năng'],
    response:
      '🔐 Quản Lý Thiết Bị\n🔑 Kiểm Soát Truy Cập\n📊 Nhật Ký Hoạt Động\n🔔 Thông Báo Thời Gian Thực\n👥 Quản Lý Người Dùng\n⚙️ Bảng Điều Khiển Admin',
  },

  default: 'Hiểu rồi. Bạn có muốn biết gì khác về nền tảng không?',
};

export const findBotResponse = (userMessage) => {
  const message = userMessage.toLowerCase().trim();

  // Check greeting
  if (['xin chào', 'hi', 'hello', 'hey', 'chào', 'xin chào mừng'].some(keyword => message.includes(keyword))) {
    return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
  }

  // Check each response category
  for (const [key, value] of Object.entries(botResponses)) {
    if (key !== 'greeting' && key !== 'default' && value.keywords) {
      if (value.keywords.some(keyword => message.includes(keyword))) {
        return value.response;
      }
    }
  }

  // Default response
  return botResponses.default;
};
