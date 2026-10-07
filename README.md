# Lời Hẹn — bản chạy độc lập

Ứng dụng thiệp cưới online tiếng Việt. React/Vinext + Cloudflare Workers + D1; đăng nhập email/mật khẩu qua Supabase Auth. Khách mở link thiệp công khai mà không cần tài khoản.

**Bắt đầu:** đọc `DEPLOY_GUIDE_VI.md`. Thư mục này là thư mục cần đưa lên repository GitHub.

## Nội dung
- `app/`: giao diện chọn mẫu, sửa thông tin, quản lý khách, trang thiệp và API.
- `lib/`: dữ liệu mẫu, kiểm tra quyền sở hữu, đăng nhập và tiện ích.
- `components/`, `hooks/`, `vendor/`: các thành phần UI và giấy phép đi kèm.
- `public/`: ảnh minh họa và favicon.
- `db/`, `drizzle/`: schema và lịch sử migration D1.
- `wrangler.jsonc`: cấu hình Cloudflare, cần thay `database_id` bằng ID thật.
- `.github/workflows/`: kiểm tra source và tự triển khai khi push lên `main`.
- `.dev.vars.example`: mẫu cấu hình đăng nhập local, không chứa khóa thật.
- `tests/`: kiểm tra các ranh giới bảo mật và phản hồi của lớp đăng nhập.

## Các lệnh chính
```sh
pnpm install --frozen-lockfile
pnpm run check
pnpm run test
pnpm run db:local
pnpm run dev
pnpm run build
pnpm run deploy
```
Node.js 24 và pnpm 11.25.0. Lệnh deploy kiểm tra TypeScript, chạy tests, build, áp dụng các migration chưa chạy trên D1 rồi triển khai Worker. Lệnh sẽ dừng nếu chưa cấu hình ID database thật.

## Đăng nhập
Không sử dụng header nhận diện của ChatGPT. Máy chủ xác nhận phiên với Supabase `/user`; access và refresh token lưu bằng cookie HttpOnly, SameSite=Lax, Secure trên HTTPS. Cookie access chỉ tồn tại trong thời hạn phiên; phiên được làm mới qua endpoint cùng origin. Không có mật khẩu, API token Cloudflare hoặc dữ liệu khách thật trong gói source.

Đăng ký email cần xác nhận theo thiết lập của dự án Supabase. Nếu bật CAPTCHA trong Supabase, cần bổ sung giao diện và chuyển token CAPTCHA trước khi bật; phiên bản này chưa có CAPTCHA. Khi mở đăng ký cho người dùng ngoài nhóm dự án, cần cấu hình SMTP riêng theo tài liệu Supabase. Chưa có giao diện quên mật khẩu; quản trị viên có thể quản lý tài khoản qua Supabase trong bản đầu.

## Kiểm tra và giới hạn
- TypeScript, build và 5 tests auth-core đã đạt.
- Cài đặt lockfile đã được kiểm tra ở chế độ frozen/offline với các phụ thuộc có sẵn.
- Migration D1 đã áp dụng được trên database local.
- Smoke test HTTP cho các trang và ranh giới quyền truy cập đã đạt; xem `VALIDATION.md`.
- Chưa kiểm tra đăng nhập với tài khoản Supabase thật, GitHub Actions trên repository thật hoặc triển khai lên Cloudflare của người dùng: cần cấu hình các tài khoản và quyền tương ứng.
- Chưa kiểm thử giao diện trên thiết bị thật.
- Giới hạn Free của Workers bao gồm thời gian CPU; cần đo trên tài khoản thật. Việc build thành công không đảm bảo mọi lưu lượng đều nằm trong hạn mức miễn phí.
- Dữ liệu hiện tại trên ChatGPT không nằm trong source. Bản mới tạo database và định danh tài khoản riêng; việc chuyển dữ liệu và link cũ cần một bước migration riêng.

## Phạm vi sản phẩm
6 mẫu, chỉnh thông tin lễ cưới, mỗi tài khoản một thiệp, tạo link riêng từng khách, đổi tên/thời hạn, thu hồi link, xuất CSV. Ảnh là minh họa. Chưa có tải ảnh cá nhân, RSVP, ứng dụng native hay thanh toán.
