export function loadNavbar(currentPageFileName, map) {
    const navbarPath =
        currentPageFileName === 'index.html'
            ? './components/navbar.html'
            : '../components/navbar.html';

    fetch(navbarPath)
        .then(res => res.text())
        .then(html => {
            const container = document.getElementById('navbar-container');
            if (!container) {
                console.error("❌ Không tìm thấy #navbar-container");
                return;
            }

            container.innerHTML = html;

            // Gắn click
            Object.entries(map).forEach(([id, relativePath]) => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.cursor = 'pointer';
                    el.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.location.href = relativePath;
                    });
                }
            });

            // Tô sáng trang đang mở
            const activePath = window.location.pathname.split('/').pop();  // lấy file name cuối URL
            const activeId = Object.keys(map).find(id => map[id].includes(activePath));
            if (activeId) {
                const el = document.getElementById(activeId);
                if (el) el.classList.add('active');
            }
        })
        .catch(err => {
            console.error("❌ Lỗi khi fetch navbar.html:", err);
        });
}
