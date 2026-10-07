# HƯỚNG DẪN QUẢN TRỊ & DEPLOY THIỆP CƯỚI LÊN VERCEL

Dự án thiệp cưới online đã được nâng cấp toàn diện:
1. **Ngày tháng chuyển xuống dưới "SAVE OUR DATE"** theo đúng hình bạn yêu cầu.
2. **Tối ưu chuẩn Mobile-First 100%**:
   - Thêm **Màn hình mở phong bì (Envelope Intro)** sang trọng: Khách bấm "Mở Thiệp" là nhạc tự động phát du dương (giải quyết triệt để lỗi iOS/Android chặn tự phát nhạc).
   - Menu trên điện thoại chuyển thành **Thanh Dock kính mờ ở đáy màn hình**, vừa vặn ngón tay cái khi cầm 1 tay, bỏ hoàn toàn thanh menu bị dài và icon loa trùng lặp.
3. **Bảng Quản Trị Admin Trực Quan (Dành cho người không biết lập trình)**:
   - **Tài khoản**: `admin`
   - **Mật khẩu**: `hihihaha`
   - Bấm vào nút **"Quản trị viên (Admin)"** ở chân trang (Footer) để mở.
   - Có thể sửa tên cô dâu chú rể, ngày giờ, địa chỉ, đổi link nhạc và **thêm / sửa / xóa ảnh trực tiếp từ điện thoại hoặc máy tính**.
   - Có nút **"Lưu thay đổi"** xem ngay lập tức và nút **"Tải file weddingData.js"** để cập nhật dự án khi deploy lên Vercel.

---

## 1. CÁCH DÙNG BẢNG QUẢN TRỊ ADMIN (KHÔNG CẦN BIẾT CODE)

1. Mở trang web thiệp cưới.
2. Cuộn xuống cuối cùng ở phần chân trang (Footer), bấm vào nút **"Quản trị viên (Admin)"** có biểu tượng chiếc chìa khóa vàng.
3. Nhập:
   - **Tài khoản**: `admin`
   - **Mật khẩu**: `hihihaha`
4. Trong bảng quản trị:
   - **Tab Cặp Đôi**: Thay đổi tên cô dâu, chú rể, lời tự sự, thông điệp tình yêu.
   - **Tab 2 Ngày Tiệc**: Chỉnh sửa giờ tiệc, ngày dương, ngày âm, địa điểm, link Google Maps của Lễ Vu Quy và Lễ Thành Hôn.
   - **Tab Album Ảnh**: 
     - Bấm **"Chọn file ảnh để tải lên"** để chọn ảnh từ điện thoại hoặc máy tính thêm vào album.
     - Sửa chú thích ảnh trực tiếp.
     - Bấm biểu tượng thùng rác màu đỏ để xóa ảnh không thích.
   - **Tab Nhạc & Lời Chúc**: Đổi bài hát nền, sửa lời cảm ơn.
5. Sau khi sửa xong:
   - Bấm **"Lưu Thay Đổi"**: Toàn bộ trang web trên máy bạn sẽ cập nhật ngay lập tức!
   - Bấm **"Tải file weddingData.js"**: Trình duyệt sẽ tải về file `weddingData.js`. Bạn chỉ cần chép đè file này vào thư mục `src/config/weddingData.js` trong dự án là mã nguồn sẽ được cập nhật vĩnh viễn cho tất cả mọi người khi đẩy lên Vercel!

---

## 2. CÁCH CHẠY THỬ TRÊN MÁY TÍNH (LOCAL)

**Cách nhanh:** nhấp đúp file `CHAY_THIEP_CUOI.bat` trong thư mục dự án. File tự cài thư viện nếu chưa có và mở thiệp trong trình duyệt. Máy cần cài Node.js.

Giữ cửa sổ chạy mở trong lúc xem thiệp. Để dừng, nhấn **Ctrl+C** hoặc đóng cửa sổ. Nếu cổng 3000 đang được dùng, chương trình tự chọn cổng còn trống và mở đúng địa chỉ.

**Cách chạy bằng lệnh:**

Mở PowerShell / Command Prompt tại thư mục dự án và chạy:

```bash
# Khởi chạy môi trường phát triển
cmd /c npm run dev
```

Sau đó mở trình duyệt truy cập: `http://localhost:3000`

---

## 3. CÁCH DEPLOY LÊN VERCEL (HOÀN TOÀN MIỄN PHÍ)

### Cách 1: Đẩy lên GitHub rồi kết nối Vercel (Khuyên dùng)
1. Đẩy toàn bộ mã nguồn của thư mục này lên một repository mới trên GitHub cá nhân của bạn.
2. Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
3. Nhấn nút **"Add New..."** -> Chọn **"Project"**.
4. Tìm và chọn repository bạn vừa đẩy lên GitHub, nhấn **"Import"**.
5. Nhấn nút **"Deploy"**.
6. Sau khoảng 30 giây, Vercel sẽ cấp cho bạn một đường link miễn phí (ví dụ: `damcuoi-ducanh-thuyen.vercel.app`) có HTTPS bảo mật, sẵn sàng gửi cho bạn bè!

### Cách 2: Deploy trực tiếp bằng Vercel CLI
1. Cài đặt Vercel CLI:
   ```bash
   cmd /c npm i -g vercel
   ```
2. Đăng nhập Vercel:
   ```bash
   vercel login
   ```
3. Chạy lệnh deploy:
   ```bash
   vercel --prod
   ```
4. Chọn các thiết lập mặc định (Enter liên tục). Vercel sẽ build và cung cấp link công khai ngay lập tức.
