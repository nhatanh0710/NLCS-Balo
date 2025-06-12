import { loadNavbar } from '../components/navbar.js';
import { calculateAndSortByUnitPrice } from '../components/sort-items.js';
import { branchAndBoundSolver } from '../components/branch-solver.js';

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar('branch.html', {
        goHome: '../index.html',
        goInput: 'input.html',
        goGreedy: 'greedy.html',
        goDP: 'dp.html',
        goBranch: 'branch.html',
        goCompare: 'compare.html'
    });

    let items = JSON.parse(localStorage.getItem('items') || '[]');
    const capacity = parseFloat(localStorage.getItem('capacity') || '0');
    const baloType = localStorage.getItem('baloType') || 'balo1';

    const sortedEl = document.getElementById('sortedTable');
    const resultEl = document.getElementById('resultTable');

    if (!items.length || isNaN(capacity)) {
        document.getElementById('resultContainer').innerHTML = `
      <p style="color: red; text-align: center;">❗Không có dữ liệu. Vui lòng nhập trước.</p>
    `;
        return;
    }

    // ✅ Tính đơn giá và sắp xếp
    const sortedItems = calculateAndSortByUnitPrice(items);

    // ✅ Gọi solver và lấy đúng thuộc tính
    const { selectedItems, totalWeight, totalValue } = branchAndBoundSolver(sortedItems, capacity, baloType);

    // ✅ Bảng trái
    let sortedHTML = '<h3>Danh sách đã sắp xếp theo đơn giá</h3>';
    sortedHTML += '<table><thead><tr><th>Tên</th><th>Khối Lượng</th><th>Giá Trị</th><th>Đơn Giá</th></tr></thead><tbody>';
    sortedItems.forEach(item => {
        sortedHTML += `<tr>
      <td>${item.name}</td>
      <td>${item.weight}</td>
      <td>${item.value}</td>
      <td>${item.unitPrice.toFixed(2)}</td>
    </tr>`;
    });
    sortedHTML += '</tbody></table>';
    sortedEl.innerHTML = sortedHTML;

    // ✅ Bảng phải
    let resultHTML = '<h3>Kết quả chọn</h3>';
    resultHTML += '<table><thead><tr><th>Tên</th><th>Số Lượng</th><th>Khối Lượng</th><th>Giá Trị</th></tr></thead><tbody>';

    selectedItems.forEach(item => {
        const w = item.weight * item.taken;
        const v = item.value * item.taken;
        resultHTML += `<tr>
      <td>${item.name}</td>
      <td>${item.taken}</td>
      <td>${w.toFixed(2)}</td>
      <td>${v.toFixed(2)}</td>
    </tr>`;
    });

    resultHTML += `</tbody></table>
    <p><strong>Tổng khối lượng:</strong> ${totalWeight.toFixed(2)} / ${capacity}</p>
    <p><strong>Tổng giá trị:</strong> ${totalValue.toFixed(2)}</p>`;
    resultEl.innerHTML = resultHTML;
});
