# Kết quả kiểm tra bản xuất độc lập

## Link 40 ngày và quản trị D1 — 2026-10-12

- Đã deploy Worker HTTPS thật; kiểm tra toàn bộ luồng, kể cả chặn phiên sau đăng xuất, đạt. Dữ liệu giả đã được dọn và xác nhận database production sạch. Xem DEPLOYMENT.md. Trình giả lập local có lúc trì hoãn truy cập cookie đã thu hồi; lỗi này không lặp lại trên website HTTPS thật.

- TypeScript và 10 unit tests đạt. Thời hạn link mới được máy chủ tính bằng thời điểm tạo + 40 × 24 giờ; sửa tên không gia hạn link.
- Worker local đã chạy luồng đăng nhập quản trị → tải ảnh → lưu thiệp → tạo hai khách → thử lại cùng requestId không tạo trùng → tải lại danh sách từ D1 → mở trang thiệp cá nhân hóa → sửa tên → thu hồi → đăng xuất.
- Phiên quản trị lưu token băm trong D1, có hạn 7 ngày. API đăng ký bị đóng. Các chức năng quản trị không phụ thuộc Supabase.
- D1 thiep-cuoi-db riêng đã tạo tại APAC. Có migration bảng admin_sessions và admin_login_attempts; cấu hình database thật trong wrangler.jsonc.
- Repo hiện chưa có secrets CLOUDFLARE_API_TOKEN và CLOUDFLARE_ACCOUNT_ID. Tự động deploy từ GitHub Actions chỉ được bật sau khi cung cấp hai secrets; Cloudflare Builds API hiện từ chối quyền truy cập 403.
- Chưa có trình duyệt kết nối để kiểm tra bố cục trực quan trên desktop/mobile.

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
