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

    document.getElementById('createTableBtn')?.addEventListener('click', () => {
        const count = parseInt(document.getElementById('itemCount').value);
        if (isNaN(count) || count <= 0) {
            alert("Vui lòng nhập số lượng hợp lệ.");
            return;
        }
        createItemTable('itemTableContainer', count);
        itemList = [];
    });

    // Tự cập nhật bảng nếu người dùng đổi loại balo
    document.querySelectorAll('input[name="baloType"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const count = parseInt(document.getElementById('itemCount').value);
            if (!isNaN(count) && count > 0) {
                createItemTable('itemTableContainer', count);
            }
        });
    });

    document.getElementById('fileInput')?.addEventListener('change', (e) => {
        readCSVFile(e.target, (items) => {
            itemList = items;
            const preview = document.getElementById('filePreview');
            preview.innerHTML = `<h4>Xem trước từ file:</h4><ul>${items.map(item =>
                `<li>${item.name} - ${item.weight}kg - ${item.value}đ</li>`
            ).join('')}</ul>`;
        });
    });

    document.getElementById('submitBtn')?.addEventListener('click', () => {
        const selectedType = document.querySelector('input[name="baloType"]:checked')?.value;
        const selectedAlgo = document.getElementById('algorithmSelect')?.value;

        if (itemList.length === 0) {
            itemList = getItemsFromTable();
        }

        if (!itemList || itemList.length === 0) {
            alert("Vui lòng nhập dữ liệu vật phẩm trước.");
            return;
        }

        localStorage.setItem('baloType', selectedType);
        localStorage.setItem('items', JSON.stringify(itemList));

        const redirectMap = {
            greedy: 'greedy.html',
            dp: 'dp.html',
            branch: 'branch.html'
        };

        window.location.href = redirectMap[selectedAlgo];
    });

    // ✅ Nút Tải file CSV
    document.getElementById('exportBtn')?.addEventListener('click', () => {
        const items = getItemsFromTable();
        if (!items || items.length === 0) {
            alert("Không có dữ liệu để xuất.");
            return;
        }

        const baloType = document.querySelector('input[name="baloType"]:checked')?.value || 'balo1';

        let csvContent = 'Tên,Khối lượng,Giá trị';
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
