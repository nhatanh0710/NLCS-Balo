import { createItemTable, getItemsFromTable, rebuildTable, fillItemTable } from '../components/item-table.js';
import { readCSVFile, exportItemCSV } from '../components/file-reader.js';
import { loadNavbar } from '../components/navbar.js';
import { solve } from '../components/solve.js';
import { generateRandomItems } from '../components/randomdata.js';

/* ==================== CUSTOM MODAL ALERT / CONFIRM ==================== */
function showModal(message, isConfirm = false) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "9999";

    const box = document.createElement("div");
    box.style.background = "#fff";
    box.style.padding = "20px";
    box.style.borderRadius = "8px";
    box.style.textAlign = "center";
    box.style.minWidth = "280px";
    box.innerHTML = `<p style="margin-bottom: 16px;">${message}</p>`;

    const okBtn = document.createElement("button");
    okBtn.textContent = "OK";
    okBtn.style.margin = "0 8px";
    okBtn.onclick = () => {
      document.body.removeChild(overlay);
      resolve(true);
    };

    box.appendChild(okBtn);

    if (isConfirm) {
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Hủy";
      cancelBtn.style.margin = "0 8px";
      cancelBtn.onclick = () => {
        document.body.removeChild(overlay);
        resolve(false);
      };
      box.appendChild(cancelBtn);
    }

    overlay.appendChild(box);
    document.body.appendChild(overlay);
  });
}

