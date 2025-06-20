import { calculateAndSortByUnitPrice } from '../components/sort-items.js';
import { loadNavbar } from '../components/navbar.js';
import { exportSingleAlgoCSV } from '../components/file-reader.js';

document.addEventListener('DOMContentLoaded', () => {
  loadNavbar('greedy.html', {
    goHome: '../index.html',
    goInput: 'input.html',
    goGreedy: 'greedy.html',
    goDP: 'dp.html',
    goBranch: 'branch.html',
    goCompare: 'compare.html'
  });

  /* Đọc dữ liệu đã lưu */
  const input = JSON.parse(localStorage.getItem('input') || '{}');   // { items, capacity, type }
  const results = JSON.parse(localStorage.getItem('results') || '{}');   // { greedy, dp, branch }

  if (!results.branch) {
    document.getElementById('resultContainer').innerHTML = `
    <p style="color: red; text-align: center;">
      ❗Không có dữ liệu. Vui lòng <a href="input.html" style="color: blue; text-decoration: underline;">quay lại trang nhập</a>.
    </p>
  `;
    return;

  }

  //Nút tải file kết quả
  document.getElementById('exportAlgoBtn')?.addEventListener('click', () => {
    const input = JSON.parse(localStorage.getItem('input'));
    const result = JSON.parse(localStorage.getItem('results'))?.branch;   // đổi dp / branch
    if (!result) return alert('Chưa có kết quả.');
    exportSingleAlgoCSV(input, result, 'branch');                          // đổi tên tương ứng
  });

  const { items = [], capacity = 0 } = input;
  const { selectedItems, totalWeight, totalValue } = results.branch;

  /* Bảng trái – danh sách đã sắp xếp */
  const sortedItems = calculateAndSortByUnitPrice(items);
  document.getElementById('sortedTable').innerHTML = `
    <h3>Danh sách đã sắp xếp</h3>
    <table>
      <thead><tr><th>Tên</th><th>KL</th><th>GT</th><th>Đơn giá</th></tr></thead>
      <tbody>
        ${sortedItems.map(i =>
    `<tr>
             <td>${i.name}</td>
             <td>${i.weight}</td>
             <td>${i.value}</td>
             <td>${i.unitPrice.toFixed(2)}</td>
           </tr>`).join('')}
      </tbody>
    </table>
  `;

  /* Bảng phải – kết quả Greedy */
  document.getElementById('resultTable').innerHTML = `
    <h3>Kết quả chọn</h3>
    <table>
      <thead><tr><th>Tên</th><th>Số lượng</th><th>Khối lượng</th><th>Giá trị</th></tr></thead>
      <tbody>
        ${selectedItems.map(i =>
    `<tr>
             <td>${i.name}</td>
             <td>${i.taken}</td>
             <td>${(i.weight * i.taken).toFixed(2)}</td>
             <td>${(i.value * i.taken).toFixed(2)}</td>
           </tr>`).join('')}
      </tbody>
    </table>
    <p><strong>Tổng khối lượng:</strong> ${totalWeight.toFixed(2)} / ${capacity}</p>
    <p><strong>Tổng giá trị:</strong> ${totalValue.toFixed(2)}</p>
  `;
});
