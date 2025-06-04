import { createItemTable, getItemsFromTable } from '../components/item-table.js';
import { readCSVFile } from '../components/file-reader.js';
import { loadNavbar } from '../components/navbar.js';

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
  const fileUploaded = localStorage.getItem('fileUploaded') === 'true';
  const isManual = localStorage.getItem('isManual') === 'true';
  const savedType = localStorage.getItem('baloType') || 'balo1';

  document.querySelector(`input[name="baloType"][value="${savedType}"]`).checked = true;

  // ✅ Khôi phục từ file CSV
  if (fileUploaded) {
    document.getElementById('itemCount').disabled = true;
    itemList = JSON.parse(localStorage.getItem('items') || '[]');
    const capacity = parseFloat(localStorage.getItem('capacity') || '0');
    if (!isNaN(capacity)) {
      document.getElementById('capacityInput').value = capacity;
    }

    // Hiển thị bảng xem trước
    if (itemList.length > 0) {
      const preview = document.getElementById('filePreviewTable');
      let tableHTML = '<table><thead><tr><th>Tên</th><th>Khối lượng</th><th>Giá trị</th>';
      if (itemList[0].quantity !== undefined) tableHTML += '<th>Số lượng</th>';
      tableHTML += '</tr></thead><tbody>';

      itemList.forEach(item => {
        tableHTML += `<tr><td>${item.name}</td><td>${item.weight}</td><td>${item.value}</td>`;
        if (item.quantity !== undefined) tableHTML += `<td>${item.quantity}</td>`;
        tableHTML += '</tr>';
      });

      tableHTML += '</tbody></table>';
      preview.innerHTML = tableHTML;
    }
  }

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
      createItemTable('itemTableContainer', count);
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

    createItemTable('itemTableContainer', count);
    itemList = [];
    localStorage.setItem('isManual', 'true');
    localStorage.setItem('itemCount', count);
    document.getElementById('fileInput').disabled = true;
  });

  // ✅ Khi đổi loại balo, cập nhật lại bảng nếu nhập tay
  document.querySelectorAll('input[name="baloType"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const count = parseInt(document.getElementById('itemCount').value);
      if (isManual && !isNaN(count) && count > 0) {
        createItemTable('itemTableContainer', count);
      }
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
      itemList = items; // ✅ RẤT QUAN TRỌNG: Gán lại biến toàn cục
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

    localStorage.setItem('baloType', selectedType);
    localStorage.setItem('items', JSON.stringify(itemList));
    localStorage.setItem('capacity', capacity);

    const redirectMap = {
      greedy: 'greedy.html',
      dp: 'dp.html',
      branch: 'branch.html'
    };

    window.location.href = redirectMap[selectedAlgo];
  });

  // ✅ Nút xuất CSV
  document.getElementById('exportBtn')?.addEventListener('click', () => {
    const items = getItemsFromTable();
    const baloType = document.querySelector('input[name="baloType"]:checked')?.value || 'balo1';
    const baloCapacity = parseInt(document.getElementById('capacityInput').value) || 0;

    if (!items || items.length === 0) {
      alert("Không có dữ liệu để xuất.");
      return;
    }

    if (isNaN(baloCapacity) || baloCapacity <= 0) {
      alert("Vui lòng nhập trọng lượng balo hợp lệ trước khi xuất file.");
      return;
    }

    let csvContent = `Trọng lượng balo: ${baloCapacity}\nTên,Khối lượng,Giá trị`;
    if (baloType === 'balo2') csvContent += ',Số lượng';
    csvContent += '\n';

    items.forEach(item => {
      csvContent += `${item.name},${item.weight},${item.value}`;
      if (baloType === 'balo2') {
        csvContent += `,${item.quantity || 1}`;
      }
      csvContent += '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'du_lieu_balo.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // ✅ Nút reset toàn bộ
  document.getElementById('resetBtn')?.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
  });
});
