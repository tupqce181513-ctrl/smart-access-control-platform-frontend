# Prompt 04 - Auth Context

## Mục tiêu
Tạo AuthContext và useAuth hook để quản lý trạng thái đăng nhập toàn ứng dụng.

## Context
- Đọc `docs/backend-api.md` → phần 2 (Authentication System), phần 3 (User Model)
- Đọc `docs/business-rules.md` → phần 1 (Role-Based Access)
- Sử dụng `src/api/authApi.js` và `src/api/userApi.js` (đã tạo ở prompt 02)

## Yêu cầu

### `src/contexts/AuthContext.jsx`

#### State:
```
- user: object | null        // user info từ API
- accessToken: string | null  // JWT access token
- refreshToken: string | null // refresh token
- isAuthenticated: boolean    // derived: !!user && !!accessToken
- isLoading: boolean          // true khi đang kiểm tra auth ban đầu
```

#### Actions:
```
- login(email, password):
  1. Gọi authApi.login()
  2. Lưu accessToken + refreshToken vào localStorage
  3. Set user state
  4. Return user data

- register(data):
  1. Gọi authApi.register()
  2. KHÔNG auto login (user cần verify email trước)
  3. Return response

- logout():
  1. Gọi authApi.logout() (best effort, không cần await)
  2. Clear localStorage (accessToken, refreshToken)
  3. Set user = null, tokens = null
  4. Navigate to /login

- refreshAccessToken():
  1. Lấy refreshToken từ localStorage
  2. Gọi authApi.refreshToken()
  3. Cập nhật accessToken + refreshToken mới
  4. Return new accessToken

- updateProfile(data):
  1. Gọi userApi.updateProfile()
  2. Cập nhật user state
```

#### Init Logic (useEffect on mount):
```
1. Kiểm tra localStorage có accessToken không
2. Nếu có → thử gọi getProfile() để verify token còn valid
3. Nếu thành công → set user, isAuthenticated = true
4. Nếu thất bại → try refresh token → nếu vẫn fail → clear all
5. Set isLoading = false
```

### `useAuth` hook:
```
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

## Lưu ý
- AuthProvider wrap toàn bộ app trong main.jsx
- Trong khi isLoading = true → hiển thị loading screen (tránh flash)
- Sử dụng useCallback cho các actions để tránh unnecessary re-renders
- Token storage keys: `accessToken`, `refreshToken` (consistent với axios interceptor)
