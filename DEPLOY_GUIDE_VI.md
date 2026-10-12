# Triển khai Thiep_cuoi lên Cloudflare

Repository: https://github.com/HoaiDangit/Thiep_cuoi. Khi clone repo, chạy các lệnh tại gốc có package.json; trong gói source local, chạy ở cloudflare-app/.

## Thiết lập
1. Cài Node 24 và pnpm 11.25.0, chạy `pnpm install --frozen-lockfile`.
2. Wrangler dùng account_id, Worker thiep-cuoi và D1 thiep-cuoi-db được khai báo trong wrangler.jsonc. Không thay database_id bằng ID của dự án khác.
3. Đăng nhập Cloudflare bằng `pnpm exec wrangler login` nếu máy chưa có phiên. Chạy `pnpm run check`, `pnpm run test`, `pnpm run build`.
4. Áp dụng migrations: `pnpm run db:remote`.
5. Deploy: `pnpm exec wrangler deploy --config dist/server/wrangler.json`.
6. Đặt mật khẩu quản trị ngẫu nhiên ít nhất 16 ký tự bằng `pnpm exec wrangler secret put ADMIN_PASSWORD --config dist/server/wrangler.json`. Nhập trong prompt, không đưa vào source hay GitHub. Secret vẫn được giữ trong các lần deploy sau.
7. Mở URL Wrangler in ra, vào /login; lưu thiệp, tạo khách và mở link trong cửa sổ riêng. Link khách có thời hạn 40 ngày kể từ lúc tạo.

## Tự động deploy từ GitHub Actions
Repo có .github/workflows/ci.yml và deploy.yml. Để bật deploy khi push main, tạo Cloudflare API token riêng chỉ cho tài khoản này với Workers Scripts Edit và D1 Edit. Thêm repo secrets CLOUDFLARE_API_TOKEN và CLOUDFLARE_ACCOUNT_ID. Không dùng OAuth token tạm thời của Wrangler làm secret GitHub.

Workflow dùng environment production: nếu có approval rule, cần phê duyệt deployment trong GitHub. Lệnh pnpm run deploy thực hiện check → test → build → migration D1 → deploy. Khi chưa có hai repo secrets, workflow deploy sẽ bỏ qua; CI vẫn chạy.

Có thể thay GitHub Actions bằng Cloudflare Workers Builds: Worker → Settings → Builds → Connect GitHub, chọn HoaiDangit/Thiep_cuoi và main. Build command: pnpm run check && pnpm run test && pnpm run build. Deploy command: pnpm run db:remote && pnpm exec wrangler deploy --config dist/server/wrangler.json. Cấp build token có D1 Edit. Chỉ bật một cơ chế auto deploy để tránh chạy trùng.

## Dữ liệu
Migrations chỉ thay schema; source GitHub không chứa dữ liệu production. D1 lưu weddings, guests, photos, admin_sessions và admin_login_attempts. Lưu danh sách khách trong database giúp tải lại, đổi thiết bị vẫn thấy cùng link. Sau 40 ngày link ngừng mở; không tự xóa bản ghi. Worker thiep-hy và database thiep-hy-db là dự án riêng.

Ảnh có URL ngẫu nhiên để khách mở thiệp xem được; chỉ quản trị mới liệt kê hoặc tải ảnh lên. Không cần R2 hoặc Supabase. Có thể export D1 qua Cloudflare Dashboard để sao lưu.
