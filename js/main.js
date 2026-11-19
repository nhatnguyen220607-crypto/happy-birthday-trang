/* ============================================================
   MAIN.JS v3 – SPA router, intro screen, music, magic bar
   ============================================================ */

/* ════ SPA Router ════ */
window.navigateTo = function (pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  document.querySelectorAll('.mini-nav button').forEach(b => {
    b.classList.toggle('active', b.dataset.page === pageId);
  });

  if (pageId === 'timeline') initTimeline();
  if (pageId === 'wish')     initWishes();
};

document.querySelectorAll('.mini-nav button').forEach(btn =>
  btn.addEventListener('click', () => navigateTo(btn.dataset.page))
);

/* ════ Music ════ */
const MUSIC_FILE = 'assets/audio/See you again - Wiz Khalifa ft Charlie Puth.mp3';
const music = new Audio(MUSIC_FILE);
music.loop = true; music.volume = 0.38;
let musicOn = false;
const btnMusic = document.getElementById('btn-music');

function startMusic() {
  music.play().then(() => {
    musicOn = true;
    btnMusic.classList.add('music-on');
    btnMusic.title = 'Tắt nhạc';
  }).catch(err => console.warn('Autoplay blocked:', err));
}

btnMusic.addEventListener('click', () => {
  if (!musicOn) { startMusic(); }
  else {
    music.pause();
    musicOn = false;
    btnMusic.classList.remove('music-on');
    btnMusic.title = 'Bật nhạc';
  }
});

/* ════ Intro Screen ════
   Clicking/tapping dismisses intro, starts music AND continuous meteors */
const introScreen = document.getElementById('intro-screen');

function dismissIntro() {
  introScreen.style.transition = 'opacity 0.9s ease';
  introScreen.style.opacity    = '0';
  setTimeout(() => { introScreen.style.display = 'none'; }, 900);

  // Auto-start music (browser requires user gesture for audio)
  startMusic();

  // Start continuous meteor shower
  if (window.startAutoMeteors) window.startAutoMeteors();
}

introScreen.addEventListener('click',      dismissIntro);
introScreen.addEventListener('touchstart', dismissIntro, { passive: true });

/* ════ Magic Bar ════ */
document.getElementById('btn-fireworks').addEventListener('click', () => {
  if (window.launchFireworks) {
    window.launchFireworks(Math.random()*window.innerWidth, Math.random()*window.innerHeight*0.55, 3);
    setTimeout(()=> window.launchFireworks(null, null, 2), 400);
  }
});

document.getElementById('btn-meteors').addEventListener('click', () => {
  if (window.launchMeteors) window.launchMeteors(10);
});

/* ════ Boot ════ */
initLanding();
