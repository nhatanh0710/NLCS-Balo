export function dpSolver(items, capacity, baloType) {
    const scale = 100;

    // Scale trọng lượng và sức chứa về số nguyên
    const scaledItems = items.map(i => ({
        ...i,
        weight: Math.round(i.weight * scale),
        value: Math.round(i.value * scale),
        unitPrice: i.value / i.weight // vẫn là số thực để sắp xếp
    })).sort((a, b) => b.unitPrice - a.unitPrice);

    const scaledCapacity = Math.round(capacity * scale);
    const n = scaledItems.length;
    let dp = Array.from({ length: n + 1 }, () => Array(scaledCapacity + 1).fill(0));

    if (baloType === 'balo3') {
        for (let i = 1; i <= n; i++) {
            for (let w = 0; w <= scaledCapacity; w++) {
                if (scaledItems[i - 1].weight <= w) {
                    dp[i][w] = Math.max(
                        scaledItems[i - 1].value + dp[i - 1][w - scaledItems[i - 1].weight],
                        dp[i - 1][w]
                    );
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
    } else if (baloType === 'balo2') {
        for (let i = 1; i <= n; i++) {
            const quantity = scaledItems[i - 1].quantity || 1;
            for (let w = 0; w <= scaledCapacity; w++) {
                dp[i][w] = dp[i - 1][w];
                for (let q = 1; q <= quantity; q++) {
                    if (q * scaledItems[i - 1].weight <= w) {
                        dp[i][w] = Math.max(
                            dp[i][w],
                            dp[i - 1][w - q * scaledItems[i - 1].weight] + q * scaledItems[i - 1].value
                        );
                    }
                }
            }
        }
    } else {
        for (let i = 1; i <= n; i++) {
            for (let w = 0; w <= scaledCapacity; w++) {
                if (scaledItems[i - 1].weight <= w) {
                    dp[i][w] = Math.max(
                        scaledItems[i - 1].value + dp[i][w - scaledItems[i - 1].weight],
                        dp[i - 1][w]
                    );
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
    }

    // Truy vết kết quả
    let w = scaledCapacity;
    let selectedItems = [];
    if (baloType === 'balo1') {
        let i = n;
        while (w > 0) {
            let found = false;
            for (let k = 1; k <= n; k++) {
                const item = scaledItems[k - 1];
                if (item.weight <= w && dp[n][w] === dp[n][w - item.weight] + item.value) {
                    const existing = selectedItems.find(it => it.name === item.name);
                    if (existing) {
                        existing.taken++;
                    } else {
                        selectedItems.push({ ...item, taken: 1 });
                    }
                    w -= item.weight;
                    found = true;
                    break;
                }
            }
            if (!found) break;
        }
    } else {
        for (let i = n; i > 0 && w >= 0; i--) {
            if (dp[i][w] !== dp[i - 1][w]) {
                const item = scaledItems[i - 1];
                let taken = 1;

                if (baloType === 'balo2') {
                    const quantity = item.quantity || 1;
                    taken = 0;
                    for (let q = quantity; q > 0; q--) {
                        if (w >= q * item.weight && dp[i][w] === dp[i - 1][w - q * item.weight] + q * item.value) {
                            taken = q;
                            w -= q * item.weight;
                            break;
                        }
                    }
                } else {
                    w -= item.weight;
                }

                selectedItems.push({ ...item, taken });
            }
        }
    }

    // Scale lại kết quả cho đúng đơn vị ban đầu
    const totalWeight = selectedItems.reduce((sum, i) => sum + i.taken * i.weight, 0) / scale;
    const totalValue = selectedItems.reduce((sum, i) => sum + i.taken * i.value, 0) / scale;
    const finalSelectedItems = selectedItems.reverse().map(i => ({
        ...i,
        weight: i.weight / scale,
        value: i.value / scale
    }));

    return {
        sortedItems: scaledItems.map(i => ({ ...i, weight: i.weight / scale, value: i.value / scale })),
        selectedItems: finalSelectedItems,
        totalWeight,
        totalValue
    };
}
