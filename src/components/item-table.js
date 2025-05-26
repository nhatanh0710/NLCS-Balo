// src/components/item-table.js
export function createItemTable(containerId, itemCount) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // clear cũ

    const table = document.createElement("table");
    table.innerHTML = `
    <thead>
      <tr><th>STT</th><th>Tên vật</th><th>Trọng lượng</th><th>Giá trị</th></tr>
    </thead>
    <tbody>
      ${[...Array(itemCount)].map((_, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><input type="text" name="name-${i}" /></td>
          <td><input type="number" name="weight-${i}" min="0" /></td>
          <td><input type="number" name="value-${i}" min="0" /></td>
        </tr>
      `).join('')}
    </tbody>
  `;
    container.appendChild(table);
}
