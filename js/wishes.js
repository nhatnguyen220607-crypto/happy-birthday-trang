/* ============================================================
   WISHES.JS v3 – Page 3: letter, cake, blow-candle
   ============================================================ */

const LETTER_LINES = [
  'Chúc mừng sinh nhật cô bạn cùng bàn',
  'Dẫu biết rằng ngày này rồi cũng đến',
  'Nhưng tao không nghĩ có ngày mày già như này',
  '',
  'Chúc cô bạn sớm lấy chồng',
  'Tuổi mới, góc nhìn mới, con người mới',
  '',
  '🎂  Chúc Trang sinh nhật vui vẻ  🎂',
  '✦  24 / 11  ✦',
];

let wishBuilt = false;

function initWishes() {
  if (wishBuilt) return;
  wishBuilt = true;
  buildLetter();
  initCake();
}

function buildLetter() {
  const body = document.getElementById('letter-body');
  if (!body) return;
  body.innerHTML = '';

  LETTER_LINES.forEach((line, i) => {
    const p = document.createElement('p');
    p.className = 'wish-line';
    p.textContent = line || '\u00A0';
    body.appendChild(p);
    setTimeout(() => p.classList.add('visible'), 300 + i * 170);
  });
}

function initCake() {
  const btn = document.getElementById('btn-blow');
  if (!btn) return;
  let blown = false;

  btn.addEventListener('click', () => {
    if (blown) return;
    blown = true;

    // Blow each candle with stagger
    document.querySelectorAll('.candle').forEach((c, i) => {
      setTimeout(() => {
        c.classList.add('blown');
        spawnSmoke(c);
      }, i * 180);
    });

    // Show wish message
    setTimeout(() => {
      const msg = document.getElementById('wish-msg');
      if (msg) msg.classList.add('show');
    }, 650);

    // ★ Big meteor + fireworks burst
    setTimeout(() => {
      if (window.launchMeteors)   window.launchMeteors(12);
      if (window.launchFireworks) {
        window.launchFireworks(window.innerWidth*0.25, window.innerHeight*0.35, 2);
        setTimeout(()=> window.launchFireworks(window.innerWidth*0.75, window.innerHeight*0.35, 2), 350);
        setTimeout(()=> window.launchFireworks(window.innerWidth*0.5,  window.innerHeight*0.22, 3), 700);
      }
      // second meteor wave
      setTimeout(()=>{ if(window.launchMeteors) window.launchMeteors(8); }, 1600);
    }, 750);

    // Disable button
    btn.style.opacity     = '0.3';
    btn.style.cursor      = 'default';
    btn.style.pointerEvents = 'none';
  });
}

function spawnSmoke(candle) {
  const rect = candle.getBoundingClientRect();
  for (let i = 0; i < 7; i++) {
    setTimeout(() => {
      const s = document.createElement('div');
      s.className = 'smoke-particle';
      s.style.left = `${rect.left + rect.width/2 - 2 + (Math.random()-0.5)*6}px`;
      s.style.top  = `${rect.top - 8}px`;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1700);
    }, i * 110);
  }
}
