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
    nav.style.background = 'rgba(11,14,20,0.85)';
  } else {
    nav.style.background = 'rgba(11,14,20,0.5)';
  }
}, { passive: true });

// ============================================================
// HERO CANVAS — satellite / pixel grid that sharpens on scroll
// (signature "resolution reveal" effect)
// ============================================================
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
let cellSize = 26;
let noiseLevel = 1; // 1 = max noise/blur, 0 = fully resolved

function resizeCanvas() {
  canvas.width = canvas.offsetWidth * devicePixelRatio;
  canvas.height = canvas.offsetHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawGrid() {
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  ctx.clearRect(0, 0, w, h);

  const cols = Math.ceil(w / cellSize) + 1;
  const rows = Math.ceil(h / cellSize) + 1;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // base pseudo-random pattern (deterministic per cell)
      const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const base = seed - Math.floor(seed); // 0..1

      // random flicker mixed in proportionally to noiseLevel
      const flicker = (Math.random() - 0.5) * noiseLevel;
      const v = Math.min(1, Math.max(0, base * (1 - noiseLevel * 0.5) + flicker));

      if (v > 0.86) {
        const alpha = (v - 0.86) / 0.14;
        ctx.fillStyle = `rgba(79, 216, 196, ${alpha * (0.5 + (1 - noiseLevel) * 0.5)})`;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize - 2, cellSize - 2);
      } else if (v > 0.8 && noiseLevel > 0.05) {
        ctx.fillStyle = `rgba(255, 180, 84, ${(v - 0.8) * 2 * noiseLevel})`;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize - 2, cellSize - 2);
      }
    }
  }
}

let rafId;
function loop() {
  drawGrid();
  rafId = requestAnimationFrame(loop);
}
if (!reduceMotion) {
  loop();
} else {
  noiseLevel = 0.15;
  drawGrid();
}

// ============================================================
// RESOLUTION REVEAL — hero text sharpens + PSNR ticks up on load
// ============================================================
const resolveEls = document.querySelectorAll('[data-resolve]');
const psnrEl = document.getElementById('psnrValue');
const readoutFill = document.getElementById('readoutFill');

function runResolveSequence() {
  const targetPSNR = 31.6;
  const startPSNR = 18.2;

  if (window.gsap) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to(resolveEls, {
        filter: 'blur(0px)',
        opacity: 1,
        duration: 1.4,
        stagger: 0.12
      }, 0.2)
      .to({}, {
        duration: 1.6,
        onUpdate: function () {
          const p = this.progress();
          noiseLevel = 1 - p;
          const currentPSNR = startPSNR + (targetPSNR - startPSNR) * p;
          psnrEl.textContent = currentPSNR.toFixed(1);
          readoutFill.style.width = (22 + p * 78) + '%';
        }
      }, 0.2);
  } else {
    resolveEls.forEach(el => { el.style.filter = 'blur(0px)'; el.style.opacity = 1; });
    noiseLevel = 0;
    psnrEl.textContent = targetPSNR.toFixed(1);
    readoutFill.style.width = '100%';
  }
}

if (reduceMotion) {
  resolveEls.forEach(el => { el.style.filter = 'none'; el.style.opacity = 1; });
  psnrEl.textContent = '31.6';
  readoutFill.style.width = '100%';
} else {
  window.addEventListener('DOMContentLoaded', runResolveSequence);
  // fallback in case DOMContentLoaded already fired
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
