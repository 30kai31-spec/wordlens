/* ========================================
   app.js — 共通ユーティリティ
   ======================================== */

// ---- API ベースURL ----
// 本番環境（gensparkspace.com）では絶対パスが必要
const API_BASE = (() => {
  const host = location.hostname;
  if (host.includes('gensparkspace.com') || host.includes('genspark.app')) {
    // 本番環境：originからの絶対パス
    return `${location.origin}/tables/`;
  }
  // 開発環境：相対パス
  return 'tables/';
})();

// ---- API ヘルパー ----
const API = {
  async get(table, params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}${table}${qs ? '?' + qs : ''}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async getOne(table, id) {
    const res = await fetch(`${API_BASE}${table}/${id}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async post(table, data) {
    const res = await fetch(`${API_BASE}${table}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async put(table, id, data) {
    const res = await fetch(`${API_BASE}${table}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async patch(table, id, data) {
    const res = await fetch(`${API_BASE}${table}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async delete(table, id) {
    const res = await fetch(`${API_BASE}${table}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
  }
};

// ---- Toast ----
function showToast(message, type = '') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast${type ? ' toast-' + type : ''}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ---- Modal ----
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

// ---- Nav active state ----
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href') || item.dataset.href || '';
    item.classList.toggle('active', href.includes(page));
  });
}

// ---- Date helpers ----
function formatDate(ms) {
  if (!ms) return '—';
  return new Date(Number(ms)).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
}
function daysAgo(ms) {
  if (!ms) return null;
  return Math.floor((Date.now() - Number(ms)) / 86400000);
}

// ---- Ebbinghaus next-review schedule ----
const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 90]; // days
function getNextReviewTime(reviewCount) {
  const idx = Math.min(reviewCount, REVIEW_INTERVALS.length - 1);
  return Date.now() + REVIEW_INTERVALS[idx] * 86400000;
}

// ---- Word tokenizer ----
// Split text into word tokens and punctuation/space spans
function tokenizeText(text) {
  // Match: words (letters/apostrophe) or whitespace/newline blocks or other chars
  const parts = text.match(/[A-Za-z''-]+|[^A-Za-z''-]+/g) || [];
  return parts.map(part => {
    const isWord = /^[A-Za-z]/.test(part);
    return { text: part, isWord };
  });
}

// ---- Clipboard / query param ----
function getParam(key) {
  return new URLSearchParams(location.search).get(key);
}

// ---- Truncate ----
function truncate(str, n = 80) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '…' : str;
}

// ---- Init nav on load ----
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  // Close modals on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) {
        backdrop.classList.remove('open');
      }
    });
  });
});
