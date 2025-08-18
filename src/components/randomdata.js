/**
 * Sinh ngẫu nhiên danh sách vật phẩm phù hợp với trọng lượng balo
 * @param {number} n - số lượng vật phẩm
 * @param {string} baloType - 'balo1' | 'balo2' | 'balo3'
 * @param {number} capacity - trọng lượng tối đa của balo
 * @returns {Array} danh sách vật phẩm [{ name, weight, value, quantity? }]
 */
export function generateRandomItems(n, baloType, capacity) {
    const items = [];
    const ACode = 'A'.charCodeAt(0);

    for (let i = 0; i < n; i++) {
        const name = String.fromCharCode(ACode + i % 26) + (i >= 26 ? Math.floor(i / 26) : '');

        // Xác định trọng lượng: 80% nhỏ/vừa, 20% lớn hơn balo
        const rand = Math.random();
        let weight;
        if (rand < 0.9) {

            weight = +(Math.random() * (capacity * 0.5 - capacity * 0.05) + capacity * 0.05).toFixed(1);
        } else {
            // 20% vật lớn: 60% → 120% capacity
            weight = +(Math.random() * (capacity * 1.2 - capacity * 0.5) + capacity * 0.5).toFixed(1);
        }

        const unitValue = Math.random() * 10 + 1;
        const value = +(weight * unitValue).toFixed(1);


        const item = { name, weight, value };

        // Nếu balo2 thì thêm số lượng
        if (baloType === 'balo2') {
            item.quantity = Math.floor(Math.random() * 10 + 1); // 1 → 10
        }

        items.push(item);
    }

    return items;
}
