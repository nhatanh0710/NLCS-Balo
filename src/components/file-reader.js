import { showModal } from '../pages/input.js';
export async function readCSVFile(fileInput, callback) {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async function (e) {
        const text = e.target.result.replace(/^\uFEFF/, ""); // bỏ BOM
        const lines = text.trim().split(/\r?\n/);

        if (lines.length < 2) {
            await showModal("❌ Lỗi: File phải có ít nhất 2 dòng (1 dòng trọng lượng + 1 dòng dữ liệu).");
            return;
        }

        // ✅ Dòng đầu tiên chỉ chứa số (có thể kèm dấu , hoặc khoảng trắng)
        const firstLine = lines[0].trim();
        const capMatch = firstLine.match(/^(\d+)/);
        if (!capMatch) {
            await showModal("❌ Lỗi: Dòng đầu tiên phải là trọng lượng balo (chỉ số).");
            return;
        }
        const capacity = parseInt(capMatch[1], 10);

        const items = [];
        let baloType = null;

        for (let i = 1; i < lines.length; i++) {
            const raw = lines[i].trim();
            if (!raw) continue;

            // Bỏ qua dòng header nếu không có số nào
            if (!/\d/.test(raw)) continue;

            // Nếu có dấu phẩy thì split theo phẩy, ngược lại split theo khoảng trắng
            let parts = raw.includes(",") ? raw.split(",") : raw.split(/\s+/);
            parts = parts.map(p => p.trim()).filter(p => p !== ""); s

            // Xác định loại balo từ dòng dữ liệu đầu tiên
            if (baloType === null) {
                if (parts.length === 3) baloType = "balo1";
                else if (parts.length === 4) baloType = "balo2";
                else {
                    await showModal(`❌ Lỗi: Dòng ${i + 1} có ${parts.length} cột,phải đúng 3 hoặc 4.`);
                    return;
                }
            }

            // Kiểm tra đồng nhất số cột
            if ((baloType === "balo3" && parts.length !== 3) ||
                (baloType === "balo2" && parts.length !== 4)) {
                await showModal(`❌ Lỗi: Dòng ${i + 1} không đúng số cột, phải đúng ${baloType === "balo1" ? "3" : "4"} cột.`);
                return;
            }

            const name = parts[0];
            const weight = parseFloat(parts[1]);
            const value = parseFloat(parts[2]);

            if (!name || isNaN(weight) || isNaN(value)) {
                await showModal(`❌ Lỗi: Dữ liệu không hợp lệ ở dòng ${i + 1}.`);
                return;
            }

            const item = { name, weight, value };

            if (baloType === "balo2") {
                const qty = parseInt(parts[3]);
                if (isNaN(qty)) {
                    await showModal(`❌ Lỗi: Số lượng phải là số ở dòng ${i + 1}.`);
                    return;
                }
                item.quantity = qty;
            }

            items.push(item);
        }

        if (items.length === 0) {
            await showModal("❌ Lỗi: Không có vật phẩm nào hợp lệ trong file.");
            return;
        }

        callback(items, capacity, baloType);
    };

    reader.readAsText(file);
}




//Xuất file CSV từ danh sách vật phẩm
export function exportItemCSV(items, baloType, capacity, filename = 'danh_sach_vat_pham.csv') {
    let csv = `${capacity}\nTên,Khối lượng,Giá trị`;
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
