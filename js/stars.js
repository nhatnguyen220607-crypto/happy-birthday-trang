/* ============================================================
   STARS.JS v3
   – Richer star background (multi-color, sparkle, glow nebula)
   – Planets on second canvas (Saturn, moon, galaxy, orbits, rockets)
   – Stardust cursor trail
   – Fireworks & Meteor helpers
   – Continuous auto-meteor shower (setInterval)
   ============================================================ */
(function () {

  /* ════════════════════════════════════
     1. STAR BACKGROUND – richer & more diverse
  ════════════════════════════════════ */
  const SC  = document.getElementById('star-canvas');
  const ctx = SC.getContext('2d');
  let stars = [];

  const STAR_COLORS = [
    '255,255,255',  // pure white
    '220,235,255',  // blue-white
    '255,245,210',  // warm yellow
    '210,220,255',  // cool blue
    '255,220,220',  // soft red
    '200,255,220',  // pale green
  ];

  function resizeSC() {
    SC.width  = window.innerWidth;
    SC.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = [];
    // ~1 per 1800px²  → denser than before
    const count = Math.floor((SC.width * SC.height) / 1800);
    for (let i = 0; i < count; i++) {
      const isBright = Math.random() < 0.06;
      const isLarge  = Math.random() < 0.04;
      stars.push({
        x:     Math.random() * SC.width,
        y:     Math.random() * SC.height,
        r:     isBright ? (Math.random() * 1.8 + 1.2)
               : isLarge ? (Math.random() * 1.4 + 0.9)
               : (Math.random() * 1.0 + 0.2),
        base:  Math.random(),
        d:     (Math.random() - 0.5) * 0.013,
        px:    Math.random() * 0.028,
        ox: 0, oy: 0,
        col:   STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        type:  isBright ? 'sparkle4' : isLarge ? 'sparkle2' : 'dot',
      });
    }

    // Extra bright nebula cluster (subtle glow patch)
    _nebula = {
      x: SC.width * (0.3 + Math.random() * 0.4),
      y: SC.height * (0.2 + Math.random() * 0.4),
      r: Math.min(SC.width, SC.height) * 0.22,
    };
  }

  let _nebula = { x: 0, y: 0, r: 200 };

  // Parallax
  let pmx = 0, pmy = 0, cMx = 0, cMy = 0;
  document.addEventListener('mousemove', e => {
    pmx = (e.clientX / window.innerWidth  - 0.5) * 2;
    pmy = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  document.addEventListener('touchmove', e => {
    if (!e.touches.length) return;
    pmx = (e.touches[0].clientX / window.innerWidth  - 0.5) * 2;
    pmy = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function drawStars() {
    ctx.clearRect(0, 0, SC.width, SC.height);

    // ease parallax
    cMx += (pmx - cMx) * 0.04;
    cMy += (pmy - cMy) * 0.04;

    // Subtle nebula glow
    const nGrad = ctx.createRadialGradient(
      _nebula.x, _nebula.y, 0,
      _nebula.x, _nebula.y, _nebula.r
    );
    nGrad.addColorStop(0, 'rgba(80,100,160,0.055)');
    nGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = nGrad;
    ctx.fillRect(0, 0, SC.width, SC.height);

    stars.forEach(s => {
      s.base += s.d;
      if (s.base > 1 || s.base < 0.06) s.d *= -1;
      const a = Math.max(0.06, Math.min(1, s.base));

      s.ox += (cMx * s.px * 48 - s.ox) * 0.055;
      s.oy += (cMy * s.px * 48 - s.oy) * 0.055;
      const sx = s.x + s.ox, sy = s.y + s.oy;

      if (s.type === 'sparkle4') {
        // 4-pointed star
        draw4Sparkle(ctx, sx, sy, s.r * 2.2, a, s.col);
      } else if (s.type === 'sparkle2') {
        // 2-line cross sparkle
        draw2Sparkle(ctx, sx, sy, s.r * 1.6, a, s.col);
      } else {
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.col},${a.toFixed(2)})`;
        ctx.fill();
      }
    });
    requestAnimationFrame(drawStars);
  }

  function draw4Sparkle(c, x, y, r, alpha, col) {
    c.save();
    c.translate(x, y);
    c.globalAlpha = alpha;
    // glow
    const g = c.createRadialGradient(0,0,0,0,0,r*2);
    g.addColorStop(0, `rgba(${col},0.3)`);
    g.addColorStop(1, 'transparent');
    c.fillStyle = g;
    c.fillRect(-r*2, -r*2, r*4, r*4);
    // star shape
    c.fillStyle = `rgba(${col},1)`;
    c.beginPath();
    for (let i = 0; i < 4; i++) {
      const ang = (i * Math.PI) / 2;
      c.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
      c.lineTo(Math.cos(ang + Math.PI/4) * r * 0.22,
               Math.sin(ang + Math.PI/4) * r * 0.22);
    }
    c.closePath();
    c.fill();
    c.restore();
  }

  function draw2Sparkle(c, x, y, r, alpha, col) {
    c.save();
    c.translate(x, y);
    c.globalAlpha = alpha;
    c.strokeStyle = `rgba(${col},1)`;
    c.lineWidth   = 1;
    c.beginPath(); c.moveTo(-r, 0);  c.lineTo(r, 0);  c.stroke();
    c.beginPath(); c.moveTo(0, -r*0.6); c.lineTo(0, r*0.6); c.stroke();
    // core dot
    c.beginPath();
    c.arc(0, 0, r*0.25, 0, Math.PI*2);
    c.fillStyle = `rgba(${col},1)`;
    c.fill();
    c.restore();
  }

  window.addEventListener('resize', resizeSC);
  resizeSC();
  drawStars();


  /* ════════════════════════════════════
     2. PLANETS CANVAS (animated)
  ════════════════════════════════════ */
  const PC  = document.getElementById('planet-canvas');
  const pct = PC.getContext('2d');
  let pAngle = 0;

  function resizePC() { PC.width = window.innerWidth; PC.height = window.innerHeight; }
  window.addEventListener('resize', resizePC);
  resizePC();

  // Constellation definitions (% of screen)
  const CONSTELLATIONS = [
    [[0.18,0.30],[0.22,0.24],[0.27,0.28],[0.24,0.34]],
    [[0.63,0.58],[0.68,0.52],[0.72,0.59],[0.67,0.64],[0.71,0.67]],
    [[0.48,0.42],[0.52,0.38],[0.56,0.43],[0.53,0.48]],
  ];

  function drawPlanets() {
    pct.clearRect(0, 0, PC.width, PC.height);
    pAngle += 0.003;
    const W = PC.width, H = PC.height;

    drawGalaxy(pct, W*0.82, H*0.13, 52, 0.11);
    drawMoon  (pct, W*0.87, H*0.11, 25);
    drawSaturn(pct, W*0.10, H*0.78, 34, pAngle*0.12);
    drawOrbitPlanet(pct, W*0.11, H*0.20, 17, pAngle,       0.17);
    drawOrbitPlanet(pct, W*0.88, H*0.76, 11, -pAngle*0.65, 0.16);
    // small floating planet no orbit, top-center area
    drawSimplePlanet(pct, W*0.92, H*0.4, 9, 0.15);
    // mini rocket (decorative)
    drawRocket(pct, W*0.42, H*0.08, pAngle * 0.3);

    CONSTELLATIONS.forEach(pts => drawConstellation(pct, pts, W, H));

    requestAnimationFrame(drawPlanets);
  }

  function drawGalaxy(c, cx, cy, size, alpha) {
    c.save();
    c.globalAlpha = alpha;
    c.strokeStyle = '#fff';
    c.lineWidth = 0.8;
    c.beginPath(); c.ellipse(cx, cy, size, size*0.3, -Math.PI/5, 0, Math.PI*2); c.stroke();
    c.beginPath(); c.ellipse(cx, cy, size*0.5, size*0.15, -Math.PI/5, 0, Math.PI*2); c.stroke();
    c.globalAlpha = alpha * 3.5;
    c.beginPath(); c.arc(cx, cy, 2.5, 0, Math.PI*2); c.fillStyle='#fff'; c.fill();
    // star dots
    for (let i=0;i<6;i++) {
      const ang = (i/6)*Math.PI*2;
      c.globalAlpha = alpha*2;
      c.beginPath(); c.arc(cx+Math.cos(ang)*size*0.85, cy+Math.sin(ang)*size*0.26, 1.2, 0, Math.PI*2); c.fill();
    }
    c.restore();
  }

  function drawMoon(c, cx, cy, r) {
    c.save();
    c.globalAlpha = 0.22;
    c.strokeStyle='#fff'; c.lineWidth=1;
    c.beginPath(); c.arc(cx,cy,r,0,Math.PI*2); c.stroke();
    c.globalAlpha=0.17; c.fillStyle='rgba(255,255,255,0.9)';
    c.beginPath();
    c.arc(cx,cy,r,-Math.PI/2,Math.PI/2);
    c.arc(cx-r*0.4,cy,r*0.88,Math.PI/2,-Math.PI/2,true);
    c.closePath(); c.fill();
    c.restore();
  }

  function drawSaturn(c, cx, cy, r, tilt) {
    c.save();
    c.translate(cx, cy);
    c.rotate(tilt);
    c.globalAlpha = 0.19;
    c.strokeStyle='#fff'; c.lineWidth=1;
    c.beginPath(); c.arc(0,0,r,0,Math.PI*2); c.stroke();
    [[r*2.2,r*0.5],[r*1.78,r*0.4],[r*1.38,r*0.3]].forEach(([rx,ry])=>{
      c.save(); c.rotate(-0.35);
      c.beginPath(); c.ellipse(0,0,rx,ry,0,0,Math.PI*2);
      c.lineWidth=0.9; c.stroke(); c.restore();
    });
    c.globalAlpha=0.4;
    const sx=Math.cos(tilt*2)*r*2, sy=Math.sin(tilt*2)*r*0.45;
    c.beginPath(); c.arc(sx,sy,2.5,0,Math.PI*2); c.fillStyle='#fff'; c.fill();
    c.restore();
  }

  function drawOrbitPlanet(c, cx, cy, r, angle, alpha) {
    c.save();
    c.globalAlpha = alpha;
    c.translate(cx,cy);
    c.strokeStyle='#fff'; c.lineWidth=0.8;
    c.beginPath(); c.ellipse(0,0,r*2.6,r*0.68,Math.PI/6,0,Math.PI*2); c.stroke();
    c.beginPath(); c.arc(0,0,r,0,Math.PI*2); c.stroke();
    const ox=Math.cos(angle)*r*2.6, oy=Math.sin(angle)*r*0.68;
    c.globalAlpha=alpha*2;
    c.beginPath(); c.arc(ox,oy,2.5,0,Math.PI*2); c.fillStyle='#fff'; c.fill();
    c.restore();
  }

  function drawSimplePlanet(c, cx, cy, r, alpha) {
    c.save();
    c.globalAlpha = alpha;
    c.strokeStyle='#fff'; c.lineWidth=0.8;
    c.beginPath(); c.arc(cx,cy,r,0,Math.PI*2); c.stroke();
    c.restore();
  }

  function drawRocket(c, cx, cy, angle) {
    c.save();
    c.translate(cx, cy);
    c.rotate(angle * 0.5);
    c.globalAlpha = 0.14;
    c.strokeStyle='#fff'; c.lineWidth=0.7;
    // rocket body
    c.beginPath();
    c.moveTo(0,-12); c.lineTo(5,5); c.lineTo(-5,5); c.closePath(); c.stroke();
    // fins
    c.beginPath(); c.moveTo(5,5); c.lineTo(8,10); c.lineTo(5,8); c.stroke();
    c.beginPath(); c.moveTo(-5,5); c.lineTo(-8,10); c.lineTo(-5,8); c.stroke();
    c.restore();
  }

  function drawConstellation(c, pts, W, H) {
    c.save();
    c.globalAlpha = 0.12;
    c.strokeStyle='#fff'; c.lineWidth=0.7;
    c.beginPath();
    pts.forEach(([px,py],i)=>{
      const x=px*W,y=py*H;
      i===0 ? c.moveTo(x,y) : c.lineTo(x,y);
    });
    c.stroke();
    c.fillStyle='#fff';
    pts.forEach(([px,py])=>{
      c.globalAlpha=0.32;
      c.beginPath(); c.arc(px*W,py*H,2,0,Math.PI*2); c.fill();
    });
    c.restore();
  }

  drawPlanets();


  /* ════════════════════════════════════
     3. STARDUST CURSOR TRAIL
  ════════════════════════════════════ */
  const CC   = document.getElementById('cursor-canvas');
  const cctx = CC.getContext('2d');
  let dustP  = [];

  function resizeCC() { CC.width=window.innerWidth; CC.height=window.innerHeight; }
  window.addEventListener('resize', resizeCC);
  resizeCC();

  function spawnDust(x, y) {
    for (let i=0; i<4; i++) {
      dustP.push({
        x: x+(Math.random()-0.5)*10,
        y: y+(Math.random()-0.5)*10,
        vx:(Math.random()-0.5)*1.1,
        vy:-Math.random()*1.5-0.3,
        life:1,
        r: Math.random()*1.8+0.4,
        col: Math.random()>0.4?'255,215,0':'255,255,255'
      });
    }
  }

  document.addEventListener('mousemove', e => spawnDust(e.clientX, e.clientY));
  document.addEventListener('touchmove', e => {
    if(e.touches.length) spawnDust(e.touches[0].clientX, e.touches[0].clientY);
  },{passive:true});

  function animateDust() {
    cctx.clearRect(0,0,CC.width,CC.height);
    dustP = dustP.filter(p=>p.life>0.01);
    dustP.forEach(p=>{
      p.life-=0.03; p.x+=p.vx; p.y+=p.vy;
      cctx.beginPath();
      cctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      cctx.fillStyle=`rgba(${p.col},${Math.max(0,p.life).toFixed(2)})`;
      cctx.fill();
    });
    requestAnimationFrame(animateDust);
  }
  animateDust();


  /* ════════════════════════════════════
     4. FIREWORKS HELPER
  ════════════════════════════════════ */
  window.launchFireworks = function(cx, cy, burstCount) {
    burstCount = burstCount||3;
    const fC = document.createElement('canvas');
    fC.style.cssText='position:fixed;inset:0;z-index:8000;pointer-events:none;';
    fC.width=window.innerWidth; fC.height=window.innerHeight;
    document.body.appendChild(fC);
    const fc=fC.getContext('2d');
    const pal=['255,215,0','255,255,255','180,220,255','255,180,100','200,255,200','255,160,160'];
    let particles=[];

    for(let b=0;b<burstCount;b++){
      const bx=cx!=null?cx+(Math.random()-0.5)*140:Math.random()*fC.width;
      const by=cy!=null?cy+(Math.random()-0.5)*90:Math.random()*fC.height*0.6;
      const col=pal[Math.floor(Math.random()*pal.length)];
      for(let i=0;i<75;i++){
        const ang=(Math.PI*2/75)*i, speed=1.8+Math.random()*5;
        particles.push({
          x:bx,y:by,vx:Math.cos(ang)*speed,vy:Math.sin(ang)*speed,
          life:1,col,r:Math.random()*2+0.8,trail:[]
        });
      }
    }

    function drawFW(){
      fc.clearRect(0,0,fC.width,fC.height);
      particles=particles.filter(p=>p.life>0.01);
      if(!particles.length){fC.remove();return;}
      particles.forEach(p=>{
        p.trail.push({x:p.x,y:p.y});
        if(p.trail.length>6)p.trail.shift();
        p.trail.forEach((t,i)=>{
          fc.beginPath();
          fc.arc(t.x,t.y,p.r*(i/p.trail.length)*0.5,0,Math.PI*2);
          fc.fillStyle=`rgba(${p.col},${(p.life*i/p.trail.length*0.4).toFixed(2)})`;
          fc.fill();
        });
        fc.beginPath();fc.arc(p.x,p.y,p.r,0,Math.PI*2);
        fc.fillStyle=`rgba(${p.col},${p.life.toFixed(2)})`;fc.fill();
        p.life-=0.015; p.x+=p.vx; p.y+=p.vy; p.vy+=0.06; p.vx*=0.986;
      });
      requestAnimationFrame(drawFW);
    }
    drawFW();
  };


  /* ════════════════════════════════════
     5. METEOR SHOWER HELPER
  ════════════════════════════════════ */
  window.launchMeteors = function(count) {
    count = count||8;
    const mC=document.createElement('canvas');
    mC.style.cssText='position:fixed;inset:0;z-index:7000;pointer-events:none;';
    mC.width=window.innerWidth; mC.height=window.innerHeight;
    document.body.appendChild(mC);
    const mc=mC.getContext('2d');
    const meteors=[];

    for(let i=0;i<count;i++){
      meteors.push({
        x: Math.random()*mC.width+200,
        y: -20-Math.random()*160,
        vx:-(4+Math.random()*4.5),
        vy: 3+Math.random()*3,
        len:50+Math.random()*70,
        life:1,
        delay:i*0.13,
        col: Math.random()>0.5?'255,255,255':'255,235,180'
      });
    }

    let elapsed=0;
    function drawM(){
      elapsed+=0.016;
      mc.clearRect(0,0,mC.width,mC.height);
      let any=false;
      meteors.forEach(m=>{
        if(elapsed<m.delay||m.life<=0)return;
        m.life-=0.0065; m.x+=m.vx; m.y+=m.vy;
        const gr=mc.createLinearGradient(m.x,m.y,m.x-m.vx*(m.len/5),m.y-m.vy*(m.len/5));
        gr.addColorStop(0,`rgba(${m.col},${m.life.toFixed(2)})`);
        gr.addColorStop(0.4,`rgba(255,215,0,${(m.life*0.4).toFixed(2)})`);
        gr.addColorStop(1,'rgba(255,255,255,0)');
        mc.beginPath();
        mc.moveTo(m.x,m.y);
        mc.lineTo(m.x-m.vx*(m.len/5),m.y-m.vy*(m.len/5));
        mc.strokeStyle=gr; mc.lineWidth=2; mc.lineCap='round'; mc.stroke();
        any=true;
      });
      if(any)requestAnimationFrame(drawM);
      else mC.remove();
    }
    drawM();
  };


  /* ════════════════════════════════════
     6. CONTINUOUS AUTO METEOR SHOWER
     Runs every 7 seconds as long as the page is open
  ════════════════════════════════════ */
  // Start first batch after a short delay (after intro dismissed)
  // Interval stored globally so main.js can clear it if needed
  window._meteorInterval = null;

  window.startAutoMeteors = function() {
    // Fire immediately once
    if (window.launchMeteors) window.launchMeteors(7);
    // Then keep firing every 7s
    if (!window._meteorInterval) {
      window._meteorInterval = setInterval(() => {
        if (window.launchMeteors) window.launchMeteors(5 + Math.floor(Math.random()*4));
      }, 7000);
    }
  };

})();
