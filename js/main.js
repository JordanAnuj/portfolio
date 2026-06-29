// ============================================================
// SETUP
// ============================================================
document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================
// MOBILE NAV TOGGLE
// ============================================================
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

navToggle.addEventListener('click', () => {
  const isOpen = navMobile.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// nav background intensifies on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.style.background = 'rgba(237,227,211,0.92)';
  } else {
    nav.style.background = 'rgba(237,227,211,0.6)';
  }
}, { passive: true });

// ============================================================
// HERO CANVAS — static decorative grid background (no animation)
// ============================================================
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
let cellSize = 26;

function resizeCanvas() {
  canvas.width = canvas.offsetWidth * devicePixelRatio;
  canvas.height = canvas.offsetHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  drawGrid();
}

function drawGrid() {
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  ctx.clearRect(0, 0, w, h);

  const cols = Math.ceil(w / cellSize) + 1;
  const rows = Math.ceil(h / cellSize) + 1;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // fixed pattern — same every time, no randomness, no looping
      const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const v = seed - Math.floor(seed);

      if (v > 0.86) {
        const alpha = (v - 0.86) / 0.14;
        ctx.fillStyle = `rgba(181, 85, 44, ${alpha * 0.5})`;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize - 2, cellSize - 2);
      } else if (v > 0.8) {
        ctx.fillStyle = `rgba(107, 115, 83, ${(v - 0.8) * 1.2})`;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize - 2, cellSize - 2);
      }
    }
  }
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ============================================================
// HERO TEXT — one-time fade-in on load (no looping animation)
// ============================================================
const resolveEls = document.querySelectorAll('[data-resolve]');

function runResolveSequence() {
  if (window.gsap) {
    gsap.to(resolveEls, {
      filter: 'blur(0px)',
      opacity: 1,
      duration: 1.2,
      stagger: 0.12,
      ease: 'power3.out'
    });
  } else {
    resolveEls.forEach(el => { el.style.filter = 'blur(0px)'; el.style.opacity = 1; });
  }
}

if (reduceMotion) {
  resolveEls.forEach(el => { el.style.filter = 'none'; el.style.opacity = 1; });
} else {
  window.addEventListener('DOMContentLoaded', runResolveSequence);
  if (document.readyState !== 'loading') runResolveSequence();
}

// ============================================================
// SCROLL REVEALS for sections
// ============================================================
if (window.gsap && window.ScrollTrigger && !reduceMotion) {

  const revealTargets = [
    '.section-label', '.section-title', '.about-text .lead',
    '.stat', '.skill-card', '.timeline-item', '.project-card',
    '.edu-item', '.cert-list li', '.contact-title', '.contact-sub',
    '.contact-email', '.contact-links'
  ];

  revealTargets.forEach(sel => {
    const els = document.querySelectorAll(sel);
    if (!els.length) return;
    gsap.fromTo(els, { opacity: 0, y: 28 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: els[0],
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

} else {
  // ensure content is visible without GSAP
  document.querySelectorAll('.reveal').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}