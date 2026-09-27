/**
 * Hugo Baremetal Theme Engine
 * 100% Pure Vanilla JS - No Libraries, 0 External Calls
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initBackToTop();
  initBrandScroll();
});

/* ==========================================================================
   1. Theme Toggle (Smooth Original Site Transition)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const KEY = 'theme';

  function syncThemeColor(isDark) {
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.setAttribute('content', isDark ? '#121212' : '#ffffff');
    });
  }

  // Initial sync
  syncThemeColor(document.documentElement.classList.contains('dark-mode'));

  toggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-mode');
    const isDark = document.documentElement.classList.contains('dark-mode');
    syncThemeColor(isDark);
    setTimeout(() => {
      try {
        localStorage.setItem(KEY, isDark ? 'dark' : 'light');
      } catch (e) {}
    }, 0);
  });
}

/* ==========================================================================
   2. Back to Top Smooth Scroll
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   3. Brand Logo Home / Smooth Scroll to Top
   ========================================================================== */
function initBrandScroll() {
  const brand = document.querySelector('.nav-brand');
  if (!brand) return;

  brand.addEventListener('click', (e) => {
    const isHome = window.location.pathname === '/' || window.location.pathname === '';
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.location.hash) {
        history.pushState(null, '', window.location.pathname);
      }
    }
  });
}
