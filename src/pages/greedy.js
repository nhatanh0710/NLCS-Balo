import { calculateAndSortByUnitPrice } from '../components/sort-items.js';
import { loadNavbar } from '../components/navbar.js';
import { greedySolver } from '../components/greedy-solver.js';

document.addEventListener('DOMContentLoaded', () => {
  loadNavbar('greedy.html', {
    goHome: '../index.html',
    goInput: 'input.html',
    goGreedy: 'greedy.html',
    goDP: 'dp.html',
    goBranch: 'branch.html',
    goCompare: 'compare.html'
  });

  const items = JSON.parse(localStorage.getItem('items') || '[]');
  const capacity = parseFloat(localStorage.getItem('capacity') || '0');
  const baloType = localStorage.getItem('baloType') || 'balo1';

  if (!items.length || isNaN(capacity)) {
    document.getElementById('resultContainer').innerHTML = `
        <p style="color: red; text-align: center;">❗Không có dữ liệu. Vui lòng nhập trước.</p>
    `;
    return;
  }

  const sortedItems = calculateAndSortByUnitPrice(items);
  const { selectedItems, totalWeight, totalValue } = greedySolver(sortedItems, capacity, baloType);

  // Bảng trái - đã sắp xếp
  const sortedTable = document.getElementById('sortedTable');
  sortedTable.innerHTML = `
    <h3>Danh sách đã sắp xếp</h3>
    <table><thead><tr><th>Tên</th><th>KL</th><th>GT</th><th>Đơn giá</th></tr></thead><tbody>
      ${sortedItems.map(i =>
    `<tr><td>${i.name}</td><td>${i.weight}</td><td>${i.value}</td><td>${i.unitPrice.toFixed(2)}</td></tr>`
  ).join('')}
    </tbody></table>
  `;

  // Bảng phải - kết quả
  const resultTable = document.getElementById('resultTable');
  resultTable.innerHTML = `
    <h3>Kết quả chọn</h3>
    <table><thead><tr><th>Tên</th><th>Số Lượng</th><th>Khối Lượng</th><th>Giá Trị</th></tr></thead><tbody>
      ${selectedItems.map(i =>
    `<tr><td>${i.name}</td><td>${i.taken}</td><td>${(i.weight * i.taken).toFixed(2)}</td><td>${(i.value * i.taken).toFixed(2)}</td></tr>`
  ).join('')}
    </tbody></table>
    <p><strong>Tổng khối lượng:</strong> ${totalWeight.toFixed(2)} / ${capacity}</p>
    <p><strong>Tổng giá trị:</strong> ${totalValue.toFixed(2)}</p>
  `;
});
