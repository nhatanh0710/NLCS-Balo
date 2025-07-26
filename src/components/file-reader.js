//Đọc file CSV và xuất file CSV
export function readCSVFile(fileInput, callback) {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        const lines = e.target.result.trim().split('\n');
        let capacity = 0;
        let startIndex = 0;

        // ✅ Dòng đầu chứa trọng lượng balo
        const firstLine = lines[0].trim();
        if (/^\d+$/.test(firstLine)) {
            capacity = parseInt(firstLine);
            startIndex = 1;
        } else {
            const found = firstLine.match(/(\d+)/);
            if (found) {
                capacity = parseInt(found[1]);
                startIndex = 1;
            }
        }

        const items = [];

        for (let i = startIndex; i < lines.length; i++) {
            const raw = lines[i].trim();

            // ✅ Phân tách theo dấu phẩy hoặc khoảng trắng (1 hoặc nhiều)
            const parts = raw.includes(',') ? raw.split(',') : raw.split(/\s+/);

            if (parts.length >= 3) {
                const name = parts[0];
                const weight = parseFloat(parts[1]);
                const value = parseFloat(parts[2]);

                if (name && !isNaN(weight) && !isNaN(value)) {
                    const item = { name, weight, value };

                    // Nếu có thêm cột số lượng
                    if (parts.length >= 4) {
                        item.quantity = parseInt(parts[3]) || 1;
                    }

                    items.push(item);
                }
            }
        }

        callback(items, capacity);
    };

    reader.readAsText(file);

}
//Xuất file CSV từ danh sách vật phẩm
export function exportItemCSV(items, baloType, capacity, filename = 'danh_sach_vat_pham.csv') {
    let csv = `Trọng lượng balo: ${capacity}\nTên,Khối lượng,Giá trị`;
    if (baloType === 'balo2') csv += ',Số lượng';
    csv += '\n';

    items.forEach(it => {
        csv += `${it.name},${it.weight},${it.value}`;
        if (baloType === 'balo2') csv += `,${it.quantity ?? 1}`;
        csv += '\n';
    });

    downloadCSV(csv, filename);
}


// Helper chung -------------------------------------------------
function downloadCSV(content, filename) {
    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement('a'), { href: url, download: filename });
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* ---------- Hàm A: Trang Greedy / DP / Branch --------------- */
export function exportSingleAlgoCSV({ items, capacity, type }, result, algoName) {
    /* 1. Bảng đề */
    let csv = `Trọng lượng balo:,${capacity}\nTên,Khối lượng,Giá trị`;
    if (type === 'balo2') csv += ',Số lượng';
    csv += '\n';
    items.forEach(it => {
        csv += `${it.name},${it.weight},${it.value}`;
        if (type === 'balo2') csv += `,${it.quantity ?? 1}`;
        csv += '\n';
    });

    /* 2. Dòng trống ngăn cách */
    csv += '\n';

    /* 3. Bảng kết quả */
    csv += `Kết quả thuật toán:,${algoName}\nTên,Số lượng,Khối lượng,Giá trị\n`;
    result.selectedItems.forEach(it => {
        if (it.taken > 0) {
            csv += `${it.name},${it.taken},${it.weight * it.taken},${it.value * it.taken}\n`;
        }
    });
    csv += `Tổng,,${result.totalWeight},${result.totalValue}\n`;

    downloadCSV(csv, `ket_qua_${algoName}.csv`);
}

/* ---------- Hàm B: Trang Compare --------------------------- */
/**
 * Xuất 1 file CSV gồm:
 *   - Bảng đề
 *   - (dòng trống)
 *   - 3 bảng kết quả: Greedy, DP, Branch (cách nhau 1 dòng trống)
 */
export function exportCompareCSV({ items, capacity, type }, results) {
    let csv = `Trọng lượng balo:,${capacity}\nTên,Khối lượng,Giá trị`;
    if (type === 'balo2') csv += ',Số lượng';
    csv += '\n';
    items.forEach(it => {
        csv += `${it.name},${it.weight},${it.value}`;
        if (type === 'balo2') csv += `,${it.quantity ?? 1}`;
        csv += '\n';
    });
    csv += '\n';

    const order = [
        { key: 'greedy', label: 'Thuật toán Tham lam (Greedy)' },
        { key: 'dp', label: 'Quy hoạch động (DP)' },
        { key: 'branch', label: 'Nhánh cận (Branch & Bound)' }
    ];

    order.forEach((o, idx) => {
        const r = results[o.key];
        if (!r) return;           // bỏ qua nếu thiếu
        csv += `${o.label}\nTên,Số lượng,Khối lượng,Giá trị\n`;
        r.selectedItems.forEach(it => {
            if (it.taken > 0)
                csv += `${it.name},${it.taken},${it.weight * it.taken},${it.value * it.taken}\n`;
        });
        csv += `Tổng,,${r.totalWeight},${r.totalValue}\n`;
        if (idx !== order.length - 1) csv += '\n';  // dòng trống ngăn cách
    });

    downloadCSV(csv, 'tong_hop_ket_qua.csv');
}
//Hàm reset toàn bộ dữ liệu
export function resetApp() {
    const confirmReset = confirm("Bạn có chắc chắn muốn đặt lại toàn bộ dữ liệu?");
    if (!confirmReset) return;

    // Xoá toàn bộ dữ liệu lưu trữ
    localStorage.clear();
    sessionStorage.clear();

    // Mở lại các input bị khóa
    const itemCountInput = document.getElementById('itemCount');
    const capacityInput = document.getElementById('capacityInput');
    const fileInput = document.getElementById('fileInput');

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

    if (fileInput) {
        fileInput.disabled = false;
        fileInput.value = '';
    }

    // Xoá bảng dữ liệu nếu có
    const tableContainer = document.getElementById('itemTableContainer');
    if (tableContainer) {
        tableContainer.innerHTML = '';
    }

    // Xoá bảng hiển thị kết quả nếu có
    const resultTable = document.getElementById('resultTable');
    if (resultTable) {
        resultTable.innerHTML = '';
    }

    // Có thể reload lại trang nếu muốn chắc chắn reset hoàn toàn
    // location.reload();
}
