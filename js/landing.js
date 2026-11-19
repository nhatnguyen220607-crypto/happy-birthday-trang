/* ============================================================
   LANDING.JS – Page 1: calendar build
   ============================================================ */

function initLanding() {
  buildCalendar();

  document.getElementById('btn-to-timeline').addEventListener('click', () => navigateTo('timeline'));
  document.getElementById('btn-to-wish').addEventListener('click',     () => navigateTo('wish'));
}

/* November 2024 starts on Friday (column index 5, Sun=0) */
function buildCalendar() {
  const grid = document.getElementById('cal-grid');
  if (!grid) return;

  const startOffset = 5;  // Friday
  const daysInNov   = 30;

  for (let i = 0; i < startOffset; i++) {
    const blank = document.createElement('div');
    blank.className = 'cal-day';
    grid.appendChild(blank);
  }

  for (let d = 1; d <= daysInNov; d++) {
    const cell = document.createElement('div');
    cell.className = d === 24 ? 'cal-day special' : 'cal-day';
    cell.textContent = d;
    grid.appendChild(cell);
  }
}
