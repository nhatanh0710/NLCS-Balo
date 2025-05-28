export function readCSVFile(fileInput, callback) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const lines = e.target.result.trim().split('\n');
        let capacity = 0;
        let startIndex = 0;

        // 👇 Kiểm tra dòng đầu tiên có chứa trọng lượng balo
        const firstLine = lines[0].toLowerCase();
        if (firstLine.includes('trọng lượng') || firstLine.includes('dung lượng')) {
            const match = firstLine.match(/\d+/);
            if (match) capacity = parseInt(match[0]);
            startIndex = 1;
        }

        const headers = lines[startIndex].split(',').map(h => h.trim());
        const items = [];

        for (let i = startIndex + 1; i < lines.length; i++) {
            const row = lines[i].split(',');
            const item = {
                name: row[0],
                weight: parseFloat(row[1]),
                value: parseFloat(row[2]),
            };
            if (headers.includes('Số lượng')) {
                item.quantity = parseInt(row[3]) || 1;
            }
            items.push(item);
        }

        callback(items, capacity); // ✅ Trả thêm trọng lượng
    };

    reader.readAsText(fileInput.files[0]);
}