/* ==================== MAIN ==================== */
document.addEventListener("DOMContentLoaded", () => {
  loadNavbar("input.html", {
    goHome: "../index.html",
    goInput: "input.html",
    goGreedy: "greedy.html",
    goDP: "dp.html",
    goBranch: "branch.html",
    goCompare: "compare.html",
  });

  let itemList = [];
  let fileUploaded = localStorage.getItem("fileUploaded") === "true";
  let isManual = localStorage.getItem("isManual") === "true";
  let fileChosen = false;
  let savedType = localStorage.getItem("baloType") || "balo1";

  const itemCountInput = document.getElementById("itemCount");
  const capacityInput = document.getElementById("capacityInput");

  // Khôi phục loại balo
  const baloRadio = document.querySelector(`input[name="baloType"][value="${savedType}"]`);
  if (baloRadio) baloRadio.checked = true;

  if (itemCountInput) itemCountInput.disabled = false;
  if (capacityInput) capacityInput.disabled = false;

  // Khôi phục trọng lượng
  const savedCapacity = parseFloat(localStorage.getItem("capacity") || "0");
  if (!isNaN(savedCapacity) && savedCapacity > 0 && capacityInput) {
    capacityInput.value = savedCapacity;
  }

  // Lưu thay đổi trọng lượng
  if (capacityInput) {
    capacityInput.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && val > 0) {
        localStorage.setItem("capacity", val);
      } else {
        localStorage.removeItem("capacity");
      }
    });
  }

  // Nếu có bảng manual
  if (isManual) {
    document.getElementById("fileInput").disabled = true;
    const count = parseInt(localStorage.getItem("itemCount") || "0");
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    if (count > 0 && itemCountInput) itemCountInput.value = count;
    if (!isNaN(savedCapacity) && savedCapacity > 0 && capacityInput) capacityInput.value = savedCapacity;
    if (count > 0 && items.length > 0) {
      createItemTable("itemTableContainer", count, savedType);
      setTimeout(() => fillItemTable(items), 50);
    }
  }

  /* ===== Nút tạo bảng ===== */
  document.getElementById("createTableBtn")?.addEventListener("click", async () => {
    if (fileUploaded || fileChosen) {
      await showModal("Bạn đã tải file lên, không thể tạo bảng thủ công.");
      return;
    }

    const count = parseInt(itemCountInput.value);
    if (isNaN(count) || count <= 0) {
      await showModal("Vui lòng nhập số lượng hợp lệ.");
      return;
    }

    createItemTable("itemTableContainer", count, savedType);
    itemList = [];
    isManual = true;
    fileChosen = false;
    localStorage.setItem("isManual", "true");
    localStorage.setItem("itemCount", count);
    document.getElementById("fileInput").disabled = true;
  });

  /* ===== Đọc file CSV ===== */
  document.getElementById("fileInput")?.addEventListener("change", (e) => {
    if (isManual) {
      showModal("Bạn đã tạo bảng nhập tay, không thể tải thêm file.");
      e.target.value = "";
      return;
    }
    readCSVFile(e.target, (items, capacity) => {
      if (!items || items.length === 0) {
        showModal("❗ File không có dữ liệu hợp lệ.");
        return;
      }
      itemList = items;
      fileChosen = true;
      if (!isNaN(capacity) && capacityInput) capacityInput.value = capacity;
      itemCountInput.disabled = true;

      let tableHTML = "<table><thead><tr><th>Tên</th><th>Khối lượng</th><th>Giá trị</th>";
      if (items[0].quantity !== undefined) tableHTML += "<th>Số lượng</th>";
      tableHTML += "</tr></thead><tbody>";
      items.forEach(item => {
        tableHTML += `<tr><td>${item.name}</td><td>${item.weight}</td><td>${item.value}</td>`;
        if (item.quantity !== undefined) tableHTML += `<td>${item.quantity}</td>`;
        tableHTML += "</tr>";
      });
      tableHTML += "</tbody></table>";
      document.getElementById("filePreviewTable").innerHTML = tableHTML;

      localStorage.setItem("fileUploaded", "true");
      localStorage.setItem("items", JSON.stringify(items));
      localStorage.setItem("capacity", capacity);
      localStorage.setItem("baloType", savedType);
    });
  });

  /* ===== Sinh dữ liệu ngẫu nhiên ===== */
  document.getElementById("generateRandomBtn")?.addEventListener("click", async () => {
    const count = parseInt(itemCountInput.value);
    const baloType = document.querySelector('input[name="baloType"]:checked')?.value || "balo1";
    if (isNaN(count) || count <= 0) {
      await showModal("Vui lòng nhập số lượng vật phẩm hợp lệ");
      return;
    }
    if (count > 100) {
      const ok = await showModal("⚠️ Số lượng lớn có thể làm chậm ứng dụng. Tiếp tục?", true);
      if (!ok) return;
    }
    const items = generateRandomItems(count, baloType);
    localStorage.setItem("items", JSON.stringify(items));
    localStorage.setItem("itemCount", count);
    localStorage.setItem("isManual", "true");
    localStorage.setItem("baloType", baloType);
    document.getElementById("fileInput").disabled = true;
    createItemTable("itemTableContainer", count, baloType);
    setTimeout(() => fillItemTable(items), 50);
  });

  // ========== 5. Giải bài toán ==========
  document.getElementById('submitBtn').addEventListener('click', async () => {
    const selectedType = document.querySelector('input[name="baloType"]:checked')?.value;
    const selectedAlgo = document.getElementById('algorithmSelect').value;
    const capacity = parseInt(capacityInput.value);

    if (itemList.length === 0 && !fileUploaded) {
      itemList = getItemsFromTable();
    }
    if (!itemList || itemList.length === 0) {
      await showModal("❗ Chưa có dữ liệu vật phẩm.");
      return;
    }
    if (isNaN(capacity) || capacity <= 0) {
      await showModal("❗ Trọng lượng balo không hợp lệ.");
      return;
    }

    const input = { items: itemList, capacity, type: selectedType };
    let results = {};

    if (selectedAlgo === 'compare') {
      ['greedy', 'dp', 'branch'].forEach(a => results[a] = solve(input, a));
    } else {
      results[selectedAlgo] = solve(input, selectedAlgo);
    }

    localStorage.setItem('input', JSON.stringify(input));
    localStorage.setItem('results', JSON.stringify(results));

    window.location.href = {
      greedy: 'greedy.html',
      dp: 'dp.html',
      branch: 'branch.html',
      compare: 'compare.html'
    }[selectedAlgo];
  });

  /* ===== Reset ===== */
  document.getElementById("resetBtn")?.addEventListener("click", async () => {
    const ok = await showModal("Bạn chắc chắn muốn reset?", true);
    if (!ok) return;
    localStorage.clear();
    fileUploaded = false;
    isManual = false;
    fileChosen = false;
    itemList = [];
    document.getElementById("filePreviewTable").innerHTML = "";
    document.getElementById("itemTableContainer").innerHTML = "";
    ["fileInput", "itemCount", "capacityInput"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.disabled = false;
        el.readOnly = false;
        el.value = "";
      }
    });
    document.querySelector('input[name="baloType"][value="balo1"]').checked = true;
    document.getElementById("algorithmSelect").value = "greedy";
  });
});
