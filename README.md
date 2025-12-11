📦 Ứng Dụng Giải Bài Toán Cái Ba Lô bằng Các Giải Thuật Tối Ưu Hóa

Ứng dụng desktop mô phỏng và giải bài toán cái ba lô (Knapsack Problem) sử dụng ba thuật toán tối ưu hóa phổ biến: Tham lam (Greedy), Nhánh cận (Branch and Bound) và Quy hoạch động (Dynamic Programming).
Giao diện được xây dựng bằng HTML/CSS/JavaScript và chạy dưới dạng ứng dụng desktop thông qua Electron.

Ứng dụng hỗ trợ nhập dữ liệu đa dạng, trực quan hóa quá trình xử lý và so sánh kết quả của các thuật toán.

🚀 Tính năng chính
🔹 1. Nhập dữ liệu linh hoạt

Nhập thủ công trực tiếp trên giao diện

Nhập từ file .txt hoặc .csv

Sinh dữ liệu tự động theo số lượng vật phẩm

Reset dữ liệu về trạng thái ban đầu

🔹 2. Giải bài toán cái ba lô theo ba biến thể

Balo 1 (Unbounded Knapsack) – có thể lấy nhiều lần

Balo 2 (Bounded Knapsack) – mỗi vật có số lượng nhất định

Balo 3 (0/1 Knapsack) – mỗi vật chỉ lấy tối đa 1 lần

🔹 3. Ba thuật toán tối ưu hóa được triển khai

Greedy Algorithm – tốc độ nhanh, phù hợp balo phân số

Dynamic Programming – cho kết quả tối ưu

Branch and Bound – giảm không gian tìm kiếm, hiệu suất tốt

🔹 4. Trực quan hóa và so sánh kết quả

Hiển thị bảng vật phẩm sau khi sắp xếp

Hiển thị phương án tối ưu và giá trị cuối cùng

So sánh kết quả của 3 thuật toán trên cùng một dữ liệu

Xuất kết quả ra file CSV

🛠️ Công nghệ sử dụng

Electron – xây dựng ứng dụng desktop

HTML/CSS – xây dựng giao diện

JavaScript – xử lý logic và thuật toán

QuickSort – hỗ trợ sắp xếp đồ vật theo đơn giá

📁 Cấu trúc thư mục (gợi ý)
/
├── index.html
├── input.html
├── greedy.html
├── dp.html
├── branch.html
├── js/
│   ├── input.js
│   ├── greedy.js
│   ├── dp.js
│   ├── branch.js
│   ├── sort.js
│   └── util.js
├── assets/
│   ├── css/
│   └── images/
└── README.md

⚙️ Cách chạy ứng dụng
1️⃣ Cài đặt dependencies
npm install

2️⃣ Chạy ứng dụng
npm start


Ứng dụng sẽ mở dưới dạng cửa sổ desktop của Electron.

📌 Hướng dẫn sử dụng

Mở ứng dụng → chọn loại bài toán (Balo 1, Balo 2, Balo 3)

Nhập dữ liệu bằng một trong các cách:

Nhập thủ công

Đọc file .txt / .csv

Sinh tự động

Chọn thuật toán muốn chạy

Nhấn Giải bài toán

Xem bảng kết quả và đường đi thuật toán

Xuất file CSV nếu cần

📊 Mô tả thuật toán (tóm tắt)
✔ Greedy Algorithm

Chọn vật phẩm theo đơn giá giảm dần

Tốc độ nhanh

Không đảm bảo tối ưu cho mọi trường hợp

✔ Dynamic Programming

Dùng bảng 2D để lưu trạng thái

Đảm bảo kết quả tốt nhất

Chi phí bộ nhớ lớn với dữ liệu lớn

✔ Branch and Bound

Xây cây trạng thái

Áp dụng cắt tỉa để giảm số nhánh cần xét

Hiệu quả tốt với dữ liệu vừa và nhỏ

📸 Ảnh minh họa (gợi ý)

Thêm ảnh screenshot của giao diện vào repo và đặt tại đây:

![Giao diện chính](./assets/images/home.png)
![Kết quả Greedy](./assets/images/greedy-result.png)
![Kết quả DP](./assets/images/dp-result.png)

🌱 Hướng phát triển

Cải thiện giao diện người dùng (UI/UX)

Áp dụng thêm thuật toán nâng cao: Genetic Algorithm, Simulated Annealing,…

Tối ưu tốc độ xử lý với dữ liệu lớn

Triển khai đa nền tảng (macOS, Linux)

👤 Tác giả

Nguyễn Trương Nhật Anh
Kỹ thuật phần mềm – Trường CNTT&TT, Đại học Cần Thơ
