

export function dpSolver(items, capacity, baloType) {
    items = items.map(i => ({ ...i, unitPrice: i.value / i.weight }))
        .sort((a, b) => b.unitPrice - a.unitPrice);

    const n = items.length;
    let dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

    if (baloType === 'balo3') {
        for (let i = 1; i <= n; i++) {
            for (let w = 0; w <= capacity; w++) {
                if (items[i - 1].weight <= w) {
                    dp[i][w] = Math.max(
                        items[i - 1].value + dp[i - 1][w - items[i - 1].weight],
                        dp[i - 1][w]
                    );
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
    } else if (baloType === 'balo2') {
        for (let i = 1; i <= n; i++) {
            const quantity = items[i - 1].quantity || 1;
            for (let w = 0; w <= capacity; w++) {
                dp[i][w] = dp[i - 1][w];
                for (let q = 1; q <= quantity; q++) {
                    if (q * items[i - 1].weight <= w) {
                        dp[i][w] = Math.max(
                            dp[i][w],
                            dp[i - 1][w - q * items[i - 1].weight] + q * items[i - 1].value
                        );
                    }
                }
            }
        }
    } else {
        for (let i = 1; i <= n; i++) {
            for (let w = 0; w <= capacity; w++) {
                if (items[i - 1].weight <= w) {
                    dp[i][w] = Math.max(
                        items[i - 1].value + dp[i][w - items[i - 1].weight],
                        dp[i - 1][w]
                    );
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
    }

    // Truy vết kết quả
    let w = capacity;
    let selectedItems = [];
    for (let i = n; i > 0 && w >= 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            const item = items[i - 1];
            let taken = 1;

            if (baloType === 'balo1') {
                taken = 0;
                while (w >= item.weight && dp[i][w] === dp[i][w - item.weight] + item.value) {
                    taken++;
                    w -= item.weight;
                }
            } else if (baloType === 'balo2') {
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

    const totalWeight = selectedItems.reduce((sum, i) => sum + i.taken * i.weight, 0);
    const totalValue = selectedItems.reduce((sum, i) => sum + i.taken * i.value, 0);

    return {
        sortedItems: items,
        selectedItems: selectedItems.reverse(),
        totalWeight,
        totalValue
    };
}
