// utils/greedy-solver.js
export function greedySolver(items, capacity, baloType) {
    items = items.map(i => ({ ...i, unitPrice: i.value / i.weight }))
        .sort((a, b) => b.unitPrice - a.unitPrice);

    let remaining = capacity, totalValue = 0, totalWeight = 0, result = [];

    for (let item of items) {
        let maxTake = baloType === 'balo3' ? 1
            : baloType === 'balo2' ? item.quantity || 1
                : Math.floor(remaining / item.weight);

        let take = Math.min(maxTake, Math.floor(remaining / item.weight));
        if (take > 0) {
            result.push({ ...item, taken: take });
            remaining -= take * item.weight;
            totalWeight += take * item.weight;
            totalValue += take * item.value;
        }
    }

    return { sortedItems: items, selectedItems: result, totalWeight, totalValue };
}
