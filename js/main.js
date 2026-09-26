// Progressive enhancement: all portfolio content is visible without JavaScript.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let reduceMotion = motionPreference.matches;
document.getElementById('year').textContent = new Date().getFullYear();
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
function setMenu(open, restoreFocus = false) {
  navMobile.classList.toggle('open', open);
  navMobile.inert = !open;
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  if (restoreFocus) navToggle.focus();
}
navToggle.addEventListener('click', () => setMenu(navToggle.getAttribute('aria-expanded') !== 'true'));
navMobile.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navMobile.classList.contains('open')) setMenu(false, true);
});
document.addEventListener('click', event => {
  if (!nav.contains(event.target)) setMenu(false);
});
nav.addEventListener('focusout', () => {
  requestAnimationFrame(() => { if (!nav.contains(document.activeElement)) setMenu(false); });
});
window.matchMedia('(min-width: 861px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

const themeToggle = document.getElementById('themeToggle');
function isDarkTheme() { return document.documentElement.dataset.theme === 'dark'; }
function updateThemeLabel() {
  themeToggle.setAttribute('aria-label', isDarkTheme() ? 'Switch to light theme' : 'Switch to dark theme');
}
updateThemeLabel();
themeToggle.addEventListener('click', () => {
  const next = isDarkTheme() ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) { /* Storage may be disabled. */ }
  updateThemeLabel();
  drawGrid();
});

const copyEmail = document.getElementById('copyEmail');
const copyToast = document.getElementById('copyToast');
let toastTimer;
copyEmail.addEventListener('click', async () => {
  const email = document.querySelector('.contact-email').textContent.trim();
  try {
    if (!navigator.clipboard) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(email);
    copyToast.textContent = 'COPIED!';
  } catch (error) {
    copyToast.textContent = 'Select the email to copy';
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('.contact-email'));
    const selection = window.getSelection();
    selection.removeAllRanges(); selection.addRange(range);
  }
  copyToast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => copyToast.classList.remove('show'), 2400);
});

// One scheduled scroll update, with section positions cached outside the scroll path.
const navLinks = [...document.querySelectorAll('.nav-links a, .nav-mobile a[href^="#"]')];
const sections = [...document.querySelectorAll('main > section[id]')];
const scrollProgress = document.getElementById('scrollProgress');
const toTop = document.getElementById('toTop');
let sectionPositions = [], maxScroll = 0, scrollQueued = false;
function measurePage() {
  sectionPositions = sections.map(section => ({ id:section.id, top:section.offsetTop }));
  maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  updateScroll();
}
function updateScroll() {
  scrollQueued = false;
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 40);
  scrollProgress.style.transform = 'scaleX(' + Math.max(0, Math.min(1, maxScroll > 0 ? y / maxScroll : 0)) + ')';
  toTop.classList.toggle('visible', y > 600);
  let current = '';
  sectionPositions.forEach(section => { if (section.top <= y + window.innerHeight * .35) current = section.id; });
  navLinks.forEach(link => {
    const active = link.hash === '#' + current;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); }
}, { passive:true });
toTop.addEventListener('click', () => {
  window.scrollTo({ top:0, behavior:reduceMotion ? 'instant' : 'smooth' });
  document.querySelector('.logo').focus({ preventScroll:true });
});

// Static deterministic resolution grid; redraw only when size or theme changes.
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
let cellSize = 26;

function resizeCanvas() {
  if (!ctx) return;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = canvas.offsetWidth * pixelRatio;
  canvas.height = canvas.offsetHeight * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  drawGrid();
}

function drawGrid() {
  if (!ctx) return;
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  ctx.clearRect(0, 0, w, h);

  // A sampled interference field: coarse cells become finer toward the signal.
  // Purely decorative mathematics, drawn once rather than a continuous particle loop.
  const dark = isDarkTheme();
  const warm = dark ? '208,106,59' : '164,73,38';
  const olive = dark ? '147,160,117' : '89,99,65';
  const centerX = w * .79;
  const centerY = h * .39;
  const radius = Math.min(w * .32, h * .40);
  const step = w < 600 ? 15 : 19;
  for (let y = Math.max(0, centerY - radius); y < centerY + radius; y += step) {
    for (let x = Math.max(0, centerX - radius); x < Math.min(w, centerX + radius); x += step) {
      const dx = (x - centerX) / radius;
      const dy = (y - centerY) / radius;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 1) continue;
      const wave = (Math.sin(distance * 28 - Math.atan2(dy, dx) * 2) + 1) / 2;
      const envelope = Math.pow(1 - distance, .5);
      const size = 2 + wave * (step - 5);
      const alpha = (.12 + wave * .68) * envelope;
      ctx.fillStyle = 'rgba(' + (dy > .15 ? olive : warm) + ',' + alpha + ')';
      ctx.fillRect(x + (step - size) / 2, y + (step - size) / 2, size, size);
    }
  }
}

resizeCanvas();
let resizeQueued = false;
window.addEventListener('resize', () => {
  if (resizeQueued) return;
  resizeQueued = true;
  requestAnimationFrame(() => { resizeQueued = false; resizeCanvas(); measurePage(); });
}, { passive:true });
measurePage();
if (document.fonts) document.fonts.ready.then(() => { resizeCanvas(); measurePage(); });
window.addEventListener('load', measurePage, { once:true });

// Short resolution entrance; all content is readable without the animation library.
if (window.gsap) {
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  const animationContext = gsap.matchMedia();
  animationContext.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.fromTo('[data-resolve]', { opacity:.35, filter:'blur(5px)', y:10 }, {
      opacity:1, filter:'blur(0px)', y:0, duration:.65, stagger:.07,
      ease:'power3.out', clearProps:'filter,opacity,transform'
    });
    gsap.fromTo('.hero-canvas', { opacity:.12, scale:1.04 }, {
      opacity:.8, scale:1, duration:1.1, ease:'power2.out', clearProps:'transform,opacity'
    });
    if (!window.ScrollTrigger) return;
    document.querySelectorAll('.section').forEach(section => {
      const targets = [...section.querySelectorAll('.about-text, .about-stats, .section-label, .section-title, .skill-card, .timeline-item, .project-card, .edu-item, .cert-list, .contact-inner')];
      const groups = targets.filter(el => !targets.some(parent => parent !== el && parent.contains(el)));
      groups.forEach(el => gsap.from(el, {
        y:18, opacity:0, duration:.6, ease:'power2.out', clearProps:'transform,opacity',
        scrollTrigger:{ trigger:el, start:'top 94%', once:true }
      }));
    });
  });
}
motionPreference.addEventListener('change', event => { reduceMotion = event.matches; });
