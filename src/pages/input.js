import { createItemTable, getItemsFromTable, rebuildTable } from '../components/item-table.js';
import { readCSVFile, exportItemCSV } from '../components/file-reader.js';
import { loadNavbar } from '../components/navbar.js';
import { solve } from '../components/solve.js';

document.addEventListener('DOMContentLoaded', () => {
  loadNavbar('input.html', {
    goHome: '../index.html',
    goInput: 'input.html',
    goGreedy: 'greedy.html',
    goDP: 'dp.html',
    goBranch: 'branch.html',
    goCompare: 'compare.html'
  });

  let itemList = [];

  // ✅ Khôi phục trạng thái đã lưu
  let fileUploaded = localStorage.getItem('fileUploaded') === 'true';
  let isManual = localStorage.getItem('isManual') === 'true';
  let savedType = localStorage.getItem('baloType') || 'balo1';

  document.querySelector(`input[name="baloType"][value="${savedType}"]`).checked = true;

  // ✅ Khôi phục bảng nhập tay nếu có
  if (isManual) {
    document.getElementById('fileInput').disabled = true;
    const count = parseInt(localStorage.getItem('itemCount') || '0');
    const capacity = parseFloat(localStorage.getItem('capacity') || '0');
    if (!isNaN(capacity)) {
      document.getElementById('capacityInput').value = capacity;
    }

    if (count > 0) {
      document.getElementById('itemCount').value = count;
      createItemTable('itemTableContainer', count, savedType);
      setTimeout(() => {
        const rows = document.querySelectorAll('#itemTableContainer tbody tr');
        const items = JSON.parse(localStorage.getItem('items') || '[]');
        items.forEach((item, index) => {
          const inputs = rows[index]?.querySelectorAll('input');
          if (inputs) {
            inputs[0].value = item.name;
            inputs[1].value = item.weight;
            inputs[2].value = item.value;
            if (inputs[3]) inputs[3].value = item.quantity || 1;
          }
        });
      }, 50);
    }
  }

  // ✅ Nút tạo bảng nhập tay
  document.getElementById('createTableBtn')?.addEventListener('click', () => {
    if (fileUploaded) {
      alert("Bạn đã tải file lên, không thể tạo bảng thủ công.");
      return;
    }

    const count = parseInt(document.getElementById('itemCount').value);
    if (isNaN(count) || count <= 0) {
      alert("Vui lòng nhập số lượng hợp lệ.");
      return;
    }

    createItemTable('itemTableContainer', count, savedType);
    itemList = [];
    localStorage.setItem('isManual', 'true');
    localStorage.setItem('itemCount', count);
    document.getElementById('fileInput').disabled = true;
  });

  // ✅ Khi đổi loại balo, cập nhật lại bảng nếu nhập tay
  document.querySelectorAll('input[name="baloType"]').forEach(radio => {
    radio.addEventListener('change', e => {
      savedType = e.target.value;
      localStorage.setItem('baloType', savedType);
      rebuildTable(savedType);
    });
  });

  // ✅ Upload file CSV
  document.getElementById('fileInput')?.addEventListener('change', (e) => {
    if (isManual) {
      alert("Bạn đã tạo bảng nhập tay, không thể tải thêm file.");
      e.target.value = '';
      return;
    }

    readCSVFile(e.target, (items, capacity) => {
      itemList = items;
      localStorage.setItem('fileUploaded', 'true');
      localStorage.setItem('items', JSON.stringify(items));
      localStorage.setItem('capacity', capacity);
      localStorage.setItem('baloType', document.querySelector('input[name="baloType"]:checked')?.value || 'balo1');

      // ⛔ Nếu không có quantity, thì disable balo2
      const hasQuantity = items.some(item => item.quantity !== undefined);
      const balo2Radio = document.querySelector('input[value="balo2"]');

      if (!hasQuantity && balo2Radio) {
        balo2Radio.disabled = true;

        // Nếu đang chọn balo2 thì chuyển sang balo1
        if (balo2Radio.checked) {
          document.querySelector('input[value="balo1"]').checked = true;
          localStorage.setItem('baloType', 'balo1');
        }
      } else if (balo2Radio) {
        balo2Radio.disabled = false;
      }

      document.getElementById('itemCount').disabled = true;
      if (!isNaN(capacity)) {
        document.getElementById('capacityInput').value = capacity;
      }

      const preview = document.getElementById('filePreviewTable');
      if (!items || items.length === 0) {
        preview.innerHTML = '<p style="color:red;">❗Không có dữ liệu.</p>';
        return;
      }

      let tableHTML = '<table><thead><tr><th>Tên</th><th>Khối lượng</th><th>Giá trị</th>';
      if (items[0].quantity !== undefined) tableHTML += '<th>Số lượng</th>';
      tableHTML += '</tr></thead><tbody>';

      items.forEach(item => {
        tableHTML += `<tr><td>${item.name}</td><td>${item.weight}</td><td>${item.value}</td>`;
        if (item.quantity !== undefined) tableHTML += `<td>${item.quantity}</td>`;
        tableHTML += '</tr>';
      });

      tableHTML += '</tbody></table>';
      preview.innerHTML = tableHTML;
      localStorage.removeItem('results');
    });
  });

  // ✅ Nút giải bài toán
  document.getElementById('submitBtn')?.addEventListener('click', () => {
    const selectedType = document.querySelector('input[name="baloType"]:checked')?.value;
    const selectedAlgo = document.getElementById('algorithmSelect')?.value;
    const capacity = parseInt(document.getElementById('capacityInput').value);

    if (itemList.length === 0 && !fileUploaded) {
      itemList = getItemsFromTable();
    }

    if (!itemList || itemList.length === 0) {
      alert("Vui lòng nhập dữ liệu vật phẩm trước.");
      return;
    }

    if (isNaN(capacity) || capacity <= 0) {
      alert("Vui lòng nhập trọng lượng balo hợp lệ.");
      return;
    }

    // Gói dữ liệu đầu vào
    const input = { items: itemList, capacity, type: selectedType };

    // Chỉ giải đúng thuật toán đã chọn
    let results = {};
    if (selectedAlgo === 'compare') {
      ['greedy', 'dp', 'branch'].forEach(a => results[a] = solve(input, a));
    } else {
      results[selectedAlgo] = solve(input, selectedAlgo);
    }

    // Lưu để trang đích chỉ việc hiển thị
    localStorage.setItem('input', JSON.stringify(input));
    localStorage.setItem('results', JSON.stringify(results));

    window.location.href = {
      greedy: 'greedy.html',
      dp: 'dp.html',
      branch: 'branch.html',
      compare: 'compare.html'
    }[selectedAlgo];

  });

  // ✅ Nút xuất CSV
  document.getElementById('exportBtn')?.addEventListener('click', () => {
    const items = getItemsFromTable();
    const baloType = document.querySelector('input[name="baloType"]:checked')?.value || 'balo1';
    const baloCapacity = parseInt(document.getElementById('capacityInput').value);

    if (!items.length) return alert('Không có dữ liệu để xuất.');
    if (isNaN(baloCapacity) || baloCapacity <= 0)
      return alert('Vui lòng nhập trọng lượng balo hợp lệ trước khi xuất file.');

    exportItemCSV(items, baloType, baloCapacity);       // ✅ gọi hàm mới
  });

  // ✅ Nút reset toàn bộ
  document.getElementById('resetBtn')?.addEventListener('click', () => {
    const ok = confirm('Bạn có chắc muốn xoá toàn bộ dữ liệu và tải lại trang?');
    if (!ok) return;

    localStorage.clear();
    location.reload();
  });
});
