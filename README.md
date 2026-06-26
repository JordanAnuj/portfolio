# Anuj K Janardhanan — Portfolio

A dark, signal/resolution-themed portfolio site. The hero text and background grid start blurred/noisy and sharpen as the page loads — a nod to the super-resolution work (ESRGAN/SRDiff) in the resume.

## What's inside
```
index.html          → all page content
css/style.css        → all styling (one file, CSS variables at the top)
js/main.js           → resolution-reveal effect + scroll animations
assets/Anuj_Resume.pdf → downloadable résumé (linked from the nav + hero)
```
No build step, no npm install, no framework. Just open `index.html`.

---

## 1. Before you go live — replace the placeholder links

Open `index.html` and search for `href="#"` (4 spots) and swap in your real URLs:

| Where | Find | Replace with |
|---|---|---|
| Project cards (x3) | `View repository →` links | your actual GitHub repo links for WorkSync AI, Moodify, Weekendy |
| Contact section | `LinkedIn` link | your real LinkedIn URL |
| Contact section | `GitHub` link | your GitHub profile URL |
| Contact section | `Credly` link | your Credly profile/badge URL |
| Certifications | `View Credly badge →` (x2) | direct badge links |

Tip in VS Code: press `Ctrl+F`, search `href="#"`, and step through each one with "Replace".

---

## 2. Run it locally (VS Code, Windows)

1. Install **VS Code**: https://code.visualstudio.com
2. Install the **Live Server** extension (by Ritwick Dey) from the Extensions tab (`Ctrl+Shift+X`).
3. Open this folder in VS Code (`File → Open Folder`).
4. Right-click `index.html` → **Open with Live Server**. It opens in your browser and auto-refreshes when you edit files.

---

## 3. Put it on GitHub (free)

1. Install **Git for Windows**: https://git-scm.com/download/win
2. Create a free GitHub account if you don't have one: https://github.com
3. On GitHub, click **New repository**. Name it `portfolio` (or `yourusername.github.io` — see note below). Keep it public. Don't add a README (you already have files).
4. In VS Code, open a terminal (`` Ctrl+` ``) in this project folder and run:

```bash
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
git push -u origin main
```

(Replace `YOUR-USERNAME` and the repo name with your own.)

---

## 4. Turn on GitHub Pages (free hosting)

1. On your repo page → **Settings** → **Pages** (left sidebar).
2. Under "Build and deployment" → Source: **Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)` → **Save**.
4. Wait ~1 minute. GitHub will show your live URL:
   - If your repo is named `portfolio` → `https://YOUR-USERNAME.github.io/portfolio/`
   - If your repo is named exactly `YOUR-USERNAME.github.io` → it's live at `https://YOUR-USERNAME.github.io/` directly (no extra path) — this is the cleaner option if you want this to be *the* personal site.

---

## 5. Making future updates

Whenever you edit a file in VS Code:

```bash
git add .
git commit -m "describe what you changed"
git push
```

GitHub Pages redeploys automatically within a minute.

---

## Notes
- All animation respects `prefers-reduced-motion` for accessibility.
- Fonts (Space Grotesk, Inter, JetBrains Mono) and GSAP load from free CDNs — no extra cost or setup.
- To swap the résumé file later, just replace `assets/Anuj_Resume.pdf` with a new PDF of the same name.
