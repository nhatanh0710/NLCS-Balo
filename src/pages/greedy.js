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

  const items = JSON.parse(localStorage.getItem('items')) || [];
  const type = localStorage.getItem('baloType') || 'balo1';
  const capacity = parseInt(localStorage.getItem('capacity'));

  if (items.length === 0) {
    document.getElementById('resultContainer').innerHTML = "<p>❌ Không có dữ liệu để giải.</p>";
    return;
  }

  // 🔷 Hiển thị lại dữ liệu đầu vào
  document.getElementById('inputSummary').innerHTML = `
    <h4>Loại bài toán: <span style="color:#116466">${type.toUpperCase()}</span></h4>
    <p>Dung lượng balo: <b>${capacity}</b></p>
    <ul>${items.map(i =>
    `<li>${i.name} - ${i.weight}kg - ${i.value}đ${type === 'balo2' ? ` - SL: ${i.quantity || 1}` : ''}</li>`
  ).join('')}</ul>
  `;

  // 🔶 Tính hiệu quả: value / weight
  const enriched = [...items].map(item => ({
    ...item,
    efficiency: item.value / item.weight
  }));

  let result = [];
  let totalWeight = 0;
  let totalValue = 0;

  if (type === 'balo1') {
    // 🔸 Balo 1: 0-1 Knapsack → chọn từng món hoặc không chọn
    enriched.sort((a, b) => b.efficiency - a.efficiency);
    for (let item of enriched) {
      if (totalWeight + item.weight <= capacity) {
        result.push({ ...item, taken: 1 });
        totalWeight += item.weight;
        totalValue += item.value;
      }
    }

  } else if (type === 'balo2') {
    // 🔸 Balo 2: có thể chọn nhiều lần, nhưng theo số lượng giới hạn
    enriched.sort((a, b) => b.efficiency - a.efficiency);
    for (let item of enriched) {
      let count = Math.min(item.quantity || 1, Math.floor((capacity - totalWeight) / item.weight));
      if (count > 0) {
        result.push({ ...item, taken: count });
        totalWeight += count * item.weight;
        totalValue += count * item.value;
      }
    }

  } else if (type === 'balo3') {
    // 🔸 Balo 3: có thể lấy 1 phần món → chia nhỏ
    enriched.sort((a, b) => b.efficiency - a.efficiency);
    for (let item of enriched) {
      if (totalWeight + item.weight <= capacity) {
        result.push({ ...item, taken: 1 });
        totalWeight += item.weight;
        totalValue += item.value;
      } else {
        const remain = capacity - totalWeight;
        if (remain > 0) {
          const fraction = remain / item.weight;
          result.push({ ...item, taken: fraction });
          totalWeight += remain;
          totalValue += item.value * fraction;
        }
        break; // Balo đầy rồi
      }
    }
  }

  // 🔷 Hiển thị kết quả
  const tableRows = result.map(r => `
    <tr>
      <td>${r.name}</td>
      <td>${r.weight}</td>
      <td>${r.value}</td>
      <td>${r.taken.toFixed(2)}</td>
    </tr>
  `).join('');

  document.getElementById('resultContainer').innerHTML = `
    <h3>Kết quả lựa chọn:</h3>
    <table>
      <thead>
        <tr>
          <th>Tên</th><th>Khối lượng</th><th>Giá trị</th><th>Chọn</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    <p><b>Tổng trọng lượng:</b> ${totalWeight.toFixed(2)} / ${capacity}</p>
    <p><b>Tổng giá trị:</b> ${totalValue.toFixed(2)}</p>
  `;
});
