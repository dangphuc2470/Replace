# 🔒 Text Replacer - Chrome Extension

Extension Chrome để thay thế văn bản, bảo vệ thông tin cá nhân của bạn khi nhập liệu và hiển thị trên trang web.

## ✨ Tính năng

- **Thay thế trong Input**: Hiển thị văn bản giả khi bạn nhập, nhưng gửi văn bản thật
- **Thay thế trên trang**: Tự động thay thế văn bản thật thành văn bản giả trên toàn bộ nội dung trang web
- **Bảo vệ Email**: Người khác xem tài khoản đã đăng nhập sẽ chỉ thấy email giả
- **Quản lý dễ dàng**: Giao diện đẹp mắt để thêm/xóa các cặp thay thế
- **Đồng bộ**: Danh sách thay thế được lưu và đồng bộ qua Chrome

## 📦 Cài đặt

1. Mở Chrome và truy cập `chrome://extensions/`
2. Bật **Developer mode** (góc trên bên phải)
3. Click **Load unpacked**
4. Chọn thư mục `Replace` này
5. Extension đã được cài đặt! ✅

## 🚀 Sử dụng

1. Click vào icon extension trên thanh công cụ
2. Nhập **văn bản thật** (VD: `real@email.com`)
3. Nhập **văn bản giả** (VD: `fake@email.com`)
4. Click **Thêm**
5. Mở bất kỳ trang web nào và nhập văn bản thật - nó sẽ tự động hiển thị thành văn bản giả!

## 🎯 Ví dụ sử dụng

### Ví dụ 1: Bảo vệ Email
- **Văn bản thật**: `myrealemail@gmail.com`
- **Văn bản giả**: `fakeemail123@example.com`
- Khi nhập email thật vào form → Hiển thị email giả
- Khi gửi form → Email thật được gửi đi

### Ví dụ 2: Ẩn số điện thoại
- **Văn bản thật**: `0123456789`
- **Văn bản giả**: `0987654321`
- Người khác nhìn vào màn hình chỉ thấy số giả

## 🔧 Cấu trúc dự án

```
Replace/
├── manifest.json       # Cấu hình extension
├── popup.html          # Giao diện popup
├── popup.css           # Styling với gradient đẹp mắt
├── popup.js            # Logic quản lý replacements
├── content.js          # Script chạy trên mọi trang web
└── icons/              # Icon extension
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 💡 Lưu ý

- Extension hoạt động trên **mọi trang web**
- Văn bản thật **luôn được gửi đi** khi submit form
- Người khác **không thể thấy** văn bản thật của bạn
- Danh sách thay thế được **lưu tự động**

## 🎨 Giao diện

Extension có giao diện hiện đại với:
- Gradient tím đẹp mắt
- Animation mượt mà
- Responsive design
- Vietnamese-friendly

## 🔐 Bảo mật

Extension này:
- ✅ Chỉ lưu dữ liệu local trên máy bạn
- ✅ Không gửi dữ liệu đi đâu
- ✅ Open source, code rõ ràng
- ✅ Không yêu cầu quyền nhạy cảm

---

**Tác giả**: Created with ❤️ by Antigravity  
**Phiên bản**: 1.0.0
