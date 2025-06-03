import { calculateAndSortByUnitPrice } from '../components/sort-items.js';
import { loadNavbar } from '../components/navbar.js';

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
  const messageBox = document.getElementById('noDataMessage');

  if (!items.length || isNaN(capacity)) {
    messageBox.textContent = '❗Không có dữ liệu. Vui lòng nhập trước.';
    return;
  } else {
    messageBox.textContent = '';
  }

  const sortedItems = calculateAndSortByUnitPrice(items);

  let remaining = capacity;
  let totalWeight = 0;
  let totalValue = 0;
  const result = [];

  for (let item of sortedItems) {
    let take = 0;

    if (baloType === 'balo3') {
      if (item.weight <= remaining) {
        take = 1;
      }
    } else {
      const max = baloType === 'balo2' ? item.quantity || 1 : Infinity;
      take = Math.min(Math.floor(remaining / item.weight), max);
    }

    if (take > 0) {
      totalWeight += item.weight * take;
      totalValue += item.value * take;
      remaining -= item.weight * take;
      result.push({ ...item, taken: take });
    }
  }

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
    <table><thead><tr><th>Tên</th><th>SL</th><th>KL</th><th>GT</th></tr></thead><tbody>
      ${result.map(i =>
    `<tr><td>${i.name}</td><td>${i.taken}</td><td>${(i.weight * i.taken).toFixed(2)}</td><td>${(i.value * i.taken).toFixed(2)}</td></tr>`
  ).join('')}
    </tbody></table>
    <p><strong>Tổng khối lượng:</strong> ${totalWeight.toFixed(2)} / ${capacity}</p>
    <p><strong>Tổng giá trị:</strong> ${totalValue.toFixed(2)}</p>
  `;
});
