/*
 * The Atelier — interactions
 * 1. Lenis smooth scrolling (synced with GSAP)
 * 2. "The Silk Field" — hand-written Three.js background
 * 3. Custom magnetic cursor
 * 4. Mobile menu
 * 5. Project placeholders
 * 6. Hero entry, reveals, horizontal gallery (desktop) / swipe (mobile)
 * 7. Handwritten marks — draw-on effect
 *
 * Every animation respects prefers-reduced-motion.
 */

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------------
 * 1. Lenis — smooth scrolling
 * --------------------------------------------------------------- */

let lenis = null;

if (!reducedMotion) {
  lenis = new Lenis({
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#' || link.closest('#mobile-menu')) return; // menu handles its own
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: -40, duration: 1.4 });
    else target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ---------------------------------------------------------------
 * 2. The Silk Field — hand-written Three.js background
 *
 * A curtain of horizontal threads of light, displaced by layered
 * sine waves, that gently part around the cursor. Drifting ember
 * particles add depth. Fog fades distant threads into the ink.
 * --------------------------------------------------------------- */

(function silkField() {
  const container = document.getElementById('bg-container');
  if (!container) return;

  const isSmall = window.matchMedia('(max-width: 768px)').matches;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0c, 0.05);

  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, 14);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  container.appendChild(renderer.domElement);

  const BONE  = { r: 0.91, g: 0.89, b: 0.86 };
  const EMBER = { r: 1.00, g: 0.36, b: 0.12 };

  const LINES = isSmall ? 36 : 64;
  const SEGMENTS = isSmall ? 90 : 130;
  const group = new THREE.Group();
  scene.add(group);

  const lines = [];
  for (let i = 0; i < LINES; i++) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SEGMENTS * 3), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(SEGMENTS * 3), 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const line = new THREE.Line(geometry, material);
    line.userData = {
      z: -6 + (i / LINES) * 12,
      yBase: -6 + (i / LINES) * 12,
      phase: Math.random() * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.3,
      amp: 0.4 + Math.random() * 0.9,
    };
    group.add(line);
    lines.push(line);
  }

  // Drifting ember particles
  const glow = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.4)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();

  const PCOUNT = isSmall ? 60 : 120;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(PCOUNT * 3);
  const pVel = new Float32Array(PCOUNT);
  for (let i = 0; i < PCOUNT; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 40;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 24;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    pVel[i] = 0.004 + Math.random() * 0.01;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.18, map: glow, color: 0xff5c1f,
    transparent: true, opacity: 0.5,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  scene.add(new THREE.Points(pGeo, pMat));

  // Cursor tracking (normalized -1..1, smoothed)
  const mouse = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };
  addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / innerWidth - 0.5) * 2;
    mouse.y = -(e.clientY / innerHeight - 0.5) * 2;
  });

  function updateLine(line, t) {
    const pos = line.geometry.attributes.position.array;
    const col = line.geometry.attributes.color.array;
    const { z, yBase, phase, speed, amp } = line.userData;
    const mx = smooth.x * 16;
    const my = smooth.y * 6;

    for (let s = 0; s < SEGMENTS; s++) {
      const x = -18 + (s / (SEGMENTS - 1)) * 36;
      const wave =
        Math.sin(x * 0.35 + t * speed + phase) * amp * 0.5 +
        Math.sin(x * 0.12 - t * speed * 0.6 + phase * 2) * amp;

      // Threads part around the cursor (gaussian bump)
      const dx = x - mx;
      const dy = yBase - my;
      const push = Math.exp(-(dx * dx + dy * dy) * 0.02) * 1.4;

      pos[s * 3] = x;
      pos[s * 3 + 1] = yBase + wave + push;
      pos[s * 3 + 2] = z;

      // Color: bone in the distance, ember up close / on the crest
      const mix = Math.min(1, Math.max(0, 0.35 + wave * 0.25 + (z + 6) / 12 * 0.45));
      col[s * 3]     = BONE.r + (EMBER.r - BONE.r) * mix;
      col[s * 3 + 1] = BONE.g + (EMBER.g - BONE.g) * mix;
      col[s * 3 + 2] = BONE.b + (EMBER.b - BONE.b) * mix;
    }
    line.geometry.attributes.position.needsUpdate = true;
    line.geometry.attributes.color.needsUpdate = true;
  }

  function render(time) {
    const t = time * 0.001;
    smooth.x += (mouse.x - smooth.x) * 0.05;
    smooth.y += (mouse.y - smooth.y) * 0.05;

    for (const line of lines) updateLine(line, t);

    for (let i = 0; i < PCOUNT; i++) {
      pPos[i * 3 + 1] += pVel[i];
      if (pPos[i * 3 + 1] > 12) pPos[i * 3 + 1] = -12;
    }
    pGeo.attributes.position.needsUpdate = true;

    group.rotation.x += (smooth.y * 0.06 - group.rotation.x) * 0.04;
    group.rotation.y += (smooth.x * 0.1 - group.rotation.y) * 0.04;

    renderer.render(scene, camera);
    if (!reducedMotion) requestAnimationFrame(render);
  }

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  requestAnimationFrame(render);
})();

