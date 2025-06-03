import { loadNavbar } from '../components/navbar.js';

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
        sortedEl.innerHTML = resultEl.innerHTML = `<p style="color:red;">❗Không có dữ liệu. Vui lòng nhập trước.</p>`;
        return;
    }

    if (baloType !== 'balo3') {
        sortedEl.innerHTML = resultEl.innerHTML = `<p style="color:red;">❗Thuật toán Nhánh cận chỉ áp dụng cho bài toán balo 0-1.</p>`;
        return;
    }

    // ✅ Tính đơn giá và sắp xếp
    items.forEach(i => i.unitPrice = i.value / i.weight);
    items.sort((a, b) => b.unitPrice - a.unitPrice);

    class Node {
        constructor(level, value, weight, bound, taken) {
            this.level = level;
            this.value = value;
            this.weight = weight;
            this.bound = bound;
            this.taken = taken || [];
        }
    }

    function bound(u) {
        if (u.weight >= capacity) return 0;

        let profitBound = u.value;
        let j = u.level + 1;
        let totalWeight = u.weight;

        while (j < items.length && totalWeight + items[j].weight <= capacity) {
            totalWeight += items[j].weight;
            profitBound += items[j].value;
            j++;
        }

        if (j < items.length) {
            profitBound += (capacity - totalWeight) * items[j].unitPrice;
        }

        return profitBound;
    }

    function branchAndBound() {
        let maxProfit = 0;
        let bestTaken = [];
        let queue = [];

        const v = new Node(-1, 0, 0, 0, []);
        v.bound = bound(v);
        queue.push(v);

        while (queue.length > 0) {
            const u = queue.shift();

            if (u.level === items.length - 1) continue;

            const nextLevel = u.level + 1;

            // Chọn vật phẩm
            const left = new Node(
                nextLevel,
                u.value + items[nextLevel].value,
                u.weight + items[nextLevel].weight,
                0,
                [...u.taken, true]
            );

            if (left.weight <= capacity && left.value > maxProfit) {
                maxProfit = left.value;
                bestTaken = left.taken;
            }

            left.bound = bound(left);
            if (left.bound > maxProfit) queue.push(left);

            // Không chọn vật phẩm
            const right = new Node(
                nextLevel,
                u.value,
                u.weight,
                0,
                [...u.taken, false]
            );

            right.bound = bound(right);
            if (right.bound > maxProfit) queue.push(right);
        }

        return { maxProfit, bestTaken };
    }

    const result = branchAndBound();

    // ✅ Bảng bên trái: Danh sách vật phẩm
    let leftHTML = '<h3>Danh sách đã sắp xếp theo đơn giá</h3>';
    leftHTML += '<table><thead><tr><th>Tên</th><th>KL</th><th>GT</th><th>Đơn giá</th></tr></thead><tbody>';
    items.forEach(item => {
        leftHTML += `<tr>
      <td>${item.name}</td>
      <td>${item.weight}</td>
      <td>${item.value}</td>
      <td>${item.unitPrice.toFixed(2)}</td>
    </tr>`;
    });
    leftHTML += '</tbody></table>';
    sortedEl.innerHTML = leftHTML;

    // ✅ Bảng bên phải: Kết quả chọn
    let rightHTML = '<h3>Kết quả chọn</h3>';
    rightHTML += '<table><thead><tr><th>Tên</th><th>Chọn</th><th>KL</th><th>GT</th></tr></thead><tbody>';

    let totalWeight = 0;
    result.bestTaken.forEach((take, i) => {
        const item = items[i];
        rightHTML += `<tr>
      <td>${item.name}</td>
      <td>${take ? '✅' : ''}</td>
      <td>${take ? item.weight : 0}</td>
      <td>${take ? item.value : 0}</td>
    </tr>`;
        if (take) totalWeight += item.weight;
    });

    rightHTML += `</tbody></table>
    <p><strong>Tổng khối lượng:</strong> ${totalWeight} / ${capacity}</p>
    <p><strong>Tổng giá trị:</strong> ${result.maxProfit}</p>`;
    resultEl.innerHTML = rightHTML;
});
