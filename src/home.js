document.addEventListener('DOMContentLoaded', () => {
  // Load navbar
  fetch('./components/navbar.html')
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById('navbar-container');
      container.innerHTML = html;

      // Gắn điều hướng
      const map = {
        goHome: 'index.html',
        goInput: 'pages/input.html',
        goGreedy: 'pages/greedy.html',
        goDP: 'pages/dp.html',
        goBranch: 'pages/branch.html',
        goCompare: 'pages/compare.html'
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

      // Tô sáng trang hiện tại
      const current = window.location.pathname.split('/').pop();
      const activeId = Object.keys(map).find(id => map[id] === current);
      if (activeId) {
        const activeEl = document.getElementById(activeId);
        if (activeEl) activeEl.classList.add('active');
      }
    });
});
document.addEventListener('DOMContentLoaded', () => {
  // Load navbar
  fetch('./components/navbar.html')
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById('navbar-container');
      container.innerHTML = html;

      // Gắn điều hướng
      const map = {
        goHome: 'index.html',
        goInput: 'pages/input.html',
        goGreedy: 'pages/greedy.html',
        goDP: 'pages/dp.html',
        goBranch: 'pages/branch.html',
        goCompare: 'pages/compare.html'
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

      // Tô sáng trang hiện tại
      const current = window.location.pathname.split('/').pop();
      const activeId = Object.keys(map).find(id => map[id] === current);
      if (activeId) {
        const activeEl = document.getElementById(activeId);
        if (activeEl) activeEl.classList.add('active');
      }
    });
});
