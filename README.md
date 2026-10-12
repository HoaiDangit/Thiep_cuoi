# Lời Hẹn — thiệp cưới online

Ứng dụng tiếng Việt dùng React/Vinext, Cloudflare Workers và D1. Đăng nhập quản trị bằng mật khẩu; khách nhận link không cần đăng nhập. Bản này không cần Supabase.

## Chức năng
- 14 mẫu thiệp, khổ dọc 2:3 hoặc ngang 3:2.
- Tải ảnh JPG/PNG/WebP, hòa ảnh với nền, chỉnh độ hiện và vị trí; thư viện tối đa 20 ảnh. Ảnh được xử lý thành JPEG tối đa 1600 px và 1 MB trước khi lưu D1.
- Lưu thông tin thiệp, tạo link riêng từng khách và tự lưu danh sách trong D1.
- Mỗi link mới mở trong đúng 40 ngày kể từ lúc tạo. Đổi tên không thay link hoặc gia hạn. Sau hết hạn, link đóng và thông tin vẫn giữ trong danh sách để tra cứu.
- Xem, sao chép link, tải lại danh sách, thu hồi, tìm khách và xuất CSV; tối đa 400 khách mỗi thiệp, nhập tối đa 200 tên mỗi lần.
- Thông tin thiệp đã lưu được hiển thị khi khách mở link; các link hiện có cập nhật theo nội dung thiệp mới lưu.
- Chống tạo trùng khi thử lại cùng yêu cầu bị lỗi mạng.

## Chạy local
Node >=22.13, pnpm 11.25.0. Cài dependencies bằng `pnpm install --frozen-lockfile`. Sao chép `.dev.vars.example` thành `.dev.vars` và đặt ADMIN_PASSWORD ngẫu nhiên từ 16 ký tự. Chạy `pnpm run db:local`, `pnpm run dev`, mở /login.

## Deploy
Đọc [DEPLOY_GUIDE_VI.md](DEPLOY_GUIDE_VI.md). Worker: thiep-cuoi; database: thiep-cuoi-db. Session quản trị có hiệu lực 7 ngày, lưu token đã băm trong D1; HttpOnly, SameSite=Lax và Secure trên HTTPS. Đổi ADMIN_PASSWORD vô hiệu hóa phiên cũ. Có giới hạn 5 lần thử đăng nhập mỗi 15 phút theo IP.

Source không chứa mật khẩu thật hoặc dữ liệu khách. Không push .dev.vars, .wrangler, node_modules hay dist. original-sites/ trong repo là bản tham khảo và không thuộc build chính. Chưa có RSVP, thanh toán hoặc quản lý nhiều tài khoản.

## Kiểm tra
`pnpm run check`, `pnpm run test`, `pnpm run build`. Xem VALIDATION.md để biết kiểm tra và giới hạn thực tế.
