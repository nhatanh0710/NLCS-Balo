export function readCSVFile(fileInput, callback) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const lines = e.target.result.trim().split('\n');
        let capacity = 0;
        let startIndex = 0;

        // Dòng đầu có chứa trọng lượng balo?
        const firstLine = lines[0].toLowerCase();
        if (firstLine.includes('trọng lượng') || firstLine.includes('dung lượng')) {
            const match = firstLine.match(/\d+/);
            if (match) capacity = parseInt(match[0]);
            startIndex = 1;
        }

        // Tên các cột (headers)
        const headers = lines[startIndex].split(',').map(h => h.trim().toLowerCase());
        const items = [];

        for (let i = startIndex + 1; i < lines.length; i++) {
            const row = lines[i].split(',');
            const item = {};

            headers.forEach((header, index) => {
                const value = row[index]?.trim();
                if (header.includes('tên')) item.name = value;
                else if (header.includes('khối') || header.includes('trọng')) item.weight = parseFloat(value);
                else if (header.includes('giá')) item.value = parseFloat(value);
                else if (header.includes('lượng')) item.quantity = parseInt(value) || 1;
            });

            // Kiểm tra dữ liệu hợp lệ
            if (item.name && !isNaN(item.weight) && !isNaN(item.value)) {
                items.push(item);
            }
        }

        callback(items, capacity); // Trả về mảng items và dung lượng balo
    };

    reader.readAsText(fileInput.files[0]);
}
