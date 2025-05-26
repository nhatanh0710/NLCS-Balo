// src/components/result-box.js
export function displayResult(containerId, items, totalValue) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    const table = document.createElement("table");
    table.innerHTML = `
    <thead>
      <tr><th>STT</th><th>Tên</th><th>Trọng lượng</th><th>Giá trị</th></tr>
    </thead>
    <tbody>
      ${items.map((item, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${item.name}</td>
          <td>${item.weight}</td>
          <td>${item.value}</td>
        </tr>
      `).join('')}
    </tbody>
  `;

    const summary = document.createElement("p");
    summary.innerHTML = `<b>Tổng giá trị:</b> ${totalValue}`;

    container.appendChild(table);
    container.appendChild(summary);
}
