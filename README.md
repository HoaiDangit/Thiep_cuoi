# Lời Hẹn — thiệp cưới online

Website: https://thiep-cuoi.thiep-hy-danglnh3264.workers.dev · Quản trị: /login. Xem DEPLOYMENT.md để biết kết quả kiểm tra và trạng thái tự động deploy.

Ứng dụng tiếng Việt dùng React/Vinext, Cloudflare Workers và D1. Đăng nhập quản trị bằng mật khẩu; khách nhận link không cần đăng nhập. Bản này không cần Supabase.

## Chức năng
- 31 mẫu thiệp, khổ dọc 2:3 hoặc ngang 3:2.
- Tải ảnh JPG/PNG/WebP, hòa ảnh với nền, chỉnh độ hiện và vị trí; thư viện tối đa 20 ảnh. Ảnh được xử lý thành JPEG tối đa 1600 px và 1 MB trước khi lưu D1.
- Lưu thông tin thiệp, tạo link riêng từng khách và tự lưu danh sách trong D1.
- Mỗi link mới mở trong đúng 40 ngày kể từ lúc tạo. Đổi tên không thay link hoặc gia hạn. Sau hết hạn, link đóng và thông tin vẫn giữ trong danh sách để tra cứu.
- Xem, sao chép link, tải lại danh sách, thu hồi, tìm khách và xuất CSV; tối đa 400 khách mỗi thiệp, nhập tối đa 200 tên mỗi lần.
- Mỗi link lưu một phiên bản riêng của mẫu, ảnh và thông tin thiệp khi tạo. Đổi thiệp chung chỉ áp dụng cho link tạo sau đó. Trong phần sửa khách có thể đổi mẫu/khổ thiệp riêng hoặc chủ động dùng mẫu và ảnh chung hiện tại; giữ nguyên token và hạn dùng.
- Xuất PNG cho từng khách từ danh sách: xem trước ảnh đầy đủ, kèm khối QR chỉ đường và địa chỉ của đúng khách, rồi tải ảnh. Xử lý ảnh trong trình duyệt, không gửi nội dung thiệp đến dịch vụ bên ngoài.
- Migration `0007` lưu lại phiên bản hiện có cho các link cũ. Không có lịch sử mẫu trước khi cập nhật để khôi phục; các chỉnh sửa riêng đã lưu của khách được giữ nguyên.
- Chống tạo trùng khi thử lại cùng yêu cầu bị lỗi mạng.

## Chạy local
Node >=22.13, pnpm 11.25.0. Cài dependencies bằng `pnpm install --frozen-lockfile`. Sao chép `.dev.vars.example` thành `.dev.vars` và đặt ADMIN_PASSWORD ngẫu nhiên từ 16 ký tự. Chạy `pnpm run db:local`, `pnpm run dev`, mở /login.

## Deploy
Đọc [DEPLOY_GUIDE_VI.md](DEPLOY_GUIDE_VI.md). Worker: thiep-cuoi; database: thiep-cuoi-db. Session quản trị có hiệu lực 7 ngày, lưu token đã băm trong D1; HttpOnly, SameSite=Lax và Secure trên HTTPS. Đổi ADMIN_PASSWORD vô hiệu hóa phiên cũ. Có giới hạn 5 lần thử đăng nhập mỗi 15 phút theo IP.

Source không chứa mật khẩu thật hoặc dữ liệu khách. Không push .dev.vars, .wrangler, node_modules hay dist. original-sites/ trong repo là bản tham khảo và không thuộc build chính. Chưa có RSVP, thanh toán hoặc quản lý nhiều tài khoản.

## Kiểm tra
`pnpm run check`, `pnpm run test`, `pnpm run build`. Xem VALIDATION.md để biết kiểm tra và giới hạn thực tế.