/* ---------------------------------------------------------------
 * 3. Custom cursor
 * --------------------------------------------------------------- */

(function cursor() {
  const ring = document.querySelector('.cursor-ring');
  const dot = document.querySelector('.cursor-dot');
  if (!ring || !dot || reducedMotion) return;

  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const ringPos = { x: pos.x, y: pos.y };

  addEventListener('mousemove', (e) => {
    pos.x = e.clientX; pos.y = e.clientY;
    gsap.to(dot, { x: pos.x, y: pos.y, duration: 0.1 });
  });

  gsap.ticker.add(() => {
    ringPos.x += (pos.x - ringPos.x) * 0.18;
    ringPos.y += (pos.y - ringPos.y) * 0.18;
    ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
  });

  document.querySelectorAll('[data-hover], a, button').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
  });
})();

/* ---------------------------------------------------------------
 * 4. Mobile menu
 * --------------------------------------------------------------- */

(function mobileMenu() {
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    btn.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (lenis) open ? lenis.stop() : lenis.start();
  };

  btn.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));

  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      setOpen(false);
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      setTimeout(() => {
        if (lenis) lenis.scrollTo(target, { offset: -40, duration: 1.2 });
        else target.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    });
  });
})();

/* ---------------------------------------------------------------
 * 5. Projects — placeholders for now.
 *
 * When a project is ready:
 *   1. Create the sub-folder under work/
 *   2. Set comingSoon: false and href to that folder
 *   3. Add desc + thumb: thumb: 'url("./work/x/thumb.jpg")'
 * --------------------------------------------------------------- */

const projects = [
  { index: '01', title: 'Case Study 01', kind: 'Landing page',     comingSoon: true, href: './work/case-study-01/' },
  { index: '02', title: 'Case Study 02', kind: 'Product showcase', comingSoon: true, href: './work/case-study-02/' },
  { index: '03', title: 'Case Study 03', kind: 'Interactive 3D',   comingSoon: true, href: './work/case-study-03/' },
  { index: '04', title: 'Case Study 04', kind: 'Frontend rebuild', comingSoon: true, href: './work/case-study-04/' },
];

