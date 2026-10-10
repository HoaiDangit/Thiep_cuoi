# Hướng dẫn đưa Lời Hẹn lên Cloudflare và đồng bộ GitHub

## 1. Chuẩn bị

Cần tài khoản GitHub, Cloudflare và Supabase. Cài Git và Node.js 24 trên máy tính, rồi cài pnpm:

```sh
npm install -g pnpm@11.25.0
```

Nếu dùng gói source ZIP, mở terminal trong thư mục **cloudflare-app**. Nếu clone repository **HoaiDangit/Thiep_cuoi**, mở terminal tại gốc repository (nơi có `package.json` và `wrangler.jsonc`). Các lệnh bên dưới chạy tại thư mục ứng dụng đó.

```sh
pnpm install --frozen-lockfile
```

Gói này đã có toàn bộ source cần thiết. `node_modules` không đóng gói vì được tạo từ lockfile trên máy của anh.

## 2. Tạo database D1

```sh
pnpm exec wrangler login
pnpm exec wrangler d1 create loi-hen-db
```

Sao chép `database_id` trong kết quả tạo database. Mở **wrangler.jsonc**, thay chuỗi `00000000-0000-4000-8000-000000000000` bằng ID thật. ID database và tên Worker không phải khóa bí mật, có thể lưu trong Git.

Tên Worker mặc định là `loi-hen`; có thể đổi trường `name` nếu tài khoản đã có Worker cùng tên.

## 3. Cấu hình Supabase Auth

Tạo một project Supabase. Lấy Project URL và **publishable key** (`sb_publishable_...`) trong phần Connect/API Keys. Chỉ dùng publishable key; ứng dụng không cần service-role hoặc secret key Supabase.

Trong Authentication, bật Email/password. Giữ xác nhận email nếu dùng chức năng đăng ký. Cấu hình Site URL trỏ về địa chỉ website thật sau lần deploy đầu; khi phát triển local dùng địa chỉ do `pnpm run dev` in ra.

SMTP mặc định của Supabase chỉ gửi cho các email thuộc nhóm dự án và không phù hợp để phục vụ đăng ký công khai. Cấu hình SMTP riêng khi cho người ngoài đăng ký. Để thử ngay, có thể tạo người dùng kiểm thử đã xác nhận trong dashboard Supabase.

Tạo file **.dev.vars** bằng cách sao chép `.dev.vars.example`, điền hai giá trị của dự án. Trên Windows PowerShell:

```powershell
Copy-Item .dev.vars.example .dev.vars
```

Trên macOS/Linux:

```sh
cp .dev.vars.example .dev.vars
```

File `.dev.vars` đã được gitignore. Không upload file này hoặc token Cloudflare vào GitHub.

## 4. Chạy thử trên máy

```sh
pnpm run db:local
pnpm run dev
```

Mở địa chỉ terminal in ra. Thử đăng nhập, lưu thiệp, thêm khách, mở link khách trong cửa sổ ẩn danh và thu hồi link. Database local khác với database thật, không làm thay đổi dữ liệu production.

Trước khi phát hành:

```sh
pnpm run check
pnpm run test
pnpm run build
```

## 5. Deploy lần đầu

```sh
pnpm run deploy
```

Lệnh này dừng nếu còn ID database mẫu, nếu kiểm tra thất bại, hoặc migration bị lỗi. Khi thành công Wrangler sẽ in địa chỉ `workers.dev` thật; dùng chính địa chỉ đó, không đoán subdomain.

Sau lần deploy đầu, cấu hình đăng nhập trên Worker:

```sh
pnpm exec wrangler secret put SUPABASE_URL --config dist/server/wrangler.json
pnpm exec wrangler secret put SUPABASE_PUBLISHABLE_KEY --config dist/server/wrangler.json
```

Mỗi lệnh hỏi giá trị để nhập. Không viết giá trị vào source hoặc URL. Đặt lại Site URL trong Supabase theo địa chỉ Worker vừa nhận. Kiểm tra tài khoản thật và các link khách mời trước khi chia sẻ.

Các lần deploy sau giữ nguyên secrets trên Worker. `.dev.vars` chỉ dùng local, không tự trở thành cấu hình production.

## 6. Đưa source lên GitHub

Tạo repository trong tài khoản GitHub, tên gợi ý **loi-hen**. Có thể chọn Private. Tạo repository rỗng để lần push đầu không phát sinh xung đột README.

