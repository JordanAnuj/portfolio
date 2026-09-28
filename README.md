# Anuj K Janardhanan — Portfolio

A warm beige/brown, signal/resolution-themed portfolio with light and dark modes. The hero text sharpens as the page loads alongside a decorative resolution grid — a nod to the super-resolution work (ESRGAN/SRDiff) in the resume.

## What's inside
```
index.html          → all page content
css/style.css        → all styling (one file, CSS variables at the top)
js/main.js           → theme, mobile navigation, copy email, resolution reveal + scroll animations
assets/Anuj_Resume.pdf → downloadable résumé (linked from the nav + hero)
assets/og-banner.png  → legacy preview image (not referenced by current metadata)
```
No build step, no npm install, no framework. Just open `index.html`.

---

## 1. Current content and links

The portfolio presents Anuj as an AI/ML Engineer and AI Developer at Amulya Corporate Services LLP, with previous ISRO and Adani experience, three projects, education and certifications. AMDEX is a recruitment operations, resume databank and candidate search platform with AI-assisted matching and retrieval. It is in development/testing; 5,000+ resumes is its intended design scale.

`index.html` already uses real URLs, with no placeholder `href="#"` links:

| Destination | URL |
|---|---|
| WorkSync AI | https://github.com/JordanAnuj/WorkSync.git |
| Moodify | https://github.com/JordanAnuj/Moodify.git |
| Weekendy | https://github.com/JordanAnuj/Weekendy.git |
| LinkedIn | https://linkedin.com/in/anuj-k-janardhanan-593881192 |
| GitHub | https://github.com/JordanAnuj |
| Credly | https://www.credly.com/users/anuj-k-janardhanan.15421318 |
| AWS badge | https://www.credly.com/badges/e4481b45-cba8-4193-ba5a-4a2a327d87d7/public_url |
| IBM badge | https://www.credly.com/badges/9c0ff740-5781-4a0d-a6fd-0f3c25c044c3/public_url |

All three resume buttons use `assets/Anuj_Resume.pdf`. Internal navigation points to section IDs. The canonical URL is https://jordananuj.github.io/portfolio/; Open Graph, Twitter and Schema.org Person metadata live in `index.html`.

---

## 2. Run it locally (VS Code, Windows)

1. Install **VS Code**: https://code.visualstudio.com
2. Install the **Live Server** extension (by Ritwick Dey) from the Extensions tab (`Ctrl+Shift+X`).
3. Open this folder in VS Code (`File → Open Folder`).
4. Right-click `index.html` → **Open with Live Server**. It opens in your browser and auto-refreshes when you edit files.

---

## 3. GitHub repository

This is an existing Git project. Check the configured remote before publishing changes:

```bash
git remote -v
git status
```

Use the update commands below when ready to publish; there is no need to initialize a new repository.

---

## 4. Turn on GitHub Pages (free hosting)

1. On your repo page → **Settings** → **Pages** (left sidebar).
2. Under "Build and deployment" → Source: **Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)` → **Save**.
4. Once deployment completes, the configured portfolio URL is https://jordananuj.github.io/portfolio/.

---

## 5. Making future updates

Whenever you edit a file in VS Code:

```bash
git add .
git commit -m "describe what you changed"
git push
```

When GitHub Pages is configured to deploy from this branch, pushing triggers a deployment. Check its status in GitHub.

---

## Notes
- All animation respects `prefers-reduced-motion` for accessibility.
- Fonts (Space Grotesk, Inter, JetBrains Mono) and GSAP load from free CDNs — no extra cost or setup.
- To swap the résumé file later, just replace `assets/Anuj_Resume.pdf` with a new PDF of the same name.
