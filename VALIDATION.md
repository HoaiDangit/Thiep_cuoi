# Kết quả kiểm tra bản xuất độc lập

## Cập nhật ảnh và khổ thiệp — 2026-10-09

- Thêm 8 mẫu hòa nền, tổng cộng 14 mẫu; hỗ trợ ngang/dọc, tan vào nền/phủ nền/khung ảnh, vị trí và độ hiện của ảnh.
- TypeScript và build: đạt; 7 tests auth/photo đạt.
- Migration bảng photos: áp dụng thành công trên D1 local, kèm snapshot/journal Drizzle.
- HTTP local: trang studio hiển thị đủ 14 mẫu và phần điều chỉnh ảnh; API thư viện/tải ảnh trả 401 khi chưa đăng nhập; ID ảnh sai hoặc không tồn tại trả 404.
- Dùng dữ liệu kiểm thử local: đọc lại PNG từ D1 đúng 68 bytes và Content-Type; link thiệp hiển thị tên khách, ảnh đã lưu, khổ ngang và kiểu tan vào nền. Đã xóa dữ liệu kiểm thử sau kiểm tra.
- Chưa có Supabase thật nên chưa thử tải ảnh và lưu thiệp qua phiên đăng nhập thật. Chưa có trình duyệt kết nối nên chưa kiểm tra tương tác, bố cục bằng ảnh chụp hoặc mobile thực tế. Chưa deploy production.

Ngày kiểm tra: 2026-10-07.

- TypeScript: đạt (`tsc --noEmit`).
- Build Vinext/Cloudflare Worker: đạt, tạo `dist/server/wrangler.json` và bundle Worker.
- Auth-core: 5 tests đạt (origin, cấu hình provider, truyền credentials, xử lý outage/throttle, phiên cookie).
- Frozen lockfile/offline: đạt với các dependencies đã cài sẵn trong môi trường kiểm tra.
- Migration D1: áp dụng thành công trên database local mới.
- Smoke test HTTP chạy trên Worker đã build: đạt cho trang studio, trang đăng nhập và link không tồn tại.
- API không đăng nhập: trả 401; header giả mạo nhận diện ChatGPT không cấp quyền.
- Đăng nhập từ origin khác: bị từ chối 403.
- Khi chưa có Supabase config: trả thông báo cấu hình rõ ràng và HTTP 503.
- Trang thiệp: có Cache-Control no-store.

Chưa kiểm tra với Supabase thật, tài khoản Cloudflare thật, GitHub Actions thật hoặc thiết bị Android/iOS thật. Cần hoàn thành cấu hình tài khoản và kiểm tra luồng lưu thiệp → tạo link → mở thiệp → hết hạn/thu hồi trước khi đưa vào sử dụng chính thức.
