import { createItemTable } from '../components/item-table.js';
import { readCSVFile } from '../components/file-reader.js';

document.addEventListener('DOMContentLoaded', () => {
    // Load navbar
    fetch('../components/navbar.html')
        .then(res => res.text())
        .then(html => {
            const container = document.getElementById('navbar-container');
            container.innerHTML = html;

            // Điều hướng khi click
            const map = {
                goHome: '../index.html',
                goInput: 'input.html',
                goGreedy: 'greedy.html',
                goDP: 'dp.html',
                goBranch: 'branch.html',
                goCompare: 'compare.html'
            };

            Object.entries(map).forEach(([id, path]) => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.cursor = 'pointer';
                    el.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.location.href = path;
                    });
                }
            });

            // Gắn class .active theo trang hiện tại
            const current = window.location.pathname.split('/').pop();
            const activeId = Object.keys(map).find(id => map[id] === current);
            if (activeId) {
                const activeEl = document.getElementById(activeId);
                if (activeEl) activeEl.classList.add('active');
            }
        });

    // Xử lý tạo bảng và đọc file CSV
    document.getElementById('createTableBtn')?.addEventListener('click', () => {
        const count = parseInt(document.getElementById('itemCount').value);
        if (isNaN(count) || count <= 0) {
            alert('Vui lòng nhập số lượng hợp lệ.');
            return;
        }
        createItemTable('itemTableContainer', count);
    });

    document.getElementById('fileInput')?.addEventListener('change', (e) => {
        readCSVFile(e.target, (items) => {
            const preview = document.getElementById('filePreview');
            preview.innerHTML = `<h4>Xem trước từ file:</h4><ul>${items.map(item =>
                `<li>${item.name} - ${item.weight}kg - ${item.value}đ</li>`
            ).join('')}</ul>`;
        });
    });
});