Trong thư mục cloudflare-app:

```sh
git init
git branch -M main
git add .
git commit -m "Initial Loi Hen app"
git remote add origin https://github.com/YOUR_USERNAME/loi-hen.git
git push -u origin main
```

Thay `YOUR_USERNAME` bằng tên tài khoản thật. Đăng nhập Git qua trình duyệt hoặc credential manager khi được yêu cầu; không nhúng token vào địa chỉ repository.

Nếu muốn tôi tạo/push repository thay anh, cần kết nối GitHub với ChatGPT và xác định repository đích. Gói source tải về hoạt động độc lập với kết nối đó.

## 7. Bật tự cập nhật từ GitHub Actions

Trong repository vào **Settings → Secrets and variables → Actions**, thêm:

| Secret | Giá trị |
|---|---|
| CLOUDFLARE_ACCOUNT_ID | Account ID của tài khoản Cloudflare |
| CLOUDFLARE_API_TOKEN | API token được phép deploy Worker và áp dụng migration D1 |

Tạo token tại Cloudflare Account/Profile API Tokens. Dùng mẫu Edit Cloudflare Workers và bổ sung quyền Account → D1 → Edit cho đúng tài khoản nếu token chưa có quyền D1. Token chỉ cần tài khoản đang dùng, không cấp phạm vi rộng hơn cần thiết.

Workflow `.github/workflows/ci.yml` kiểm tra pull request và push `main`.
Workflow `.github/workflows/deploy.yml` deploy khi push `main`, hoặc khi chọn Run workflow trong tab Actions. Workflow dùng environment tên **production**; nếu anh đặt quy tắc approval cho environment này, deployment sẽ chờ approval theo quy tắc đó.

Workflow kiểm tra → build → migration D1 → deploy. Nếu một bước thất bại, website không được cập nhật bằng bản code lỗi. Migration đã áp dụng trước khi lỗi ở bước deploy vẫn nằm trong database; không sửa lại migration đã chạy.

Secrets Supabase đặt trên Cloudflare Worker theo bước 5, không cần để trong GitHub Actions. GitHub chỉ cần hai secrets Cloudflare để deploy.

## 8. Quy trình cập nhật thường ngày

Trước khi sửa code trên máy:

```sh
git pull --rebase origin main
```

Sau khi sửa:

```sh
pnpm run check
pnpm run test
pnpm run build
git add .
git commit -m "Update wedding templates"
git push origin main
```

Mở tab **Actions** để xem deployment thành công. Website được cập nhật sau khi workflow hoàn tất, không phải ngay khi bấm Save trong trình soạn thảo.

GitHub không tự sao chép mọi thay đổi chưa commit trên máy. `git push` gửi code lên; `git pull` lấy code mới về. Nếu dùng nhiều máy, pull trước khi làm việc trên mỗi máy.

Khi thay schema, cập nhật `db/schema.ts` rồi chạy `pnpm run db:generate`, kiểm tra SQL và commit cả `drizzle/` cùng code. Thử migration local trước. Với các lần cập nhật giao diện thông thường không cần tạo migration.

## 9. Dữ liệu, sao lưu và rollback

Mã nguồn và lịch sử Git không phải bản sao lưu database. Dữ liệu thiệp được giữ trong D1; mỗi deploy dùng cùng database_id để không tạo database mới ngoài ý muốn. Có thể export database qua Wrangler/Dashboard riêng khi cần sao lưu.

Bản đang chạy trên ChatGPT có database và định danh tài khoản khác. ZIP không chứa dữ liệu khách mời thật. Link trên domain cũ không tự chuyển sang domain mới. Chuyển dữ liệu cần export/import và ánh xạ owner từ ChatGPT sang ID tài khoản Supabase; không sửa owner tùy ý.

Có thể rollback code bằng revert commit rồi push lên `main`. Nếu migration đã thay schema, cần bảo đảm code cũ tương thích với schema hiện tại; rollback code không tự hoàn tác database.

## Tài liệu chính thức

- Cloudflare/Vinext: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- GitHub Actions cho Workers: https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
- D1 migrations: https://developers.cloudflare.com/d1/reference/migrations/
- Supabase email/password: https://supabase.com/docs/guides/auth/passwords
- Supabase API keys: https://supabase.com/docs/guides/getting-started/api-keys
- Supabase SMTP: https://supabase.com/docs/guides/auth/auth-smtp
