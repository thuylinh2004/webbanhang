# Theme Toggle Implementation

## 1. Hàm updateToggleButtons
```javascript
function updateToggleButtons() {
    const buttons = [
      document.getElementById('themeToggle'), // Nút trên màn hình lớn
      document.getElementById('themeToggleOffcanvas') // Nút trong Offcanvas
    ];
    const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
  
    buttons.forEach(button => {
      if (button) {
        button.innerHTML = isDark
          ? '<i class="fas fa-sun me-2"></i> <span>Light Mode</span>'
          : '<i class="fas fa-moon me-2"></i> <span>Dark Mode</span>';
      }
    });
}
```
### Phân tích:
- `const buttons = [document.getElementById('themeToggle'), document.getElementById('themeToggleOffcanvas')];`
  - Tạo một mảng `buttons` chứa các phần tử DOM được lấy bằng `document.getElementById`:
    - `#themeToggle`: Nút chuyển đổi chủ đề trên màn hình lớn (trong header của index.html).
    - `#themeToggleOffcanvas`: Nút chuyển đổi chủ đề trong offcanvas (menu nhỏ trên màn hình di động).
  - `document.getElementById` truy cập các phần tử dựa trên id trong DOM.
  - **Mục đích**: Thu thập các nút chuyển đổi chủ đề để đồng bộ hóa giao diện.
- `const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';`
  - `document.documentElement` đại diện cho thẻ `<html>` (nút gốc của DOM).
  - `getAttribute('data-bs-theme')` lấy giá trị thuộc tính `data-bs-theme` của `<html>` (được dùng bởi Bootstrap để xác định chế độ sáng/tối).
  - So sánh với `'dark'` để xác định trạng thái hiện tại (`true` nếu là chế độ tối, `false` nếu là chế độ sáng).
  - **Mục đích**: Xác định chế độ chủ đề hiện tại để cập nhật nội dung nút.
- `buttons.forEach(button => { ... });`
  - Lặp qua mỗi phần tử trong mảng `buttons`.
  - **Mục đích**: Đồng bộ hóa giao diện của cả hai nút.
- `if (button) { button.innerHTML = ... }`
  - Kiểm tra xem `button` có tồn tại không (tránh lỗi nếu một trong hai ID không tìm thấy).
  - `innerHTML` thay đổi nội dung HTML của nút.
  - **Mục đích**: Cập nhật biểu tượng và văn bản của nút dựa trên trạng thái `isDark`.
- `isDark ? '<i class="fas fa-sun me-2"></i> <span>Light Mode</span>' : '<i class="fas fa-moon me-2"></i> <span>Dark Mode</span>';`
  - Nếu `isDark` là `true` (chế độ tối):
    - Thay đổi thành biểu tượng mặt trời (`fa-sun`) và văn bản "Light Mode" để chuyển sang chế độ sáng.
  - Nếu `isDark` là `false` (chế độ sáng):
    - Thay đổi thành biểu tượng mặt trăng (`fa-moon`) và văn bản "Dark Mode" để chuyển sang chế độ tối.
  - `me-2` là class Bootstrap để thêm margin-end (khoảng cách bên phải).
  - **Mục đích**: Hiển thị giao diện phù hợp với chế độ hiện tại.
### Điểm cần lưu ý:
- Nếu một trong hai ID (`themeToggle` hoặc `themeToggleOffcanvas`) không tồn tại trong DOM, `button` sẽ là `null`, nhưng nhờ `if (button)`, code không bị lỗi.
- Sử dụng `innerHTML` để thay đổi nội dung có thể gây rủi ro bảo mật nếu nội dung được tạo từ dữ liệu người dùng (ở đây an toàn vì là chuỗi tĩnh).
- Nên kiểm tra thêm trạng thái Bootstrap (`data-bs-theme`) để đảm bảo không bị lỗi khi thuộc tính không được đặt.

## 2. Hàm toggleTheme
```javascript
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleButtons();
}
```
### Phân tích:
- `const currentTheme = document.documentElement.getAttribute('data-bs-theme');`
  - Lấy giá trị hiện tại của thuộc tính `data-bs-theme` trên thẻ `<html>` (giá trị ban đầu có thể là `'dark'`, `'light'`, hoặc `null`).
  - **Mục đích**: Xác định chế độ chủ đề hiện tại.
- `const newTheme = currentTheme === 'dark' ? 'light' : 'dark';`
  - Sử dụng toán tử ba ngôi để chuyển đổi:
    - Nếu `currentTheme` là `'dark'`, đặt `newTheme` là `'light'`.
    - Nếu `currentTheme` không phải `'dark'` (bao gồm `'light'` hoặc `null`), đặt `newTheme` là `'dark'`.
  - **Mục đích**: Chuyển đổi giữa hai chế độ sáng và tối.
- `document.documentElement.setAttribute('data-bs-theme', newTheme);`
  - Đặt thuộc tính `data-bs-theme` của `<html>` thành `newTheme`.
  - **Mục đích**: Cập nhật chế độ chủ đề cho toàn bộ trang (Bootstrap sẽ tự áp dụng style tương ứng).
