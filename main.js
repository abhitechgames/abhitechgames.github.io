// =============================================
//  AbhiTechGames - Main JS
//  Particles - Scroll - Counters - Animations
// =============================================

(function() {
  'use strict';

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive: true });

  hamburger && hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  /* ---- Nav links close on click ---- */
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* =============================================
     SECTION 1: PARTICLE CANVAS
     ============================================= */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const aboutLogo = document.getElementById('aboutLogo');
    let W, H, particles = [], mouse = { x: -999, y: -999, down: false };
    const NUM_PARTICLES = 26;
    const palette = [[255,255,255]];

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    window.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }, { passive: true });
    window.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });
    window.addEventListener('mousedown', () => { mouse.down = true; });
    window.addEventListener('mouseup', () => { mouse.down = false; });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 2.5 + 0.5;
        this.baseR = this.r;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4 - 0.1;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.baseAlpha = this.alpha;
        this.twinkle = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.twinkle += this.twinkleSpeed;
        this.alpha = this.baseAlpha * (0.6 + 0.4 * Math.sin(this.twinkle));

        // Mouse repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = mouse.down ? 190 : 120;
        if (dist > 0 && dist < radius) {
          const force = (radius - dist) / radius;
          const pull = mouse.down ? -1.8 : 2.8;
          this.x += dx / dist * force * pull;
          this.y += dy / dist * force * pull;
          this.r = this.baseR * (1 + force * (mouse.down ? 3.2 : 1.8));
          this.alpha = Math.min(1, this.baseAlpha * (1.4 + force));
        } else {
          this.r = this.baseR;
        }

        if (this.x < -10) this.x = W + 10;
        if (this.x > W + 10) this.x = -10;
        if (this.y < -10) this.y = H + 10;
        if (this.y > H + 10) this.y = -10;
      }
      draw() {
        const [cr, cg, cb] = this.color;
        const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 6);
        glow.addColorStop(0, `rgba(${cr},${cg},${cb},${this.alpha * 0.45})`);
        glow.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${this.alpha})`;
        ctx.fill();
      }
    }

    // Connections
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    for (let i = 0; i < NUM_PARTICLES; i++) particles.push(new Particle());
    function burstAt(clientX, clientY) {
      const r = canvas.getBoundingClientRect();
      const x = clientX - r.left;
      const y = clientY - r.top;
      for (let i = 0; i < 10; i++) {
        const p = new Particle();
        const a = Math.random() * Math.PI * 2;
        const speed = 1.4 + Math.random() * 5;
        p.x = x;
        p.y = y;
        p.vx = Math.cos(a) * speed;
        p.vy = Math.sin(a) * speed;
        p.r = p.baseR = 1.8 + Math.random() * 3.8;
        p.alpha = p.baseAlpha = 0.95;
        particles.push(p);
      }
      particles = particles.slice(-60);
    }

    function logoShockwave(clientX, clientY) {
      for (let i = 0; i < 3; i++) {
        const wave = document.createElement('span');
        wave.className = 'logo-click-wave';
        wave.style.left = `${clientX}px`;
        wave.style.top = `${clientY}px`;
        wave.style.animationDelay = `${i * 110}ms`;
        document.body.appendChild(wave);
        wave.addEventListener('animationend', () => wave.remove(), { once: true });
      }

      for (let i = 0; i < 18; i++) {
        const spark = document.createElement('span');
        const angle = Math.random() * Math.PI * 2;
        const distance = 70 + Math.random() * 150;
        spark.className = 'logo-click-spark';
        spark.style.left = `${clientX}px`;
        spark.style.top = `${clientY}px`;
        spark.style.setProperty('--spark-x', `${Math.cos(angle) * distance}px`);
        spark.style.setProperty('--spark-y', `${Math.sin(angle) * distance}px`);
        spark.style.animationDelay = `${Math.random() * 120}ms`;
        document.body.appendChild(spark);
        spark.addEventListener('animationend', () => spark.remove(), { once: true });
      }

      for (let i = 0; i < 14; i++) {
        const orb = document.createElement('span');
        const angle = (Math.PI * 2 / 14) * i + Math.random() * 0.28;
        const distance = 48 + Math.random() * 110;
        const size = 6 + Math.random() * 14;
        orb.className = 'logo-click-orb';
        orb.style.left = `${clientX}px`;
        orb.style.top = `${clientY}px`;
        orb.style.setProperty('--orb-x', `${Math.cos(angle) * distance}px`);
        orb.style.setProperty('--orb-y', `${Math.sin(angle) * distance}px`);
        orb.style.setProperty('--orb-size', `${size}px`);
        orb.style.animationDelay = `${Math.random() * 90}ms`;
        document.body.appendChild(orb);
        orb.addEventListener('animationend', () => orb.remove(), { once: true });
      }
    }

    aboutLogo && aboutLogo.addEventListener('click', e => {
      const logoRect = aboutLogo.getBoundingClientRect();
      const centerX = logoRect.left + logoRect.width / 2;
      const centerY = logoRect.top + logoRect.height / 2;
      burstAt(centerX, centerY);
      logoShockwave(centerX, centerY);
      aboutLogo.parentElement && aboutLogo.parentElement.classList.add('is-clicking');
      window.setTimeout(() => {
        aboutLogo.parentElement && aboutLogo.parentElement.classList.remove('is-clicking');
      }, 900);
      aboutLogo.animate([
        { transform: 'scale(1) rotate(0deg)', filter: 'drop-shadow(0 0 24px rgba(255,255,255,0.35))' },
        { transform: 'scale(1.18) rotate(5deg)', filter: 'drop-shadow(0 0 70px rgba(255,255,255,0.95))' },
        { transform: 'scale(1.04) rotate(-2deg)', filter: 'drop-shadow(0 0 44px rgba(255,255,255,0.7))' },
        { transform: 'scale(1) rotate(0deg)', filter: 'drop-shadow(0 0 24px rgba(255,255,255,0.35))' }
      ], { duration: 760, easing: 'cubic-bezier(.2,.8,.2,1)' });
    });

    function animateParticles() {
      ctx.clearRect(0, 0, W, H);
      drawConnections();
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* =============================================
     WARBOUND: ember-like medieval particles
     ============================================= */
  const wbParticles = document.getElementById('warboundParticles');
  if (wbParticles) {
    const NUM = 50;
    for (let i = 0; i < NUM; i++) {
      const el = document.createElement('div');
      el.style.cssText = `
        position:absolute;
        border-radius:50%;
        pointer-events:none;
        background:radial-gradient(circle, rgba(255,${120 + Math.floor(Math.random()*80)},0,0.9) 0%, transparent 70%);
        width:${2 + Math.random() * 4}px;
        height:${2 + Math.random() * 4}px;
        left:${Math.random() * 100}%;
        top:${100 + Math.random() * 10}%;
        animation: wbEmber ${5 + Math.random() * 10}s ${Math.random() * 10}s ease-in infinite;
        opacity:0;
      `;
      wbParticles.appendChild(el);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes wbEmber {
        0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
        10%  { opacity: 0.8; }
        80%  { opacity: 0.4; transform: translateY(-80vh) translateX(${Math.random() > 0.5 ? '' : '-'}${20 + Math.random() * 60}px) scale(0.5); }
        100% { opacity: 0; transform: translateY(-100vh) translateX(0); }
      }
    `;
    document.head.appendChild(style);
  }

  /* =============================================
     PAPERLY: Plane parallax on scroll
     ============================================= */
  const paperlySection = document.getElementById('paperly');
  const planeEl = document.getElementById('paperlyPlane');
  const planeImg = document.getElementById('paperlyPlaneImg');
  let planeActive = false;
  let planeProgress = 0;

  function updatePlane() {
    if (!paperlySection || !planeEl) return;
    const rect = paperlySection.getBoundingClientRect();
    const sectionH = paperlySection.offsetHeight;
    const viewH = window.innerHeight;

    if (rect.top < viewH && rect.bottom > 0) {
      planeActive = true;
      // progress 0 (section enters) to 1 (section exits)
      const progress = Math.max(0, Math.min(1, (viewH - rect.top) / (sectionH + viewH)));
      planeProgress = progress;

      // Hold near center and shrink into the scene as the section scrolls.
      const depth = progress;
      const xPos = -55 + Math.sin(progress * Math.PI * 1.2) * 5;
      const yPos = 24 + progress * 92;
      const rotation = -4 + progress * 8;
      const scale = Math.max(0.18, 1.34 - progress * 1.08);
      const z = progress * -900;
      const opacity = Math.max(0.45, 1 - progress * 0.34);

      planeEl.style.transform = `translate3d(${xPos}%, ${yPos}px, ${z}px) rotateX(${18 + depth * 42}deg) rotateY(${depth * 8}deg) rotateZ(${rotation}deg) scale(${scale})`;
      planeEl.style.opacity = opacity;
    }
  }

  /* =============================================
     LASER TANKS: parallax BG
     ============================================= */
  const ltHero = document.getElementById('ltHeroParallax');
  const ltSection = document.getElementById('lasertanks');

  /* Warbound BG parallax */
  const wbBgImg = document.getElementById('warboundBgParallax');
  const wbSection = document.getElementById('warbound');

  function handleParallax() {
    if (wbBgImg && wbSection) {
      const rect = wbSection.getBoundingClientRect();
      const progress = -rect.top / (wbSection.offsetHeight + window.innerHeight);
      wbBgImg.style.transform = `scale(0.82) translateY(${progress * 24}px)`;
    }
    if (ltHero && ltSection) {
      const rect = ltSection.getBoundingClientRect();
      const progress = -rect.top / (ltSection.offsetHeight + window.innerHeight);
      ltHero.style.transform = `scale(1.15) translateY(${progress * 80}px)`;
    }
    updatePlane();
  }

  window.addEventListener('scroll', handleParallax, { passive: true });
  handleParallax();

  /* =============================================
     PIXEL PARTICLES for Laser Tanks section
     ============================================= */
  const pixelPart = document.getElementById('pixelParticles');
  if (pixelPart) {
    const colors = ['#00f5d4', '#31a8ff', '#77f8ff', '#006dff'];
    for (let i = 0; i < 30; i++) {
      const el = document.createElement('div');
      const size = 2 + Math.floor(Math.random() * 4);
      const color = colors[Math.floor(Math.random() * colors.length)];
      el.style.cssText = `
        position:absolute;
        width:${size}px; height:${size}px;
        background:${color};
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        image-rendering:pixelated;
        animation: pixFloat ${4 + Math.random() * 8}s ${Math.random() * 6}s ease-in-out infinite;
        opacity:0;
      `;
      pixelPart.appendChild(el);
    }
    const ps = document.createElement('style');
    ps.textContent = `
      @keyframes pixFloat {
        0%,100% { opacity:0; transform:translateY(0) scale(1); }
        20%,80% { opacity:0.7; }
        50% { opacity:0.9; transform:translateY(-40px) scale(1.5); }
      }
    `;
    document.head.appendChild(ps);
  }

  /* =============================================
     PARTNERS: duplicate items for infinite scroll
     ============================================= */
  const partnersInner = document.getElementById('partnersInner');
  if (partnersInner) {
    const original = partnersInner.innerHTML;
    partnersInner.innerHTML = original + original; // duplicate for seamless loop
  }

  /* =============================================
     ANIMATE ON SCROLL (IntersectionObserver)
     ============================================= */
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Warbound content elements
  document.querySelectorAll('.warbound-badge-row, .warbound-title, .warbound-tagline, .warbound-desc, .warbound-coming-soon, .warbound-trailer-wrap, .warbound-cta-row').forEach(el => {
    observer.observe(el);
  });

  // Generic scroll reveal
  document.querySelectorAll('.anim-in').forEach(el => observer.observe(el));

  /* =============================================
     COUNTER ANIMATION
     ============================================= */
  function animateCounter(el, target, duration = 2000, suffix = '') {
    let start = 0;
    let startTime = null;
    const isLarge = target >= 10000;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      const current = Math.floor(eased * target);

      // Format
      let display;
      if (target >= 1000000) {
        display = (current / 1000000).toFixed(current >= 1000000 ? 0 : 1) + 'M+';
      } else if (target >= 1000) {
        display = (current / 1000).toFixed(current >= 1000 ? 0 : 1) + 'K+';
      } else {
        display = current + '+';
      }
      el.textContent = display;

      if (progress < 1) requestAnimationFrame(step);
      else {
        // Final formatted value
        if (target >= 1000000) el.textContent = (target / 1000000) + 'M+';
        else if (target >= 1000) el.textContent = (target / 1000) + 'K+';
        else el.textContent = target + '+';
      }
    }
    requestAnimationFrame(step);
  }

  /* Counter observer */
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter') || '0');
        const dataBig = parseInt(el.getAttribute('data-target') || '0');

        if (dataBig) {
          animateCounter(el, dataBig);
        } else {
          // For laser tanks pixel counters with data-counter (in K)
          const suffixEl = el.nextElementSibling;
          let finalNum = target;
          // animate from 0 to target, display raw number then suffix handles it
          let startTime = null;
          function stepK(ts) {
            if (!startTime) startTime = ts;
            const p = Math.min((ts - startTime) / 2000, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(eased * finalNum);
            if (p < 1) requestAnimationFrame(stepK);
            else el.textContent = finalNum;
          }
          requestAnimationFrame(stepK);
        }
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target], [data-counter]').forEach(el => counterObs.observe(el));

  /* =============================================
     GLITCH effect occasional trigger
     ============================================= */
  const glitchEl = document.querySelector('.glitch');
  if (glitchEl) {
    setInterval(() => {
      glitchEl.style.animation = 'none';
      void glitchEl.offsetWidth;
      glitchEl.style.animation = '';
    }, 8000);
  }

  /* =============================================
     SMOOTH reveal for section content (stagger)
     ============================================= */
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll('.anim-child');
        children.forEach((child, i) => {
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, i * 120);
        });
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.anim-children').forEach(el => sectionObserver.observe(el));

  /* Stagger child defaults */
  document.querySelectorAll('.anim-child').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  /* =============================================
     PAPERLY LOW-POLY BACKGROUND TRIANGLES (canvas)
     ============================================= */
  const paperlySection2 = document.getElementById('paperly');
  if (paperlySection2) {
    const lpCanvas = document.createElement('canvas');
    lpCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.32;';
    paperlySection2.querySelector('.paperly-sky').appendChild(lpCanvas);

    const lctx = lpCanvas.getContext('2d');
    let lW, lH;

    function resizeLP() {
      lW = lpCanvas.width = lpCanvas.offsetWidth;
      lH = lpCanvas.height = lpCanvas.offsetHeight;
      drawLowPoly();
    }

    function randCol() {
      const palettes = [
        [135,206,235], [100,180,220], [70,160,200],
        [180,230,255], [220,245,255], [90,180,140],
        [110,200,160], [255,220,130]
      ];
      return palettes[Math.floor(Math.random() * palettes.length)];
    }

    function drawLowPoly() {
      if (!lW || !lH) return;
      lctx.clearRect(0, 0, lW, lH);
      const bands = 7;
      for (let b = 0; b < bands; b++) {
        const baseY = lH * (0.18 + b * 0.13);
        const [r1,g1,b1] = randCol();
        lctx.beginPath();
        lctx.moveTo(-80, baseY + Math.random() * 70);
        for (let x = -80; x <= lW + 120; x += lW / 5) {
          lctx.lineTo(x, baseY + Math.sin((x / lW) * Math.PI * 2 + b) * (32 + b * 4) + (Math.random() - 0.5) * 50);
        }
        lctx.lineTo(lW + 120, lH + 120);
        lctx.lineTo(-80, lH + 120);
        lctx.closePath();
        const grd = lctx.createLinearGradient(0, baseY, 0, lH);
        grd.addColorStop(0, `rgba(${r1},${g1},${b1},${0.09 + b * 0.012})`);
        grd.addColorStop(1, 'rgba(255,255,255,0)');
        lctx.fillStyle = grd;
        lctx.fill();
      }
    }

    resizeLP();
    window.addEventListener('resize', resizeLP, { passive: true });
  }

  /* =============================================
     PIXEL RAIN for Laser Tanks (occasional bursts)
     ============================================= */
  const ltSect = document.getElementById('lasertanks');
  if (ltSect) {
    const ltCanvas = document.createElement('canvas');
    ltCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:0.35;';
    ltSect.querySelector('.pixel-bg').appendChild(ltCanvas);
    const ltCtx = ltCanvas.getContext('2d');
    let ltW, ltH;
    function resizeLT() {
      ltW = ltCanvas.width = ltCanvas.offsetWidth;
      ltH = ltCanvas.height = ltCanvas.offsetHeight;
    }
    resizeLT();
    window.addEventListener('resize', resizeLT, { passive: true });

    const drops = Array.from({ length: 30 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 600,
      len: 10 + Math.random() * 30,
      speed: 2 + Math.random() * 4,
      color: ['#00f5d4', '#31a8ff', '#77f8ff'][Math.floor(Math.random() * 3)],
      alpha: Math.random() * 0.5 + 0.2
    }));

    let ltRunning = false;
    const ltObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        ltRunning = e.isIntersecting;
        if (ltRunning) animateLT();
      });
    }, { threshold: 0.1 });
    ltObs.observe(ltSect);

    function animateLT() {
      if (!ltRunning) return;
      ltCtx.clearRect(0, 0, ltW, ltH);
      drops.forEach(d => {
        ltCtx.beginPath();
        // Pixelated: draw square segments
        for (let i = 0; i < d.len; i += 4) {
          const a = d.alpha * (1 - i / d.len);
          ltCtx.fillStyle = d.color.replace(')', `,${a})`).replace('rgb', 'rgba');
          ltCtx.fillRect(d.x, d.y - i, 2, 2);
        }
        d.y += d.speed;
        if (d.y > ltH + 50) {
          d.y = -50;
          d.x = Math.random() * ltW;
        }
      });
      requestAnimationFrame(animateLT);
    }
  }

  /* =============================================
     WARBOUND: falling sparks from embers
     ============================================= */
  function initWarboundCanvas() {
    const wbSect = document.getElementById('warbound');
    if (!wbSect) return;
    const wbC = document.createElement('canvas');
    wbC.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;';
    wbSect.appendChild(wbC);
    const wctx = wbC.getContext('2d');
    let wW, wH;
    function resizeWB() {
      wW = wbC.width = wbC.offsetWidth;
      wH = wbC.height = wbC.offsetHeight;
    }
    resizeWB();
    window.addEventListener('resize', resizeWB, { passive: true });

    const sparks = Array.from({ length: 40 }, () => createSpark());
    function createSpark() {
      return {
        x: Math.random() * (wW || 1000),
        y: (wH || 600) + Math.random() * 100,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(1 + Math.random() * 3),
        r: 1 + Math.random() * 2,
        life: 0,
        maxLife: 60 + Math.random() * 120,
        hue: 20 + Math.random() * 40
      };
    }

    let wbRunning = false;
    const wbObs = new IntersectionObserver(e => {
      e.forEach(en => {
        wbRunning = en.isIntersecting;
        if (wbRunning) animateWB();
      });
    }, { threshold: 0.05 });
    wbObs.observe(wbSect);

    function animateWB() {
      if (!wbRunning) return;
      wctx.clearRect(0, 0, wW, wH);
      sparks.forEach((s, i) => {
        s.x += s.vx;
        s.y += s.vy;
        s.vy *= 0.99;
        s.vx *= 0.998;
        s.life++;
        const lifeRatio = s.life / s.maxLife;
        const alpha = Math.sin(lifeRatio * Math.PI) * 0.8;
        wctx.beginPath();
        wctx.arc(s.x, s.y, s.r * (1 - lifeRatio * 0.5), 0, Math.PI * 2);
        wctx.fillStyle = `hsla(${s.hue}, 100%, 70%, ${alpha})`;
        wctx.fill();
        if (s.life >= s.maxLife || s.y < -10) {
          sparks[i] = createSpark();
          sparks[i].x = Math.random() * wW;
        }
      });
      requestAnimationFrame(animateWB);
    }
  }
  initWarboundCanvas();

  /* =============================================
     SCROLL-TRIGGERED: section entrance
     ============================================= */
  const allSections = document.querySelectorAll('section');
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-in');
      }
    });
  }, { threshold: 0.05 });
  allSections.forEach(s => {
    s.classList.add('section-hidden');
    secObs.observe(s);
  });

  // Inject section transition styles
  const secStyle = document.createElement('style');
  secStyle.textContent = `
    .section-hidden { opacity: 0; }
    .section-in { opacity: 1; transition: opacity 0.6s ease; }
    #about { opacity: 1; }
  `;
  document.head.appendChild(secStyle);

  /* =============================================
     TRAILER THUMBNAIL PLAY OVERLAY
     ============================================= */
  document.querySelectorAll('.game-trailer').forEach(vid => {
    vid.addEventListener('play', () => {
      vid.closest('.trailer-border-medieval, .trailer-border-sky, .trailer-border-pixel')
        ?.querySelectorAll('.trailer-corner, .pixel-corner-tl, .pixel-corner-tr, .pixel-corner-bl, .pixel-corner-br')
        .forEach(c => c.style.opacity = '0.5');
    });
    vid.addEventListener('pause', () => {
      vid.closest('.trailer-border-medieval, .trailer-border-sky, .trailer-border-pixel')
        ?.querySelectorAll('.trailer-corner, .pixel-corner-tl, .pixel-corner-tr, .pixel-corner-bl, .pixel-corner-br')
        .forEach(c => c.style.opacity = '1');
    });
  });

  /* =============================================
     GAME ICON hover trail (sparkle)
     ============================================= */
  document.querySelectorAll('.game-icon-link').forEach(link => {
    link.addEventListener('mouseenter', (e) => {
      for (let i = 0; i < 6; i++) {
        const spark = document.createElement('div');
        spark.style.cssText = `
          position:fixed;
          width:4px; height:4px;
          border-radius:50%;
          background:#c9a84c;
          pointer-events:none;
          z-index:9999;
          left:${e.clientX + (Math.random()-0.5)*40}px;
          top:${e.clientY + (Math.random()-0.5)*40}px;
          animation: sparkFly 0.6s forwards;
        `;
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 600);
      }
    });
  });
  const sparkStyle = document.createElement('style');
  sparkStyle.textContent = `
    @keyframes sparkFly {
      0% { opacity:1; transform:scale(1) translate(0,0); }
      100% { opacity:0; transform:scale(0) translate(${(Math.random()-0.5)*60}px,${-30-Math.random()*30}px); }
    }
  `;
  document.head.appendChild(sparkStyle);

  /* =============================================
     ACTIVE NAV HIGHLIGHT on scroll
     ============================================= */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navAnchors.forEach(a => {
          a.classList.toggle('nav-active', a.getAttribute('href') === id);
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });

  sections.forEach(s => activeObs.observe(s));

  const navActiveStyle = document.createElement('style');
  navActiveStyle.textContent = `.nav-active { color:#fff!important; } .nav-active::after { transform:scaleX(1)!important; }`;
  document.head.appendChild(navActiveStyle);

  console.log('AbhiTechGames - Studio Website Loaded');
})();
