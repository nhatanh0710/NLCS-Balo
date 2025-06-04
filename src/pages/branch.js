// branch.js - Thuật toán Nhánh Cận cho 3 loại balo
import { loadNavbar } from '../components/navbar.js';
import { calculateAndSortByUnitPrice } from '../components/sort-items.js';

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

    // ✅ Tính đơn giá và sắp xếp giảm dần
    items = calculateAndSortByUnitPrice(items);


    // Biến lưu lời giải tốt nhất
    let bestValue = 0;
    let bestSolution = new Array(items.length).fill(0);
    let currentSolution = new Array(items.length).fill(0);

    function BnB(i, curWeight, curValue) {
        if (i >= items.length) return;

        // ✅ Giới hạn số lượng chọn tuỳ theo loại balo
        let maxTake = Infinity;
        if (baloType === 'balo2') maxTake = items[i].quantity || 0;
        else if (baloType === 'balo3') maxTake = 1;
        else maxTake = Math.floor((capacity - curWeight) / items[i].weight);

        for (let j = 0; j <= maxTake; j++) {
            const newWeight = curWeight + j * items[i].weight;
            const newValue = curValue + j * items[i].value;

            if (newWeight > capacity) break;

            // ✅ Tính cận trên (bound)
            let bound = newValue;
            let remain = capacity - newWeight;
            if (i + 1 < items.length) {
                bound += remain * items[i + 1].unitPrice;
            }

            if (bound > bestValue) {
                currentSolution[i] = j;

                // Nếu là vật cuối cùng hoặc đầy balo
                if (i === items.length - 1 || remain === 0) {
                    if (newValue > bestValue) {
                        bestValue = newValue;
                        bestSolution = [...currentSolution];
                    }
                } else {
                    BnB(i + 1, newWeight, newValue);
                }

                currentSolution[i] = 0; // Quay lui
            }
        }
    }

    BnB(0, 0, 0);

    // ✅ Hiển thị bảng trái: danh sách đã sắp xếp
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
    sortedEl.innerHTML = sortedHTML;

    // ✅ Hiển thị bảng phải: kết quả chọn
    let resultHTML = '<h3>Kết quả chọn</h3>';
    resultHTML += '<table><thead><tr><th>Tên</th><th>Số Lượng</th><th>Khối Lượng</th><th>Giá Trị</th></tr></thead><tbody>';

    let totalWeight = 0;
    let totalValue = 0;

    bestSolution.forEach((take, i) => {
        const item = items[i];
        const w = item.weight * take;
        const v = item.value * take;
        totalWeight += w;
        totalValue += v;
        resultHTML += `<tr>
            <td>${item.name}</td>
            <td>${take}</td>
            <td>${w}</td>
            <td>${v}</td>
        </tr>`;
    });

    resultHTML += `</tbody></table>
        <p><strong>Tổng khối lượng:</strong> ${totalWeight} / ${capacity}</p>
        <p><strong>Tổng giá trị:</strong> ${totalValue}</p>`;
    resultEl.innerHTML = resultHTML;
});