- `localStorage.setItem('theme', newTheme);`
  - Lưu `newTheme` vào `localStorage` với key `'theme'`.
  - **Mục đích**: Lưu trạng thái chủ đề để khôi phục khi tải lại trang.
- `updateToggleButtons();`
  - Gọi `updateToggleButtons` để cập nhật giao diện của các nút chuyển đổi.
  - **Mục đích**: Đảm bảo nút hiển thị đúng biểu tượng và văn bản sau khi thay đổi chủ đề.
### Điểm cần lưu ý:
- Nếu `currentTheme` là `null` (chưa được đặt), code mặc định chuyển sang `'dark'`, có thể không phải ý định ban đầu. Nên thêm kiểm tra:
```javascript
const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
```
- `localStorage.setItem` ghi đè giá trị cũ, không kiểm tra trùng lặp, điều này là đúng trong trường hợp này.

## 3. Khởi tạo trạng thái ban đầu (Sự kiện DOMContentLoaded)
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    updateToggleButtons();
});
```
### Phân tích:
- `document.addEventListener('DOMContentLoaded', () => { ... });`
  - Gắn sự kiện `DOMContentLoaded`, được kích hoạt khi DOM hoàn tất việc tải (tất cả HTML đã được phân tích, nhưng tài nguyên như hình ảnh có thể chưa tải xong).
  - **Mục đích**: Đảm bảo code chạy sau khi DOM sẵn sàng để thao tác.
- `const savedTheme = localStorage.getItem('theme') || 'light';`
  - `localStorage.getItem('theme')`: Lấy giá trị chủ đề đã lưu từ `localStorage`.
  - `|| 'light'`: Nếu không có giá trị (lần đầu tiên hoặc bị xóa), mặc định là `'light'`.
  - **Mục đích**: Khôi phục hoặc đặt chế độ ban đầu.
- `document.documentElement.setAttribute('data-bs-theme', savedTheme);`
  - Đặt thuộc tính `data-bs-theme` của `<html>` thành `savedTheme`.
  - **Mục đích**: Áp dụng chế độ chủ đề được lưu khi trang tải.
- `updateToggleButtons();`
  - Gọi `updateToggleButtons` để cập nhật giao diện của các nút dựa trên `savedTheme`.
  - **Mục đích**: Đảm bảo nút hiển thị đúng trạng thái ban đầu.
### Điểm cần lưu ý:
- Nếu `localStorage` bị vô hiệu hóa (trong chế độ ẩn danh), `savedTheme` sẽ luôn là `'light'`, điều này là hợp lý.
- Nên kiểm tra tính hợp lệ của `savedTheme` (chỉ chấp nhận `'light'` hoặc `'dark'`):
```javascript
const savedTheme = ['light', 'dark'].includes(localStorage.getItem('theme')) ? localStorage.getItem('theme') : 'light';
```

## Tổng quan cách hoạt động
- **Khởi tạo**: Khi trang tải (`DOMContentLoaded`), code lấy chủ đề từ `localStorage` (mặc định `'light'`) và áp dụng nó cho `<html>` bằng `data-bs-theme`. Sau đó, `updateToggleButtons` cập nhật giao diện nút.
- **Chuyển đổi**: Khi người dùng nhấn nút (gọi `toggleTheme`), code chuyển đổi giữa `'light'` và `'dark'`, lưu vào `localStorage`, và cập nhật nút bằng `updateToggleButtons`.
- **Đồng bộ**: Cả hai nút (`#themeToggle` và `#themeToggleOffcanvas`) luôn hiển thị biểu tượng và văn bản phù hợp với chế độ hiện tại.

## Sự liên kết với DOM
- `document.getElementById`: Truy cập các phần tử như `#themeToggle`, `#themeToggleOffcanvas`.
- `document.documentElement`: Thao tác với thẻ `<html>` để thay đổi chủ đề toàn cục.
- `innerHTML`: Cập nhật nội dung nút.
- `addEventListener`: Kích hoạt logic khi DOM sẵn sàng.

## Điểm cần cải thiện
### Xử lý lỗi:
- Thêm kiểm tra `savedTheme` để tránh giá trị không mong muốn.
- Xử lý trường hợp `localStorage` không hoạt động.
### Hiệu suất:
- Nếu có nhiều nút, nên lưu mảng `buttons` trong một biến toàn cục để tránh tìm kiếm DOM nhiều lần.
### Tương thích:
- Đảm bảo Font Awesome (`fas fa-sun`, `fas fa-moon`) được nạp từ CDN trong `index.html`.

## Kết luận
Đoạn mã này triển khai một hệ thống chuyển đổi chủ đề sáng/tối đơn giản, sử dụng DOM để thao tác giao diện và `localStorage` để lưu trạng thái. Nó hoạt động tốt với Bootstrap và có thể mở rộng bằng cách thêm các kiểm tra hoặc hiệu ứng bổ sung.