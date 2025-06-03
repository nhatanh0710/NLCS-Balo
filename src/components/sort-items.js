// Tính đơn giá và sắp xếp danh sách vật phẩm theo đơn giá giảm dần
export function calculateAndSortByUnitPrice(items) {
    return items
        .map(item => ({
            ...item,
            unitPrice: item.value / item.weight
        }))
        .sort((a, b) => b.unitPrice - a.unitPrice);
}
