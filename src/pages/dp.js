// dp.js - Giải bài toán bàng Quy hoạch Động (Dynamic Programming)
import { loadNavbar } from '../components/navbar.js';
import { calculateAndSortByUnitPrice } from '../components/sort-items.js';
import { dpSolver } from '../components/dp-solver.js';

document.addEventListener('DOMContentLoaded', () => {
    // Tải thanh điều hướng navbar
    loadNavbar('dp.html', {
        goHome: '../index.html',
        goInput: 'input.html',
        goGreedy: 'greedy.html',
        goDP: 'dp.html',
        goBranch: 'branch.html',
        goCompare: 'compare.html'
    });

    // Đọc dữ liệu từ localStorage
    let items = JSON.parse(localStorage.getItem('items') || '[]');
    const capacity = parseFloat(localStorage.getItem('capacity') || '0');
    const baloType = localStorage.getItem('baloType') || 'balo1';

    if (!items.length || isNaN(capacity)) {
        document.getElementById('resultContainer').innerHTML = `
      <p style="color: red; text-align: center;">❗Không có dữ liệu. Vui lòng nhập trước.</p>
    `;
        return;
    }

    // Tính đơn giá và sắp xếp danh sách theo đơn giá
    const sortedItems = calculateAndSortByUnitPrice(items);

    // Gọi hàm giải bài toán DP và lấy kết quả
    const { selectedItems, totalWeight, totalValue } = dpSolver(sortedItems, capacity, baloType);

    // Bảng trái: danh sách đã sắp xếp
    const sortedEl = document.getElementById('sortedTable');
    let leftHTML = '<h3>Danh sách đã sắp xếp theo đơn giá</h3>';
    leftHTML += '<table><thead><tr><th>Tên</th><th>KL</th><th>GT</th><th>Đơn giá</th></tr></thead><tbody>';
    sortedItems.forEach(item => {
        leftHTML += `<tr>
      <td>${item.name}</td>
      <td>${item.weight}</td>
      <td>${item.value}</td>
      <td>${item.unitPrice.toFixed(2)}</td>
    </tr>`;
    });
    leftHTML += '</tbody></table>';
    sortedEl.innerHTML = leftHTML;

    // Bảng phải: kết quả chọn
    const resultEl = document.getElementById('resultTable');
    let rightHTML = '<h3>Kết quả chọn</h3>';
    rightHTML += `<table><thead><tr><th>Tên</th><th>Số lượng</th><th>Khối lượng</th><th>Giá trị</th></tr></thead><tbody>`;
    selectedItems.forEach(item => {
        const w = item.weight * item.taken;
        const v = item.value * item.taken;
        rightHTML += `<tr>
      <td>${item.name}</td>
      <td>${item.taken}</td>
      <td>${w.toFixed(2)}</td>
      <td>${v.toFixed(2)}</td>
    </tr>`;
    });
    rightHTML += `</tbody></table>
    <p><strong>Tổng khối lượng:</strong> ${totalWeight.toFixed(2)} / ${capacity}</p>
    <p><strong>Tổng giá trị:</strong> ${totalValue.toFixed(2)}</p>`;
    resultEl.innerHTML = rightHTML;
});
