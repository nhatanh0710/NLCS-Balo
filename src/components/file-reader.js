export function readCSVFile(inputElement, callback) {
    const file = inputElement.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const lines = e.target.result.split('\n').map(line => line.trim()).filter(line => line !== '');

        // 📌 Dòng đầu tiên là trọng lượng balo
        let capacity = 0;
        if (lines[0].toLowerCase().startsWith('trọng lượng balo:')) {
            capacity = parseInt(lines[0].split(':')[1]);
            lines.shift(); // bỏ dòng đầu
        }

        const headers = lines[0].split(',');
        const isBalo2 = headers.includes('Số lượng');
        const items = [];

        for (let i = 1; i < lines.length; i++) {
            const [name, weight, value, quantity] = lines[i].split(',');
            if (!name || isNaN(weight) || isNaN(value)) continue;

            const item = {
                name: name.trim(),
                weight: parseFloat(weight),
                value: parseFloat(value)
            };

            if (isBalo2) {
                item.quantity = parseInt(quantity) || 1;
            }

            items.push(item);
        }

        // 🔸 Lưu cả items và capacity qua callback
        callback(items, capacity);
    };

    reader.readAsText(file);
}
