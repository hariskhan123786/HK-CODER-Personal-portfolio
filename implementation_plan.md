# HK-Portfolio — 3D UI Enhancement Plan

## Overview
Upgrade the existing HK-Portfolio from a flat Bootstrap-based design into a **premium 3D immersive experience** with glassmorphism, particle backgrounds, 3D card effects, cinematic animations, and neon-green accent styling that matches the existing brand color (`#18d26e`).

---

## What Will Change

### Core Design Upgrades
- **3D Particle Canvas** — animated floating particle network on the hero/homepage background (Canvas API)
- **Glassmorphism** — frosted glass panels with `backdrop-filter: blur()` on cards, header, and info boxes
- **3D Tilt Cards** — mouse-parallax effect on service cards, portfolio cards, testimonials, and stats
- **Neon Glow** — glow shadows on accent elements, buttons, icons using `box-shadow` with `#18d26e`
- **Cinematic Typing** — enhanced hero with 3D text shadow and glowing cursor
- **Floating Orbs** — animated gradient blobs in the hero background for depth
- **3D Skill Bars** — progress bars with a 3D beveled look and glow fill
- **3D Resume Timeline** — timeline cards with perspective transforms on hover
- **Animated Counters** — stats section with glowing number counters
- **Premium Preloader** — animated logo/spinner for a premium entry experience

---

## Proposed Changes

### 1. New 3D Enhancements CSS File
#### [NEW] [enhance3d.css](file:///d:/projects/HK-Portfolio/assets/css/enhance3d.css)
A dedicated CSS file added to every page with:
- CSS custom properties for 3D configuration
- Glassmorphism utility classes
- 3D card tilt keyframes
- Neon glow utilities
- Particle canvas z-index layering
- Animated floating blobs
- 3D skill bar styles
- Resume timeline 3D enhancements
- Premium hover transitions

### 2. New JavaScript Enhancement File
#### [NEW] [enhance3d.js](file:///d:/projects/HK-Portfolio/assets/js/enhance3d.js)
Vanilla JS (no extra libraries needed):
- `ParticleCanvas` — interactive floating particle network (hero page)
- `TiltCard` — mouse-move 3D tilt effect for all cards
- `FloatingOrbs` — animated gradient orbs in backgrounds
- `GlowPulse` — subtle pulsing glow on active/hovered elements

### 3. index.html (Home Page)
#### [MODIFY] [index.html](file:///d:/projects/HK-Portfolio/index.html)
- Add `enhance3d.css` link
- Replace hero `<img>` with a `<canvas id="particles-canvas">` + floating orb divs
- Add 3D text shadow to hero `<h2>` and glowing typed cursor
- Add CTA "Download CV" button with neon glow
- Link `enhance3d.js` before `</body>`

### 4. about.html
#### [MODIFY] [about.html](file:///d:/projects/HK-Portfolio/about.html)
- Add `enhance3d.css` link and `enhance3d.js`
- Profile image: 3D perspective frame with glowing border
- Stats cards: glassmorphism + 3D tilt
- Skills: 3D beveled progress bars with neon fill
- Interest cards: glass hover cards
- Testimonial cards: glass panels with 3D flip effect

### 5. resume.html
#### [MODIFY] [resume.html](file:///d:/projects/HK-Portfolio/resume.html)
- Add `enhance3d.css` and `enhance3d.js`
- Timeline items: 3D card hover effect with glowing left border
- Section headers: neon glow underline

### 6. services.html, portfolio.html, contact.html
#### [MODIFY] all three
- Add `enhance3d.css` and `enhance3d.js`
- Service cards: 3D flip on hover showing description on back
- Portfolio grid: 3D depth overlay on hover
- Contact form: glassmorphism panel with neon input focus glow

### 7. main.css (Minor Additions)
#### [MODIFY] [main.css](file:///d:/projects/HK-Portfolio/assets/css/main.css)
- Update header to use glassmorphism on scroll
- Update `.hero` to remove plain image background styling (canvas replaces it on homepage)
- Ensure `z-index` layering is compatible with particle canvas

---

## Visual Effect Summary

| Element | Effect |
|---|---|
| Hero Background | Interactive particle network + floating orbs |
| Header (scrolled) | Glassmorphism blur panel |
| Cards (services, portfolio) | 3D mouse-tilt parallax |
| Skill Bars | 3D beveled with neon fill glow |
| Buttons | Neon glow + depth shadow |
| Stats Numbers | Glowing neon counter |
| Profile Image | 3D rotating border frame |
| Resume Timeline | 3D perspective cards |
| Page Sections | Subtle animated gradient backgrounds |

---

## Verification Plan
- Open `index.html` in browser to verify particle canvas loads and tilt effects work
- Check glassmorphism on `about.html`, `services.html`
- Verify mobile responsiveness (3D effects gracefully degrade)
- Test hover interactions on service cards, portfolio items

> [!NOTE]
> All effects are pure CSS + Vanilla JS. No new npm packages or build tools required.
> The particle canvas only renders on pages that need it (index.html hero).
> 3D tilt is applied globally to any element with class `.tilt-card`.
