(function(){
  // ==== AYARLAR ====
  const showOnlyInOctober = true;     
  const showOncePerDay    = true;     
  const forceShow         = false;    
  const couponCode        = 'EKIM10'; 

  // ==== TARİH KONTROL ====
  const now = new Date();
  const isOctober = now.getMonth() === 9; // 0=Ocak, 9=Ekim
  if (showOnlyInOctober && !isOctober && !forceShow) return;

  // ==== GÜNLÜK FREKANS ====
  const lsKey = 'october_discount_last_shown';
  if (showOncePerDay && !forceShow) {
    const last = localStorage.getItem(lsKey);
    const todayKey = now.toISOString().slice(0,10);
    if (last === todayKey) return; // bugün gösterilmiş
    localStorage.setItem(lsKey, todayKey);
  }

  // ==== ELEMANLAR ====
  const overlay = document.getElementById('october-discount-overlay');
  const closeBtn = document.querySelector('.october-close');
  const ctaBtn = document.querySelector('.october-cta');
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');

  function lockScroll(lock){ document.body.style.overflow = lock ? 'hidden' : ''; }

  // ==== MODAL AÇ ====
  function openModal(){
    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden','false');
    lockScroll(true);
    startFireworks();
  }

  // ==== MODAL KAPA ====
  function closeModal(){
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden','true');
    lockScroll(false);
    stopFireworks();
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e)=>{ if(e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

  ctaBtn.addEventListener('click', ()=> {
    window.location.href = '/urunler';
  });

  // ==== HAVAİ FİŞEK ====
  let running = false, particles = [], rafId = null, explodeTimer = null;

  function resizeCanvas(){
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * window.devicePixelRatio);
    canvas.height = Math.floor(rect.height * window.devicePixelRatio);
  }
  window.addEventListener('resize', resizeCanvas);

  function random(min, max){ return Math.random() * (max - min) + min; }

  function makeExplosion(x, y, colorH){
    const count = 70;
    for (let i=0;i<count;i++){
      const angle = (Math.PI*2) * (i/count) + random(-0.15,0.15);
      const speed = random(1.5, 4.2);
      particles.push({
        x, y,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed,
        life: random(40, 70),
        age: 0,
        hue: colorH + random(-10,10),
      });
    }
  }

  function step(){
    if(!running) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (let i=particles.length-1; i>=0; i--){
      const p = particles[i];
      p.age++;
      p.vy += 0.03;
      p.vx *= 0.995; p.vy *= 0.995;
      p.x += p.vx; p.y += p.vy;
      const alpha = Math.max(0, 1 - p.age/p.life);
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2*window.devicePixelRatio, 0, Math.PI*2);
      ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${alpha})`;
      ctx.fill();
      if (p.age >= p.life) particles.splice(i,1);
    }
    rafId = requestAnimationFrame(step);
  }

  function startFireworks(){
    resizeCanvas();
    running = true;
    explodeTimer = setInterval(()=>{
      const w = canvas.width, h = canvas.height;
      makeExplosion(random(w*0.2, w*0.8), random(h*0.2, h*0.6), random(0,360));
    }, 700);
    step();
    const w = canvas.width, h = canvas.height;
    makeExplosion(w*0.3, h*0.5, 30);
    makeExplosion(w*0.7, h*0.35, 200);
  }

  function stopFireworks(){
    running = false;
    particles = [];
    cancelAnimationFrame(rafId);
    clearInterval(explodeTimer);
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', openModal);
  } else {
    openModal();
  }
})();