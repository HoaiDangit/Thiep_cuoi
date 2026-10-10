# Lời Hẹn — thiết kế ứng dụng thiệp cưới online

## Ý tưởng
Web app tiếng Việt dùng chung một địa chỉ trên trình duyệt Android, iOS/iPadOS, macOS và Windows. Người tạo thiệp đăng nhập; khách mời mở link trực tiếp. Phong cách thanh lịch, xanh rừng với nền giấy sáng và typography serif. Nội dung chính xuất hiện ngay ở thư viện mẫu.

## Luồng chính
1. Chọn một trong 6 mẫu, lọc theo phong cách, xem trước.
2. Nhập tên cô dâu/chú rể, ngày giờ, địa điểm, địa chỉ, lời nhắn. Lưu theo tài khoản.
3. Nhập khách hàng loạt, mỗi dòng một tên. Chọn ngày hết hạn và tạo link riêng cho mỗi khách.
4. Sao chép link để gửi qua ứng dụng nhắn tin. Có thể đổi tên hoặc thời hạn mà giữ nguyên link, hoặc thu hồi link.
5. Khách mở thiệp cá nhân hóa, xem thông tin và mở bản đồ đến tiệc cưới.

## Quy tắc
- Mỗi tài khoản quản lý một thiệp cưới trong bản đầu.
- Nội dung thiệp cập nhật trên các link đã tạo sau khi lưu.
- Thời gian tổ chức và ngày hết hạn theo giờ Việt Nam.
- Ngày hết hạn mặc định chỉ áp dụng cho link mới; từng khách có thời hạn riêng.
- Máy chủ kiểm tra hết hạn/thu hồi trước khi trả nội dung thiệp. Trang thiệp không cache, không đưa vào chỉ mục tìm kiếm.
- Người có link có thể xem thiệp; tên khách không phải cơ chế xác minh danh tính.
- Danh sách khách chỉ được truy xuất/chỉnh sửa bởi tài khoản sở hữu thiệp.
- Thu hồi không thể khôi phục trong bản đầu; tạo một link mới nếu cần.
- Các mẫu ảnh dùng ảnh minh họa; chưa hỗ trợ tải ảnh cá nhân.
- Bản đầu đăng nhập với ChatGPT, không phải hệ thống tài khoản email/điện thoại riêng.
- Giao diện web responsive; chưa đóng gói ứng dụng lên App Store/Google Play.

## Kiến trúc
UI React responsive, Worker xử lý các API, D1 lưu weddings và guests. Trường owner unique đảm bảo tách dữ liệu mỗi tài khoản. Token link sinh ngẫu nhiên từ hai UUID. Các truy vấn prepared và thao tác theo owner được kiểm tra ở máy chủ. Dữ liệu thật không phụ thuộc bộ nhớ của trình duyệt; sessionStorage chỉ giữ bản nháp tạm trước khi lưu.

## Phạm vi mở rộng đề xuất
Ảnh cá nhân, xác nhận tham dự RSVP và ứng dụng PWA cài từ trình duyệt là các bước tiếp theo, chưa đưa vào phạm vi bản đầu.

## Kiểm tra
Kiểm tra TypeScript và build hoàn tất. Kiểm tra luồng browser/WebMCP chưa thực hiện do môi trường xem trước không truy cập được. Cần kiểm thử trực tiếp Chrome Android, Safari iOS và trình duyệt máy tính trước khi đưa vào khai thác thương mại.
