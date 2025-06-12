// compare.js - So sánh 3 thuật toán trên cùng dữ liệu
import { loadNavbar } from '../components/navbar.js';
import { calculateAndSortByUnitPrice } from '../components/sort-items.js';
import { greedySolver } from '../components/greedy-solver.js';
import { branchAndBoundSolver } from '../components/branch-solver.js';
import { dynamicProgrammingSolver } from '../components/dp-solver.js';

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar('compare.html', {
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
        document.getElementById('compareContainer').innerHTML = `
        <p style="color: red; text-align: center;">❗Không có dữ liệu. Vui lòng nhập trước.</p>`;
        return;
    }

    const sortedItems = calculateAndSortByUnitPrice([...items]);

    // Đề bài chung
    let inputHTML = '<h2>Dữ liệu đầu vào</h2>';
    inputHTML += '<table><thead><tr><th>Tên</th><th>Khối lượng</th><th>Giá trị</th>';
    if (baloType === 'balo2') inputHTML += '<th>Số lượng</th>';
    inputHTML += '</tr></thead><tbody>';
    sortedItems.forEach(item => {
        inputHTML += `<tr>
            <td>${item.name}</td>
            <td>${item.weight}</td>
            <td>${item.value}</td>`;
        if (baloType === 'balo2') inputHTML += `<td>${item.quantity || 1}</td>`;
        inputHTML += '</tr>';
    });
    inputHTML += '</tbody></table>';
    document.getElementById('inputTable').innerHTML = inputHTML;

    // Gọi 3 thuật toán
    const greedy = greedySolver([...sortedItems], capacity, baloType);
    const branch = branchAndBoundSolver([...sortedItems], capacity, baloType);
    const dp = dynamicProgrammingSolver([...sortedItems], capacity, baloType);

    renderResult('Greedy (Tham lam)', greedy, 'greedyResult');
    renderResult('Branch and Bound (Nhánh cận)', branch, 'branchResult');
    renderResult('Dynamic Programming (Quy hoạch động)', dp, 'dpResult');
});

function renderResult(title, result, containerId) {
    const container = document.getElementById(containerId);
    let html = `<h3>${title}</h3>`;
    html += '<table><thead><tr><th>Tên</th><th>Số lượng</th><th>Khối lượng</th><th>Giá trị</th></tr></thead><tbody>';

    result.selectedItems.forEach(item => {
        if (item.taken > 0) {
            html += `<tr>
                <td>${item.name}</td>
                <td>${item.taken}</td>
                <td>${(item.weight * item.taken).toFixed(2)}</td>
                <td>${(item.value * item.taken).toFixed(2)}</td>
            </tr>`;
        }
    });

    html += `</tbody></table>
        <p><strong>Tổng khối lượng:</strong> ${result.totalWeight.toFixed(2)}</p>
        <p><strong>Tổng giá trị:</strong> ${result.totalValue.toFixed(2)}</p>`;
    container.innerHTML = html;
}
