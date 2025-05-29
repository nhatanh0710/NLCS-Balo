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

    // Tạo bảng nhập tay
    document.getElementById('createTableBtn')?.addEventListener('click', () => {
        const count = parseInt(document.getElementById('itemCount').value);
        if (isNaN(count) || count <= 0) {
            alert("Vui lòng nhập số lượng hợp lệ.");
            return;
        }
        createItemTable('itemTableContainer', count);
        itemList = [];
    });

    // Tự cập nhật lại bảng nhập tay khi đổi loại balo
    document.querySelectorAll('input[name="baloType"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const count = parseInt(document.getElementById('itemCount').value);
            if (!isNaN(count) && count > 0) {
                createItemTable('itemTableContainer', count);
            }
        });
    });

    // Khi chọn file CSV: hiển thị trọng lượng + bảng xem trước
    document.getElementById('fileInput')?.addEventListener('change', (e) => {
        readCSVFile(e.target, (items, capacity) => {
            itemList = items;

            if (!isNaN(capacity) && capacity > 0) {
                document.getElementById('capacityInput').value = capacity;
            }

            // Tạo bảng xem trước từ file CSV
            const preview = document.getElementById('filePreviewTable');
            if (!items || items.length === 0) {
                preview.innerHTML = '<p>Không có dữ liệu.</p>';
                return;
            }

            let tableHTML = '<table><thead><tr><th>Tên</th><th>Khối lượng</th><th>Giá trị</th>';
            if (items[0].quantity !== undefined) tableHTML += '<th>Số lượng</th>';
            tableHTML += '</tr></thead><tbody>';

            items.forEach(item => {
                tableHTML += `<tr>
                    <td>${item.name}</td>
                    <td>${item.weight}</td>
                    <td>${item.value}</td>`;
                if (item.quantity !== undefined) {
                    tableHTML += `<td>${item.quantity}</td>`;
                }
                tableHTML += '</tr>';
            });

            tableHTML += '</tbody></table>';
            preview.innerHTML = tableHTML;
        });
    });

    // Nút giải bài toán
    document.getElementById('submitBtn')?.addEventListener('click', () => {
        const selectedType = document.querySelector('input[name="baloType"]:checked')?.value;
        const selectedAlgo = document.getElementById('algorithmSelect')?.value;
        const capacity = parseInt(document.getElementById('capacityInput')?.value);

        if (itemList.length === 0) {
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

    // Nút xuất CSV
    document.getElementById('exportBtn')?.addEventListener('click', () => {
        const items = getItemsFromTable();
        const baloType = document.querySelector('input[name="baloType"]:checked')?.value || 'balo1';
        const baloCapacity = parseInt(document.getElementById('capacityInput')?.value) || 0;

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
});
