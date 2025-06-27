/**
 * Sinh ngẫu nhiên danh sách vật phẩm
 * @param {number} n - số lượng vật phẩm
 * @param {string} baloType - 'balo1' | 'balo2' | 'balo3'
 * @returns {Array} danh sách vật phẩm [{ name, weight, value, quantity? }]
 */
export function generateRandomItems(n, baloType) {
    const items = [];
    const ACode = 'A'.charCodeAt(0);

    for (let i = 0; i < n; i++) {
        const name = String.fromCharCode(ACode + i % 26) + (i >= 26 ? Math.floor(i / 26) : '');
        const weight = +(Math.random() * 19 + 1).toFixed(2);   // 1 → 20
        const value = +(Math.random() * 90 + 10).toFixed(2);  // 10 → 100

        const item = { name, weight, value };
        if (baloType === 'balo2') {
            item.quantity = Math.floor(Math.random() * 10 + 1); // 1 → 10
        }

        items.push(item);
    }

    return items;
}
