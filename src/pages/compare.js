import { loadNavbar } from '../components/navbar.js';
import { calculateAndSortByUnitPrice } from '../components/sort-items.js';
import { exportCompareCSV } from '../components/file-reader.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar
    loadNavbar('compare.html', {
        goHome: '../index.html',
        goInput: 'input.html',
        goGreedy: 'greedy.html',
        goDP: 'dp.html',
        goBranch: 'branch.html',
        goCompare: 'compare.html'
    });

    //Nút tải file kết quả
    document.getElementById('exportCompareBtn')?.addEventListener('click', () => {
        const input = JSON.parse(localStorage.getItem('input'));
        const results = JSON.parse(localStorage.getItem('results'));
        exportCompareCSV(input, results);
    });

    // 2. Lấy dữ liệu đã giải sẵn (từ input.js)
    const input = JSON.parse(localStorage.getItem('input') || '{}');
    const results = JSON.parse(localStorage.getItem('results') || '{}');
    const itemsRaw = input.items || [];
    const capacity = input.capacity || 0;
    const baloType = input.type || 'balo1';

    // 2a. Kiểm tra thiếu dữ liệu
    if (!itemsRaw.length || isNaN(capacity)) {
        const msg = `
      ❗Không có dữ liệu. Vui lòng 
      <a href="input.html" style="color:blue; text-decoration:underline;">quay lại trang nhập</a>.
    `;
        document.getElementById('sortedTable').innerHTML = `<p style="color:red;text-align:center;">${msg}</p>`;
        document.getElementById('greedyResult').innerHTML = '';
        document.getElementById('dpResult').innerHTML = '';
        document.getElementById('branchResult').innerHTML = '';
        return;
    }

    // 3. Bảng đề bài (sắp xếp theo đơn giá)
    const items = calculateAndSortByUnitPrice([...itemsRaw]);  // clone mảng
    renderSortedTable(items, baloType);

    // 4. Hiển thị kết quả 3 thuật toán đã lưu sẵn
    renderResult('greedyResult', 'Thuật toán Tham lam (Greedy)', results.greedy);
    renderResult('dpResult', 'Quy hoạch động (Dynamic Programming)', results.dp);
    renderResult('branchResult', 'Nhánh cận (Branch & Bound)', results.branch);
});

/**
 * Hiển thị bảng đề bài (danh sách vật phẩm đã sắp xếp)
 */
function renderSortedTable(items, baloType) {
    const el = document.getElementById('sortedTable');
    let html = '<h3>Danh sách vật phẩm (đã sắp xếp theo đơn giá giảm dần)</h3>';
    html += '<table><thead><tr><th>Tên</th><th>Khối lượng</th><th>Giá trị</th>';
    if (baloType === 'balo2') html += '<th>Số lượng</th>';
    html += '<th>Đơn giá</th></tr></thead><tbody>';

    items.forEach(i => {
        html += `<tr>
      <td>${i.name}</td>
      <td>${i.weight}</td>
      <td>${i.value}</td>`;
        if (baloType === 'balo2') html += `<td>${i.quantity ?? 1}</td>`;
        html += `<td>${i.unitPrice.toFixed(2)}</td>
    </tr>`;
    });

    html += '</tbody></table>';
    el.innerHTML = html;
}

/**
 * Hiển thị bảng kết quả của một thuật toán
 * @param {string} containerId  id thẻ div để render
 * @param {string} title        tiêu đề bảng
 * @param {object} result       { selectedItems, totalWeight, totalValue }
 */
function renderResult(containerId, title, result) {
    const el = document.getElementById(containerId);

    let html = `<h3>${title}</h3>`;
    html += '<table><thead><tr><th>Tên</th><th>Số lượng</th><th>Khối lượng</th><th>Giá trị</th></tr></thead><tbody>';

    result.selectedItems.forEach(it => {
        if (it.taken > 0) {
            html += `<tr>
        <td>${it.name}</td>
        <td>${it.taken}</td>
        <td>${(it.weight * it.taken).toFixed(2)}</td>
        <td>${(it.value * it.taken).toFixed(2)}</td>
      </tr>`;
        }
    });

    html += `</tbody></table>
    <p><strong>Tổng khối lượng:</strong> ${result.totalWeight.toFixed(2)}</p>
    <p><strong>Tổng giá trị:</strong> ${result.totalValue.toFixed(2)}</p>`;

    el.innerHTML = html;
}
