import { createItemTable, getItemsFromTable, rebuildTable, fillItemTable } from '../components/item-table.js';
import { readCSVFile, exportItemCSV } from '../components/file-reader.js';
import { loadNavbar } from '../components/navbar.js';
import { solve } from '../components/solve.js';
import { generateRandomItems } from '../components/randomdata.js';

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
  let fileUploaded = localStorage.getItem('fileUploaded') === 'true';
  let isManual = localStorage.getItem('isManual') === 'true';
  let fileChosen = false;

  let savedType = localStorage.getItem('baloType') || 'balo1';

  // ✅ Chọn loại balo
  const baloRadio = document.querySelector(`input[name="baloType"][value="${savedType}"]`);
  if (baloRadio) baloRadio.checked = true;

  // ✅ Enable lại các ô input mặc định
  const itemCountInput = document.getElementById('itemCount');
  const capacityInput = document.getElementById('capacityInput');

  if (itemCountInput) itemCountInput.disabled = false;
  if (capacityInput) capacityInput.disabled = false;

  // ✅ Khôi phục trọng lượng balo
  const savedCapacity = parseFloat(localStorage.getItem('capacity') || '0');
  if (!isNaN(savedCapacity) && savedCapacity > 0 && capacityInput) {
    capacityInput.value = savedCapacity;
  }

  // ✅ Lắng nghe sự kiện thay đổi để lưu
  if (capacityInput) {
    capacityInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && val > 0) {
        localStorage.setItem('capacity', val);
      } else {
        localStorage.removeItem('capacity');
      }
    });
  }

  // ✅ Khôi phục bảng nhập tay
  if (isManual) {
    document.getElementById('fileInput').disabled = true;

    const count = parseInt(localStorage.getItem('itemCount') || '0');
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    const capacity = parseFloat(localStorage.getItem('capacity') || '0');

    if (count > 0 && itemCountInput) itemCountInput.value = count;
    if (!isNaN(capacity) && capacity > 0 && capacityInput) capacityInput.value = capacity;

    if (count > 0 && items.length > 0) {
      createItemTable('itemTableContainer', count, savedType);

      setTimeout(() => {
        const rows = document.querySelectorAll('#itemTableContainer tbody tr');
        items.forEach((item, index) => {
          const inputs = rows[index]?.querySelectorAll('input');
          if (inputs) {
            inputs[0].value = item.name || '';
            inputs[1].value = item.weight || '';
            inputs[2].value = item.value || '';
            if (inputs[3]) inputs[3].value = item.quantity || 1;
          }
        });
      }, 50);
    }
  }

  // Nút tạo bảng thủ công
  document.getElementById('createTableBtn')?.addEventListener('click', () => {
    if (fileUploaded || fileChosen) {
      alert("Bạn đã tải file lên, không thể tạo bảng thủ công.");
      return;
    }

    const count = parseInt(itemCountInput.value);
    if (isNaN(count) || count <= 0) {
      alert("Vui lòng nhập số lượng hợp lệ.");
      return;
    }

    createItemTable('itemTableContainer', count, savedType);
    itemList = [];
    isManual = true;
    fileChosen = false;
    localStorage.setItem('isManual', 'true');
    localStorage.setItem('itemCount', count);
    document.getElementById('fileInput').disabled = true;
  });

  // Chuyển loại balo
  document.querySelectorAll('input[name="baloType"]').forEach(radio => {
    radio.addEventListener('change', e => {
      savedType = e.target.value;
      localStorage.setItem('baloType', savedType);
      rebuildTable(savedType);
    });
  });

  // Đọc file CSV
  document.getElementById('fileInput')?.addEventListener('change', (e) => {
    if (isManual) {
      alert("Bạn đã tạo bảng nhập tay, không thể tải thêm file.");
      e.target.value = '';
      return;
    }

    readCSVFile(e.target, (items, capacity) => {
      if (!items || items.length === 0) {
        alert("❗ File không có dữ liệu hợp lệ.");
        return;
      }

      itemList = items;
      fileChosen = true;

      if (!isNaN(capacity) && capacityInput) capacityInput.value = capacity;
      itemCountInput.disabled = true;

      const preview = document.getElementById('filePreviewTable');
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

      const balo2Radio = document.querySelector('input[value="balo2"]');
      const hasQuantity = items.some(item => item.quantity !== undefined);
      if (!hasQuantity && balo2Radio) {
        balo2Radio.disabled = true;
        if (balo2Radio.checked) {
          document.querySelector('input[value="balo1"]').checked = true;
          localStorage.setItem('baloType', 'balo1');
        }
      } else if (balo2Radio) {
        balo2Radio.disabled = false;
      }

      localStorage.setItem('fileUploaded', 'true');
      localStorage.setItem('items', JSON.stringify(items));
      localStorage.setItem('capacity', capacity);
      localStorage.setItem('baloType', savedType);
      localStorage.removeItem('results');
    });
  });

  // Nút sinh dữ liệu ngẫu nhiên
  document.getElementById('generateRandomBtn')?.addEventListener('click', () => {
    const count = parseInt(itemCountInput.value);
    const baloType = document.querySelector('input[name="baloType"]:checked')?.value || 'balo1';

    if (isNaN(count) || count <= 0) {
      alert('Vui lòng nhập số lượng vật phẩm hợp lệ');
      return;
    }

    if (count > 100) {
      const ok = confirm('⚠️ Số lượng lớn có thể làm chậm trình duyệt. Tiếp tục?');
      if (!ok) return;
    }

    const items = generateRandomItems(count, baloType);
    localStorage.setItem('items', JSON.stringify(items));
    localStorage.setItem('itemCount', count);
    localStorage.setItem('isManual', 'true');
    localStorage.setItem('baloType', baloType);
    document.getElementById('fileInput').disabled = true;

    createItemTable('itemTableContainer', count, baloType);
    setTimeout(() => {
      fillItemTable(items);
    }, 50);
  });

  // Nút giải bài toán
  document.getElementById('submitBtn')?.addEventListener('click', () => {
    const selectedType = document.querySelector('input[name="baloType"]:checked')?.value;
    const selectedAlgo = document.getElementById('algorithmSelect')?.value;
    const capacity = parseInt(capacityInput.value);

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

    const input = { items: itemList, capacity, type: selectedType };

    let results = {};
    if (selectedAlgo === 'compare') {
      ['greedy', 'dp', 'branch'].forEach(a => results[a] = solve(input, a));
    } else {
      results[selectedAlgo] = solve(input, selectedAlgo);
    }

    localStorage.setItem('input', JSON.stringify(input));
    localStorage.setItem('results', JSON.stringify(results));

    window.location.href = {
      greedy: 'greedy.html',
      dp: 'dp.html',
      branch: 'branch.html',
      compare: 'compare.html'
    }[selectedAlgo];
  });

  // Nút export CSV
  document.getElementById('exportBtn')?.addEventListener('click', () => {
    const items = getItemsFromTable();
    const baloType = document.querySelector('input[name="baloType"]:checked')?.value || 'balo1';
    const baloCapacity = parseInt(capacityInput.value);

    if (!items.length) return alert('Không có dữ liệu để xuất.');
    if (isNaN(baloCapacity) || baloCapacity <= 0)
      return alert('Vui lòng nhập trọng lượng balo hợp lệ trước khi xuất file.');

    exportItemCSV(items, baloType, baloCapacity);
  });

  // ✅ Nút reset
  document.getElementById('resetBtn')?.addEventListener('click', () => {
    if (!confirm('Bạn chắc chắn muốn reset?')) return;

    /* Xóa hết localStorage nhưng KHÔNG ghi thêm flag mới */
    localStorage.clear();

    /* Đồng bộ lại biến trong bộ nhớ */
    fileUploaded = false;
    isManual = false;
    fileChosen = false;
    itemList = [];

    /* Xóa UI cũ */
    document.getElementById('filePreviewTable').innerHTML = '';
    document.getElementById('itemTableContainer').innerHTML = '';

    /* Mở khóa & làm sạch các input */
    const fileInput = document.getElementById('fileInput');
    const itemCountInput = document.getElementById('itemCount');
    const capacityInput = document.getElementById('capacityInput');

    if (fileInput) {
      fileInput.disabled = false;
      fileInput.value = '';
    }

    if (itemCountInput) {
      itemCountInput.disabled = false;
      itemCountInput.readOnly = false;
      itemCountInput.value = '';
    }

    if (capacityInput) {
      capacityInput.disabled = false;
      capacityInput.readOnly = false;
      capacityInput.value = '';
    }

    /* Trả radio & dropdown về mặc định */
    document.querySelector('input[name="baloType"][value="balo1"]').checked = true;
    const algoSelect = document.getElementById('algorithmSelect');
    if (algoSelect) algoSelect.value = 'greedy';
  });


});