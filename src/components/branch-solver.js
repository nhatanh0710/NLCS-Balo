export function branchAndBoundSolver(items, capacity, baloType) {
    // ✅ Tính đơn giá và sắp xếp giảm dần
    items = items.map(i => ({ ...i, unitPrice: i.value / i.weight }))
        .sort((a, b) => b.unitPrice - a.unitPrice);

    let bestValue = 0;
    let bestSolution = new Array(items.length).fill(0);
    let currentSolution = new Array(items.length).fill(0);

    // ✅ Hàm đệ quy Nhánh - Cận
    function BnB(i, curWeight, curValue) {
        if (i >= items.length) return;

        // Giới hạn số lượng chọn tùy loại balo
        let maxTake = baloType === 'balo3' ? 1
            : baloType === 'balo2' ? items[i].quantity || 0
                : Math.floor((capacity - curWeight) / items[i].weight);

        for (let j = 0; j <= maxTake; j++) {
            let newWeight = curWeight + j * items[i].weight;
            let newValue = curValue + j * items[i].value;
            if (newWeight > capacity) break;

            // Cận trên (bound)
            let bound = newValue;
            let remain = capacity - newWeight;
            if (i + 1 < items.length) {
                bound += remain * items[i + 1].unitPrice;
            }

            if (bound > bestValue) {
                currentSolution[i] = j;
                if (i === items.length - 1 || remain === 0) {
                    if (newValue > bestValue) {
                        bestValue = newValue;
                        bestSolution = [...currentSolution];
                    }
                } else {
                    BnB(i + 1, newWeight, newValue);
                }
                currentSolution[i] = 0; // Quay lui
            }
        }
    }

    // ✅ Bắt đầu từ vật phẩm đầu tiên với khối lượng và giá trị ban đầu bằng 0
    BnB(0, 0, 0);

    // ✅ Trả về kết quả
    const selectedItems = bestSolution
        .map((taken, i) => ({ ...items[i], taken }))
        .filter(item => item.taken > 0); // ❗Lọc vật được chọn

    const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight * item.taken, 0);
    const totalValue = selectedItems.reduce((sum, item) => sum + item.value * item.taken, 0);

    return { sortedItems: items, selectedItems, totalWeight, totalValue };
}
