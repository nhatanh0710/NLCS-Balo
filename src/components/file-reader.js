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
