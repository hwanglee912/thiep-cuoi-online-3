# Rà soát thiệp cưới, ngày 07/10/2026

Đã áp dụng bố cục của `mẫu.html`: ảnh bìa toàn khung, tên đôi uyên ương trên ảnh; chú rể ở cột trái với ảnh thấp hơn, cô dâu ở cột phải với ảnh cao hơn. Ảnh và chữ xuất hiện từ trái, phải hoặc phía dưới khi cuộn. Bố cục dùng Grid và kích thước linh hoạt để không chồng chữ hoặc ảnh khi màn hình nhỏ hay tên dài.

Các lỗi đã sửa:

- Component giới thiệu cặp đôi chưa được hiển thị trong trang.
- Nền giấy bị dùng nhầm làm ảnh bìa, ảnh đại diện và ảnh album. Đã dùng lại ảnh cưới có sẵn, đồng thời chuyển các đường dẫn mặc định cũ trong dữ liệu lưu sang đúng ảnh.
- Animation toàn section tạo ảnh hưởng đến các phần tử cố định. Đã chuyển sang từng ảnh, dòng chữ và khối nội dung, có cleanup và hỗ trợ giảm chuyển động.
- Phong bì bị gỡ khỏi trang ngay khi bấm nên mất hiệu ứng đóng/mở. Hiện đợi chuyển động kết thúc và khóa cuộn khi hộp thoại mở.
- Thanh điều hướng che phần lời mời trên điện thoại. Điều hướng chính chuyển xuống thanh dưới, có khoảng an toàn cho iPhone, nút nhạc và vùng chạm tối thiểu 44 px.
- Ngày 26/11/2026 bị ghi là Chủ nhật. Thứ trong tuần được tính tự động; sửa ngày hoặc giờ trong quản trị đồng bộ ảnh bìa, lịch, đếm ngược và file lịch tải xuống.
- Lịch cố định tháng 11 được thay bằng lịch theo dữ liệu sự kiện. Google Calendar và ICS dùng đúng giờ Việt Nam.
- Cửa sổ xem ảnh hỗ trợ vuốt, phím mũi tên, Escape, giữ focus và trả lại trạng thái cuộn khi đóng.
- Sao chép địa chỉ và lời chúc chỉ báo thành công khi clipboard hoạt động. Lưu dữ liệu có xử lý lỗi bộ nhớ.

Tối ưu tải trang: font được phục vụ từ dự án, hai font viết tay giảm từ khoảng 898 kB TTF xuống 74.6 kB WOFF2; ảnh bìa và font chính được tải ưu tiên; nội dung thiệp, confetti và quản trị tải khi cần. Ảnh dưới trang tải lười, hiệu ứng cánh hoa và bộ đếm dừng khi tab bị ẩn. Phần lời nhắn dài có thể mở rộng để trang dễ đọc hơn.

Kiểm tra đã đạt:

- Build production bằng `npm run build`.
- 4 kiểm tra logic ngày giờ, ngày không hợp lệ, múi giờ và định dạng ICS.
- Chromium tại 320×568, 360×800, 375×667, 390×844, 430×932, 768×1024, 1440×900 và 812×375: không tràn ngang hay cắt nội dung; ảnh xếp lệch, tên/ngày hiển thị và cửa sổ album hoạt động.
- Animation, giảm chuyển động, vuốt ảnh, focus, điều hướng, chuyển dữ liệu cũ, sửa ngày trong quản trị, clipboard bị chặn và bộ nhớ đầy.
- Axe trên trang sau khi mở thiệp: không có vi phạm trong 27 quy tắc được kiểm tra.
- Lighthouse trên bản production, mô phỏng điện thoại: hiệu năng **91/100**, khả năng truy cập **100/100**, best practices **100/100**; FCP **2.3 giây**, LCP **3.2 giây**, TBT **0 ms**, CLS **0**. Đây là số đo trong môi trường kiểm tra, chưa phải đo trên iPhone vật lý.

RSVP hiện lưu lời chúc và xác nhận trong trình duyệt. Giao diện hướng dẫn khách sao chép để gửi qua Zalo; dự án chưa có máy chủ nhận lời chúc.

Code trước thay đổi đã được lưu trong `.codex-backups/before-mobile-layout`. Báo cáo Lighthouse, kết quả Axe và ảnh chụp nằm cùng thư mục này.

## Cập nhật album và lịch theo ảnh tham khảo

Album đổi sang một ảnh lớn có nút trước/sau, vuốt ngang, điều khiển bằng phím mũi tên và dải ảnh nhỏ bên dưới. Ảnh thu nhỏ đang chọn luôn được đưa vào vùng nhìn thấy bằng cách cuộn riêng dải ảnh, không cuộn cả trang. Chế độ phóng to và album dùng chung lựa chọn; đóng cửa sổ vẫn giữ ảnh đang xem. Vuốt dọc không đổi ảnh; click phát sinh sau thao tác vuốt không tự mở cửa sổ. Album rỗng có thông báo, album một ảnh không hiển thị nút chuyển dư thừa.

Lịch dùng ảnh `/assets/sf-img-9.webp` làm nền, lớp phủ tối, chữ trắng, tiêu đề viết tay và trái tim đánh dấu ngày cưới. Tháng, năm, thứ và ngày cưới vẫn lấy từ dữ liệu sự kiện (26/11/2026 mặc định). Nền ảnh thu nhẹ khi xuất hiện, ảnh album chuyển nhẹ; chế độ giảm chuyển động tắt các hiệu ứng này. Không tự động chạy album. Chỉ tải trước hai ảnh lân cận khi album đến gần màn hình.

Đã build lại, chạy 4 kiểm tra ngày giờ, 8 kích thước màn hình và kiểm tra riêng thao tác album trên 390/1440px, album rỗng và một ảnh. Axe trên bản production không có vi phạm. Ảnh chụp mới: `album-390.png`, `album-desktop.png`, `calendar-390.png`. Số đo Lighthouse ở trên là của lần tối ưu trước cập nhật album/lịch, chưa đo lại cho cập nhật này.

Bản sao trước cập nhật album/lịch: `.codex-backups/before-album-calendar`. Nhấp đúp `CHAY_THIEP_CUOI.bat` tại thư mục dự án để chạy trang.
