import { calculateAndSortByUnitPrice } from '../components/sort-items.js';
import { loadNavbar } from '../components/navbar.js';

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar('dp.html', {
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

    if (!items.length || isNaN(capacity)) {
        document.getElementById('resultContainer').innerHTML = `
        <p style="color: red; text-align: center;">❗Không có dữ liệu. Vui lòng nhập trước.</p>
    `;
        return;
    }

    items = calculateAndSortByUnitPrice(items);

    let n = items.length;
    let dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

    if (baloType === 'balo3') {
        for (let i = 1; i <= n; i++) {
            for (let w = 0; w <= capacity; w++) {
                if (items[i - 1].weight <= w) {
                    dp[i][w] = Math.max(
                        items[i - 1].value + dp[i - 1][w - items[i - 1].weight],
                        dp[i - 1][w]
                    );
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
    } else if (baloType === 'balo2') {
        for (let i = 1; i <= n; i++) {
            const quantity = items[i - 1].quantity || 1;
            for (let w = 0; w <= capacity; w++) {
                dp[i][w] = dp[i - 1][w];
                for (let q = 1; q <= quantity; q++) {
                    if (q * items[i - 1].weight <= w) {
                        dp[i][w] = Math.max(
                            dp[i][w],
                            dp[i - 1][w - q * items[i - 1].weight] + q * items[i - 1].value
                        );
                    }
                }
            }
        }
    } else {
        for (let i = 1; i <= n; i++) {
            for (let w = 0; w <= capacity; w++) {
                if (items[i - 1].weight <= w) {
                    dp[i][w] = Math.max(
                        items[i - 1].value + dp[i][w - items[i - 1].weight],
                        dp[i - 1][w]
                    );
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
    }

    // Truy vết để lấy kết quả
    let w = capacity;
    let selectedItems = [];
    for (let i = n; i > 0 && w >= 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            const item = items[i - 1];
            let taken = 1;
            if (baloType === 'balo1') {
                taken = 0;
                while (w >= item.weight && dp[i][w] === dp[i][w - item.weight] + item.value) {
                    taken++;
                    w -= item.weight;
                }
            } else if (baloType === 'balo2') {
                let quantity = item.quantity || 1;
                taken = 0;
                for (let q = quantity; q > 0; q--) {
                    if (w >= q * item.weight && dp[i][w] === dp[i - 1][w - q * item.weight] + q * item.value) {
                        taken = q;
                        w -= q * item.weight;
                        break;
                    }
                }
            } else {
                w -= item.weight;
            }

            selectedItems.push({ ...item, taken });
        }
    }

    const left = document.getElementById('sortedTable');
    const right = document.getElementById('resultTable');

    let sortedHTML = '<h3>Danh sách đã sắp xếp theo đơn giá</h3>';
    sortedHTML += '<table><thead><tr><th>Tên</th><th>Số Lượng</th><th>Khối Lượng</th><th>Giá Trị</th></tr></thead><tbody>';
    items.forEach(item => {
        sortedHTML += `<tr>
            <td>${item.name}</td>
            <td>${item.weight}</td>
            <td>${item.value}</td>
            <td>${item.unitPrice.toFixed(2)}</td>
        </tr>`;
    });
    sortedHTML += '</tbody></table>';
    left.innerHTML = sortedHTML;

    let totalWeight = 0;
    let totalValue = 0;
    let resultHTML = '<h3>Kết quả chọn</h3>';
    resultHTML += '<table><thead><tr><th>Tên</th><th>Số Lượng</th><th>Khối Lượng</th><th>Giá Trị</th></tr></thead><tbody>';
    selectedItems.reverse().forEach(item => {
        const weight = item.weight * item.taken;
        const value = item.value * item.taken;
        totalWeight += weight;
        totalValue += value;
        resultHTML += `<tr>
            <td>${item.name}</td>
            <td>${item.taken}</td>
            <td>${weight.toFixed(2)}</td>
            <td>${value.toFixed(2)}</td>
        </tr>`;
    });
    resultHTML += `</tbody></table>
        <p><strong>Tổng khối lượng:</strong> ${totalWeight.toFixed(2)} / ${capacity}</p>
        <p><strong>Tổng giá trị:</strong> ${totalValue.toFixed(2)}</p>`;
    right.innerHTML = resultHTML;
});
