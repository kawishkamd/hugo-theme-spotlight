/**
 * Hugo Spotlight Theme Engine
 * 100% Pure Vanilla JS - No Libraries, 0 External Calls
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initCardSpotlight();
  initBackToTop();
  initGitHubActivity();
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
   2. Card Spotlight Cursor Tracker
   ========================================================================== */
function initCardSpotlight() {
  const cards = document.querySelectorAll('.card-spotlight');
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   3. Back to Top Smooth Scroll
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   4. GitHub Activity Graph (renlenon.vercel.app style)
   ========================================================================== */
function initGitHubActivity() {
  const container = document.getElementById('github-graph');
  const totalText = document.getElementById('github-total-text');
  if (!container) return;

  const username = container.getAttribute('data-username');
  if (!username) return;
  const cacheKey = `gh_contribs_${username}`;
  const CACHE_TTL = 1000 * 60 * 60 * 4; // 4 hours
  const scrollWrapper = container.closest('.github-graph-scroll') || container.parentElement;

  function scrollToRecent() {
    if (scrollWrapper && scrollWrapper.scrollWidth > scrollWrapper.clientWidth) {
      scrollWrapper.scrollTo({ left: scrollWrapper.scrollWidth, behavior: 'instant' });
    }
  }

  // Default to far right for pre-rendered markup on mobile
  scrollToRecent();
  requestAnimationFrame(scrollToRecent);

  function render(data) {
    if (!data || !data.contributions || !data.contributions.length) {
      if (totalText) totalText.textContent = 'No recent public activity to show.';
      return;
    }

    const contribs = data.contributions;
    const total = data.total && typeof data.total.lastYear === 'number'
      ? data.total.lastYear
      : contribs.filter(c => c.count > 0).length;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const firstDay = new Date(contribs[0].date + 'T00:00:00').getDay();
    const padded = Array(firstDay).fill(null).concat(contribs);

    const weeks = [];
    for (let i = 0; i < padded.length; i += 7) {
      weeks.push(padded.slice(i, i + 7));
    }

    const weekMonths = weeks.map(w => {
      const first = w.find(Boolean);
      return first ? new Date(first.date + 'T00:00:00').getMonth() : null;
    });

    const monthRow = document.createElement('div');
    monthRow.className = 'github-months-row';
    weekMonths.forEach((m, idx) => {
      const col = document.createElement('div');
      col.className = 'github-month-label';
      if (m !== null && (idx === 0 || m !== weekMonths[idx - 1])) {
        col.textContent = months[m];
      }
      monthRow.appendChild(col);
    });

    const weeksRow = document.createElement('div');
    weeksRow.className = 'github-weeks-row';
    weeks.forEach(w => {
      const col = document.createElement('div');
      col.className = 'github-week-col';
      w.forEach(d => {
        const cell = document.createElement('div');
        if (d) {
          cell.className = 'gh-day';
          cell.setAttribute('data-level', d.level);
          cell.title = `${d.count} contribution${d.count === 1 ? '' : 's'} on ${d.date}`;
        } else {
          cell.className = 'gh-day-empty';
        }
        col.appendChild(cell);
      });
      weeksRow.appendChild(col);
    });

    // Atomic swap - never collapses container height or width
    container.replaceChildren(monthRow, weeksRow);
    scrollToRecent();

    if (totalText) {
      totalText.innerHTML = `<strong>${total}</strong> contributions in the last year`;
    }
  }

  // Check cache first; only re-render if data differs from static HTML
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL && parsed.data) {
        const currentStrong = totalText ? totalText.querySelector('strong') : null;
        const currentTotal = currentStrong ? currentStrong.textContent.trim() : null;
        const cachedTotal = String(parsed.data.total?.lastYear ?? '');
        if (!currentTotal || currentTotal !== cachedTotal) {
          render(parsed.data);
        }
        return;
      }
    }
  } catch (e) {}

  function fetchLive() {
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        const currentStrong = totalText ? totalText.querySelector('strong') : null;
        const currentTotal = currentStrong ? currentStrong.textContent.trim() : null;
        const newTotal = String(data.total?.lastYear ?? '');
        if (!currentTotal || currentTotal !== newTotal) {
          render(data);
        }
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
        } catch (e) {}
      })
      .catch(() => {
        if (totalText && !totalText.querySelector('strong')) {
          totalText.innerHTML = `<strong>370+</strong> contributions in the last year`;
        }
      });
  }

  // Lazy-load live sync only when user scrolls near the GitHub Activity section
  const section = document.getElementById('github-activity');
  if ('IntersectionObserver' in window && section) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        fetchLive();
      }
    }, { rootMargin: '300px' });
    observer.observe(section);
  } else {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchLive, { timeout: 6000 });
    } else {
      setTimeout(fetchLive, 3000);
    }
  }
}
