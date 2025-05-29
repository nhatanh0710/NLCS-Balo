export function createItemTable(containerId, count) {
  const baloType = document.querySelector('input[name="baloType"]:checked')?.value || 'balo1';
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  headerRow.innerHTML = `
    <th>Tên</th>
    <th>Khối lượng</th>
    <th>Giá trị</th>
    ${baloType === 'balo2' ? '<th>Số lượng</th>' : ''}
  `;
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (let i = 0; i < count; i++) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" style="min-width: 180px;" placeholder="Tên vật ${i + 1}" /></td>
      <td><input type="number" min="0" step="any" placeholder="Kg" /></td>
      <td><input type="number" min="0" step="any" placeholder="Giá trị" /></td>
      ${baloType === 'balo2' ? '<td><input type="number" min="1" placeholder="Số lượng" /></td>' : ''}
    `;
    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  container.appendChild(table);
}

export function getItemsFromTable() {
  const rows = document.querySelectorAll('#itemTableContainer table tbody tr');
  const items = [];

  const baloType = document.querySelector('input[name="baloType"]:checked')?.value || 'balo1';

  rows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const name = inputs[0].value.trim();
    const weight = parseFloat(inputs[1].value);
    const value = parseFloat(inputs[2].value);
    const quantity = baloType === 'balo2' ? parseInt(inputs[3]?.value || '1') : 1;

    if (name && !isNaN(weight) && !isNaN(value)) {
      items.push({ name, weight, value, quantity });
    }
  });

  return items;
}
export function fillItemTable(items) {
  const rows = document.querySelectorAll('#itemTableContainer table tbody tr');
  const baloType = document.querySelector('input[name="baloType"]:checked')?.value || 'balo1';

  items.forEach((item, i) => {
    const inputs = rows[i]?.querySelectorAll('input');
    if (!inputs) return;

    inputs[0].value = item.name || '';
    inputs[1].value = item.weight || 0;
    inputs[2].value = item.value || 0;

    if (baloType === 'balo2' && inputs[3]) {
      inputs[3].value = item.quantity || 1;
    }
  });
}