const track = document.getElementById('gallery-track');
track.innerHTML = projects
  .map((p) => {
    if (p.comingSoon) {
      return `
      <div class="placeholder-card">
        <div class="flex items-start justify-between">
          <span class="text-xs uppercase tracking-[0.3em] text-bone/60">${p.kind}</span>
          <span class="rounded-full border border-ember/40 px-2.5 py-0.5 text-xs text-ember">In the studio</span>
        </div>
        <div>
          <h3 class="font-serif text-3xl text-bone/80">${p.title}</h3>
          <p class="mt-2 text-sm text-bone/60">Case study in production — live soon.</p>
        </div>
        <span class="ghost">${p.index}</span>
      </div>`;
    }
    return `
    <a href="${p.href}" data-hover class="gallery-card">
      <div class="thumb" style="background: ${p.thumb}"></div>
      <div class="meta">
        <p class="text-xs uppercase tracking-[0.3em] text-bone/60">${p.kind}</p>
        <h3 class="mt-3 font-serif text-3xl text-bone">${p.title}</h3>
        <p class="mt-2 text-sm text-bone/70">${p.desc}</p>
      </div>
    </a>`;
  })
  .join('');

/* ---------------------------------------------------------------
 * 6. Animations
 * --------------------------------------------------------------- */

if (!reducedMotion) {
  // Hero entry — headline masks, portrait, then intro copy
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.to('.eyebrow', { opacity: 1, duration: 1, delay: 0.3 })
    .to('.line-mask > span', { y: '0%', duration: 1.4, stagger: 0.12 }, 0.4)
    .from('.portrait', { opacity: 0, scale: 0.92, y: 24, duration: 1.2, ease: 'power3.out' }, 0.9)
    .from('.hero-intro p, .hero-intro .flex-wrap', { opacity: 0, y: 24, duration: 1, stagger: 0.15 }, 1.2);

  // Scroll reveals (skip marquee — it has its own animation)
  document.querySelectorAll('section > div, section > .mx-auto').forEach((el) => {
    if (el.closest('#top') || el.closest('#gallery-wrap') || el.classList.contains('marquee')) return;
    el.classList.add('reveal');
  });
  document.querySelectorAll('.reveal').forEach((el) => {
    ScrollTrigger.create({
      trigger: el, start: 'top 85%',
      onEnter: () => el.classList.add('is-visible'),
    });
  });

  // Horizontal pinned gallery — desktop only.
  // Below 769px the CSS turns the track into a native swipe carousel.
  gsap.matchMedia().add('(min-width: 769px)', () => {
    const wrap = document.getElementById('gallery-wrap');
    const trackEl = document.getElementById('gallery-track');
    const distance = () => trackEl.scrollWidth - innerWidth;

    gsap.to(trackEl, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: wrap, start: 'top top',
        end: () => `+=${distance()}`,
        pin: true, scrub: 1, invalidateOnRefresh: true,
      },
    });
  });
}

/* ---------------------------------------------------------------
 * 7. Handwritten marks — draw themselves on as they enter view
 * --------------------------------------------------------------- */

document.querySelectorAll('.mark').forEach((svg) => {
  const paths = svg.querySelectorAll('path');

   paths.forEach((p) => {
    const len = p.getTotalLength() + 8; // small overshoot: guarantees full paint
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = reducedMotion ? 0 : len;
  });

  if (reducedMotion) return;

  ScrollTrigger.create({
    trigger: svg,
    start: 'top 90%',
    once: true,
    onEnter: () => {
      paths.forEach((p, i) => {
        gsap.to(p, { strokeDashoffset: 0, duration: 0.9, delay: i * 0.25, ease: 'power2.inOut' });
      });
    },
  });
});

// Fade the handwritten notes in with a slight lift
document.querySelectorAll('.hand-anim').forEach((el) => {
  if (reducedMotion) return;
  gsap.from(el, {
    opacity: 0,
    y: 12,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 90%' },
  });
});

/* ---------------------------------------------------------------
 * 8. Reduced-motion fallback
 * --------------------------------------------------------------- */

if (reducedMotion) {
  document.querySelectorAll('.line-mask > span').forEach((s) => (s.style.transform = 'translateY(0)'));
  document.querySelectorAll('.eyebrow').forEach((e) => (e.style.opacity = '1'));
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
}