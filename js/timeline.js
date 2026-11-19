/* ============================================================
   TIMELINE.JS – Page 2: interactive memory journey & Grand Finale
   ============================================================
   ★ Để thay caption/ngày: sửa mảng MILESTONES bên dưới.
   ============================================================ */

const MILESTONES = [
  { img: 'assets/images/milestones/1.jpg',  date: '', caption: 'Tao'  },
  { img: 'assets/images/milestones/2.jpg',  date: '', caption: 'Có'  },
  { img: 'assets/images/milestones/3.jpg',  date: '', caption: 'Nhiều'  },
  { img: 'assets/images/milestones/4.jpg',  date: '', caption: 'Ảnh'  },
  { img: 'assets/images/milestones/5.jpg',  date: '', caption: 'Dìm'  },
  { img: 'assets/images/milestones/6.jpg',  date: '', caption: 'Của'  },
  { img: 'assets/images/milestones/7.jpg',  date: '', caption: 'Mày'  },
  { img: 'assets/images/milestones/8.jpg',  date: '', caption: 'Rồi'  },
  { img: 'assets/images/milestones/9.jpg',  date: '', caption: 'HHAHAHAHHAH'  },
  { img: 'assets/images/milestones/10.jpg', date: '', caption: 'Cẩn thận tao!' },
];

let currentStep  = 0;
let tlBuilt      = false;
let finaleShown  = false;

function initTimeline() {
  if (tlBuilt) return;
  tlBuilt = true;
  finaleShown = false;

  buildCards();
  updateTimeline();

  document.getElementById('btn-next').addEventListener('click', stepNext);
  document.getElementById('btn-prev').addEventListener('click', stepPrev);

  // keyboard
  document.addEventListener('keydown', e => {
    if (!document.getElementById('page-timeline').classList.contains('active')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') stepNext();
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   stepPrev();
  });
}

function buildCards() {
  const wrapper = document.getElementById('tl-wrapper');
  wrapper.innerHTML = '';

  MILESTONES.forEach((m, i) => {
    const side = i % 2 === 0 ? 'left' : 'right';

    const card = document.createElement('div');
    card.className = `milestone-card ${side} future`;
    card.id = `card-${i}`;
    card.innerHTML = `
      <img src="${m.img}" alt="Kỷ niệm ${i+1}" loading="lazy" />
      ${m.date    ? `<div class="milestone-date">${m.date}</div>` : ''}
      ${m.caption ? `<div class="milestone-caption">${m.caption}</div>` : ''}
    `;
    wrapper.appendChild(card);

    const dot = document.createElement('div');
    dot.className = 'tl-dot';
    dot.id = `dot-${i}`;
    wrapper.appendChild(dot);
  });
}

function updateTimeline() {
  const CARD_H = Math.min(240, window.innerHeight * 0.26);

  MILESTONES.forEach((_, i) => {
    const card = document.getElementById(`card-${i}`);
    const dot  = document.getElementById(`dot-${i}`);
    if (!card || !dot) return;

    const delta = i - currentStep;

    card.classList.remove('past','current','future');
    dot.classList.remove('active-dot');

    if (delta === 0) {
      card.classList.add('current');
      dot.classList.add('active-dot');
    } else if (delta < 0) {
      card.classList.add('past');
    } else {
      card.classList.add('future');
    }

    card.style.top = `calc(50% + ${delta * CARD_H}px - ${CARD_H/2}px)`;
    dot.style.top  = `calc(50% + ${delta * CARD_H}px)`;
  });

  const prog = document.getElementById('tl-progress');
  if (prog) prog.textContent = `${currentStep + 1} / ${MILESTONES.length}`;

  const btnNext = document.getElementById('btn-next');
  if (btnNext) btnNext.textContent = currentStep >= MILESTONES.length - 1 ? 'Complete' : 'Next →';
}

function stepNext() {
  if (finaleShown) return;
  if (currentStep < MILESTONES.length - 1) {
    currentStep++;
    updateTimeline();
  } else {
    showFinale();
  }
}

function stepPrev() {
  if (finaleShown) return;
  if (currentStep > 0) { currentStep--; updateTimeline(); }
}

/* ─── GRAND FINALE ─── */
function showFinale() {
  finaleShown = true;
  document.getElementById('tl-controls').style.display = 'none';
  document.getElementById('tl-progress').style.display = 'none';

  const overlay = document.createElement('div');
  overlay.id = 'finale-overlay';
  overlay.innerHTML = `
    <div class="finale-title">✨ memorable moments ✨</div>
    <div class="finale-grid" id="finale-grid"></div>
  `;
  document.body.appendChild(overlay);

  const grid = document.getElementById('finale-grid');
  MILESTONES.forEach((m, i) => {
    const img = document.createElement('img');
    img.src = m.img;
    img.className = 'finale-thumb';
    img.alt = `Ảnh ${i+1}`;
    grid.appendChild(img);
  });

  // Blur thumbnails after 1.5s
  setTimeout(() => {
    document.querySelectorAll('.finale-thumb').forEach(t => t.classList.add('blur-it'));
  }, 1500);

  // Hero photo at 2.1s
  setTimeout(() => {
    const hero = document.createElement('img');
    hero.id  = 'hero-photo';
    hero.src = 'assets/images/hero/hero.png';
    hero.alt = 'Đào Thu Trang';
    document.body.appendChild(hero);

    // Fireworks burst on hero reveal
    if (window.launchFireworks) {
      window.launchFireworks(window.innerWidth/2, window.innerHeight*0.3, 4);
      setTimeout(() => window.launchFireworks(null, null, 2), 600);
    }
    if (window.launchMeteors) window.launchMeteors(6);
  }, 2100);

  // Action buttons at 3.1s
  setTimeout(() => {
    const actions = document.createElement('div');
    actions.className = 'finale-actions';
    actions.innerHTML = `
      <button class="glass-btn" id="btn-restart">↺ Replay</button>
      <button class="glass-btn" id="btn-finale-home">Home</button>
      <button class="glass-btn" id="btn-finale-wish">Letter</button>
    `;
    document.body.appendChild(actions);

    document.getElementById('btn-restart').addEventListener('click', () => {
      overlay.remove(); actions.remove();
      const heroEl = document.getElementById('hero-photo');
      if (heroEl) heroEl.remove();
      currentStep = 0; tlBuilt = false; finaleShown = false;
      document.getElementById('tl-controls').style.display = '';
      document.getElementById('tl-progress').style.display = '';
      initTimeline();
    });

    document.getElementById('btn-finale-home').addEventListener('click', () => {
      overlay.remove(); actions.remove();
      const heroEl = document.getElementById('hero-photo');
      if (heroEl) heroEl.remove();
      navigateTo('home');
    });

    document.getElementById('btn-finale-wish').addEventListener('click', () => {
      overlay.remove(); actions.remove();
      const heroEl = document.getElementById('hero-photo');
      if (heroEl) heroEl.remove();
      navigateTo('wish');
    });
  }, 3100);
}
