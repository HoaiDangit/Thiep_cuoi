# Mở file này trước

Gói source Lời Hẹn có hai bản:

| Thư mục | Dùng để làm gì |
|---|---|
| original-sites | Bản gốc đã xuất từ source của website đang chạy trong ChatGPT, commit d90f54f7faaaa40b016da4bef9a1723e44a000d0. Còn phụ thuộc đăng nhập và hosting Sites. |
| Gốc repository (`app/`, `lib/`, `public/`...) | Bản `cloudflare-app` đã được chuyển đổi để triển khai trên tài khoản Cloudflare riêng, đăng nhập qua m?t kh?u qu?n tr? v? D1 và tự cập nhật từ GitHub Actions. Bao gồm các cập nhật ảnh, 14 mẫu thiệp, khổ ngang/dọc và font tiếng Việt. |

**Để chạy hoặc triển khai:** mở terminal tại gốc repository và đọc `DEPLOY_GUIDE_VI.md`. Trong bản source trên máy, ứng dụng này nằm trong thư mục `cloudflare-app`; trên GitHub, nội dung thư mục đó được đặt ở gốc để GitHub Actions chạy đúng. `original-sites/` giữ bản gốc để tham khảo.

Gói chứa toàn bộ source, ảnh, các thành phần UI, cấu hình, lockfile và migration schema. Không chứa node_modules, thư mục build/cache, git credentials hoặc dữ liệu thiệp/khách mời thật. Phụ thuộc được cài lại bằng pnpm từ lockfile.

Bản độc lập đã có mã đăng nhập email, cấu hình D1/Worker và pipeline GitHub. Repository nguồn là https://github.com/HoaiDangit/Thiep_cuoi. Anh vẫn cần tạo dịch vụ và điền cấu hình tài khoản thật; việc cập nhật source lên GitHub không có nghĩa website đã được deploy.

Source và GitHub không tự đồng bộ dữ liệu D1. Xem phần chuyển dữ liệu trong hướng dẫn nếu đã có khách mời thật trên bản cũ.
