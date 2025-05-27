import { loadNavbar } from './components/navbar.js';

document.addEventListener('DOMContentLoaded', () => {
  loadNavbar('index.html', {
    goHome: 'index.html',
    goInput: 'pages/input.html',
    goGreedy: 'pages/greedy.html',
    goDP: 'pages/dp.html',
    goBranch: 'pages/branch.html',
    goCompare: 'pages/compare.html'
  });
});
