// src/components/file-reader.js
export function readCSVFile(inputElement, callback) {
    const file = inputElement.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const lines = e.target.result.split('\n').filter(line => line.trim() !== '');
        const items = lines.slice(1).map(line => {
            const [name, weight, value] = line.split(',');
            return {
                name: name.trim(),
                weight: parseFloat(weight),
                value: parseFloat(value)
            };
        });
        callback(items);
    };
    reader.readAsText(file);
}
