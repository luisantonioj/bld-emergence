# Software Requirements Specification

## BLD Lipa Youth Ministry — Animated Digital Invitation Web Page

**Document Version:** 1.0
**Date:** May 2026
**Project Codename:** The Emergence — Digital Invitation

---

## 1. Introduction

### 1.1 Purpose

This document specifies the requirements for a one-page animated digital invitation for the BLD Lipa Youth Ministry. The product is a responsive, browser-based web page delivered via a shareable link, designed to convey a warm and meaningful invitation to selected youth using the Polaroid/Memory Reveal animation concept.

### 1.2 Project Background

Inspired by _The Emergence_ physical newsletter (Sept. 02, 2023), this digital invitation communicates the spirit of community, leadership discernment, and belonging within the BLD Lipa Youth Ministry. It serves as an initial, non-personalized call to gather — paralleling how the printed newsletter invited specific youth to a discernment event.

### 1.3 Scope

The product is:

- A single HTML page with embedded CSS and JavaScript (or a lightweight React/Next.js build)
- Hosted on a static hosting platform (e.g., Vercel, Netlify, or GitHub Pages)
- Accessible via one shareable URL
- Non-personalized by default; architected to support future per-recipient personalization

Out of scope for v1.0: backend, user authentication, form submissions, analytics dashboards, and admin CMS.

### 1.4 Intended Audience

- Front-end developer(s) building the page
- BLD Lipa Youth Ministry coordinators reviewing and approving content
- Future developer extending the page for personalization

### 1.5 Definitions

| Term                          | Meaning                                                                                                          |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Polaroid                      | A styled card element mimicking a physical polaroid photo print                                                  |
| Reveal sequence               | The ordered animation timeline that plays on page load                                                           |
| Grayscale-to-color transition | CSS filter animation from `grayscale(100%)` to `grayscale(0%)`                                                   |
| Community grid                | The final multi-photo layout after the reveal sequence                                                           |
| Pentachord                    | The core leadership team of the BLD Youth Ministry                                                               |
| Emergence                     | The discernment event; also the name of the physical newsletter being digitized                                  |
| Anchor photos                 | A fixed subset of photos assigned to the opening polaroid drop and the final grid; always the same across visits |
| Ambient pool                  | The remaining photos that cycle as a soft background slideshow behind the invitation text during the reading phase |

---

## 2. Overall Description

### 2.1 Product Perspective

The page is a standalone front-end artifact. It requires no server-side processing in v1.0. Future versions may integrate a personalization layer (query-param or token-based) that injects a recipient's name and custom message without changing the core animation flow.

### 2.2 User Classes

| User                 | Description                                              |
| -------------------- | -------------------------------------------------------- |
| Invited Youth        | Primary audience; views the page on mobile or desktop    |
| Ministry Coordinator | Approves content; may update photos/text via code or CMS |
| Developer            | Builds, maintains, and deploys the page                  |

### 2.3 Operating Environment

- **Browsers:** Chrome (latest), Safari (latest), Firefox (latest), Samsung Internet
- **Devices:** Mobile phones (≥ 360px wide), tablets (768px–1024px), desktops (≥ 1280px)
- **Connection:** Must perform acceptably on a 4G/LTE connection (Philippines mobile network context)
- **Hosting:** Static file hosting with HTTPS; no server-side runtime required in v1.0

### 2.4 Design Constraints

- All animation must use **CSS transitions/keyframes and vanilla JS** (or a minimal animation library such as GSAP free tier or Animate.css); no heavy frameworks unless already chosen for the build
- Total page weight (HTML + CSS + JS, excluding images) must not exceed **200 KB** before gzip
- Images must be optimized (WebP format preferred, max 150 KB per image)
- No external fonts requiring a paid license; Google Fonts is acceptable
- The page must function without a back-end in v1.0

---

## 3. Functional Requirements

### 3.1 Animation Sequence (Polaroid/Memory Reveal)

The page plays a linear, auto-advancing animation timeline on load. The user does not control pacing in v1.0.

#### 3.1.1 Stage 0 — Blank Opening (Duration: ~1.5 s)

- **FR-01:** The page opens to a clean, white or near-white (`#FAFAF8`) background with no visible content.
- **FR-02:** A subtle ambient texture or very faint grain overlay may be applied to the background to evoke printed material.

#### 3.1.2 Stage 1 — First Polaroid Drop (Duration: ~2.5 s)

- **FR-03:** A single polaroid card drops in from slightly above center, settling with a gentle deceleration (`cubic-bezier(0.34, 1.56, 0.64, 1)` or equivalent).
- **FR-04:** The polaroid image renders in grayscale on drop.
- **FR-05:** After settling (~0.8 s pause), the image transitions from grayscale to full color over ~1.2 s.
- **FR-06:** The polaroid card may carry a faint handwritten-style caption below the photo (e.g., _"Service. Joy. Community."_) using a cursive/script web font.
- **FR-07:** The first polaroid's photo must depict a meaningful moment — preferably a wide community or leadership group shot.

#### 3.1.3 Stage 2 — Community Polaroid Cascade (Duration: ~5–7 s total)

- **FR-08:** Additional polaroid cards appear one by one (3–5 total additional cards) drawn from the **anchor photo set**, each with a slight entrance delay of 0.6–0.9 s between cards. Anchor photos are a coordinator-curated fixed list defined in `config.js`; the same photos appear every visit.
- **FR-09:** Each card enters with a gentle drop or slide-in and settles at a slightly randomized rotation (between −6° and +6°) to simulate a natural spread of physical photos.
- **FR-10:** Each new polaroid renders in grayscale and transitions to color within 1 s of settling.
- **FR-11:** Cards may subtly overlap as the collection grows, creating a natural pile effect.
- **FR-12:** Optional handwritten captions per card (e.g., _"Together"_, _"Discernment"_, _"Called"_) appear with a short fade-in after colorization.

#### 3.1.4 Stage 3 — Pause / Hold (Duration: ~1.5 s)

- **FR-13:** The collection of polaroids holds still on screen, giving the viewer a moment to absorb the imagery before transitioning.

#### 3.1.5 Stage 4 — Layout Transition (Duration: ~1.5–2 s)

- **FR-14:** The polaroid collection transitions into a structured photo grid (2-column on mobile, 3-column on desktop).
- **FR-15:** The transition is smooth — polaroids scale down and glide into their grid positions, losing their rotation.
- **FR-16:** The grid maintains a polaroid aesthetic (white border, faint drop shadow) after settling.

#### 3.1.6 Stage 5 — Invitation Message Reveal (Duration: ~3 s, staggered)

- **FR-17:** Below (or alongside, on desktop) the photo grid, the invitation message fades in line by line with a stagger of ~0.4 s per line.
- **FR-17b:** Simultaneously with the message reveal, a full-viewport background slideshow begins playing behind the content layer using photos from the **ambient pool**. Each photo:
  - Is rendered at low opacity (~0.12–0.18) with a blur of ~4 px so it does not compete with foreground text or the photo grid
  - Fades in over ~2 s, holds for ~5 s, then cross-fades to the next over ~1.5 s
  - Is selected from the ambient pool in a randomized order; the full pool cycles before any photo repeats
  - Is positioned as a full-viewport cover behind all foreground content
- **FR-18:** The message text must include, at minimum:
  - A greeting/opening line
  - Reference to the BLD Lipa Youth Ministry community
  - The purpose of the invitation (discernment and leadership)
  - Event details: **date, time, and location** (to be populated by coordinators)
  - A closing warm call-to-action (e.g., _"We are waiting for you."_ or _"Step forward."_)
- **FR-19:** Key phrases (event date/time/location, the ministry name) must be styled with greater visual weight (bold or accent color).
- **FR-20:** The BLD Lipa Youth Ministry name or logo appears at the end of the message reveal.

#### 3.1.7 Stage 6 — Final Resting State

- **FR-21:** After all animations complete, the page rests in a fully readable, static state.
- **FR-22:** The ambient background slideshow (FR-17b) continues looping in the final resting state, keeping the page feeling alive. The foreground photo grid and message text must remain fully legible at all times — the ambient layer must not reduce text contrast below the WCAG 2.1 AA threshold (see NFR-07). An additional subtle looping animation on the photo grid (e.g., very slow breathing scale) or a soft pulsing glow on the CTA is also acceptable.

---

### 3.2 Content Requirements

#### 3.2.1 Photos

- **FR-23:** The page draws from a pool of up to 40 photos stored in `/public/` (`penta-1.jpg` through `penta-40.jpg` / `penta-32.png`). The pool is divided into two categories declared as arrays in `config.js`:
  - **`ANCHOR_PHOTOS`** (4–6 files): the fixed photos used in the opening polaroid drop (Stage 1) and the final grid (Stage 4/6). Always the same across page visits.
  - **`AMBIENT_PHOTOS`** (remaining files, up to ~34): used exclusively for the background slideshow (FR-17b). The split between anchor and ambient is coordinator-configurable.
- **FR-24:** All photos are supplied by the ministry coordinators. The developer must not source, substitute, or remove photos without coordinator approval.
- **FR-25:** All displayed individuals must have given consent for their photo to appear on a shareable link.
- **FR-26:** Photos are served from the `/public/` directory already present in the repository. No external hotlinking. WebP conversion is recommended (max 150 KB per anchor photo; ambient pool images may be compressed more aggressively, target ≤ 80 KB each) to keep total transferred size within NFR-03.

#### 3.2.2 Invitation Copy

- **FR-27:** All body text is written in **English** (consistent with the source newsletter).
- **FR-28:** The copy must be warm, inclusive, and non-presumptuous; it must not state the recipient's name in v1.0.
- **FR-29:** Event details (date, time, venue) are populated as configurable constants in the source code to allow easy coordinator updates without touching animation logic.

#### 3.2.3 Branding

- **FR-30:** The page uses the BLD Lipa Youth Ministry's approved color palette (to be provided by coordinators; default reference: monochromatic with an accent derived from existing materials — e.g., deep charcoal `#2B2B2B`, off-white `#FAFAF8`, and a single warm accent such as `#C8A96E` or equivalent).
- **FR-31:** Typography must use a pairing of a serif display font (e.g., _Playfair Display_ or _Cormorant Garamond_) and a clean sans-serif (e.g., _Inter_ or _DM Sans_), consistent with the newsletter's editorial aesthetic.
- **FR-32:** The optional handwritten caption font must be a free script/cursive font (e.g., _Caveat_, _Dancing Script_).

---

### 3.3 Responsiveness

- **FR-33:** The layout must be fully functional and visually consistent on viewports 360px–2560px wide.
- **FR-34:** On mobile (< 768px): single-column layout; polaroids are sized to fit within 85 vw; text is readable at 16px base.
- **FR-35:** On tablet (768px–1023px): 2-column photo grid; moderate polaroid sizes.
- **FR-36:** On desktop (≥ 1024px): 3-column photo grid; side-by-side layout of photos and message text is acceptable.
- **FR-37:** Touch events on mobile must not interfere with the animation playback in v1.0 (the sequence is passive/non-interactive).

---

### 3.4 Shareability

- **FR-38:** The page must be accessible via a single URL with no login or password.
- **FR-39:** The URL must be copyable and shareable via messaging apps (Messenger, Viber, WhatsApp) as a plain link.
- **FR-40:** Open Graph meta tags (`og:title`, `og:description`, `og:image`) must be set so the link previews meaningfully in messaging apps and social media.
- **FR-41:** The `og:image` must be a static preview card (≥ 1200×630 px) provided by the coordinators or generated as a static screenshot of the final resting state.

---

### 3.5 Future Personalization (v2.0 Consideration)

These are not required for v1.0 but the architecture must not preclude them.

- **FR-42 (Future):** A URL query parameter (e.g., `?to=Juan`) may inject a recipient's name into the greeting line.
- **FR-43 (Future):** A token-based system (e.g., `?token=abc123`) may unlock a personalized message block without exposing all recipients' names in the URL.
- **FR-44 (Future):** The animation sequence structure must be modular enough to insert a personalized "name card" polaroid in Stage 1 without rewriting the entire sequence.

---

## 4. Non-Functional Requirements

### 4.1 Performance

- **NFR-01:** Lighthouse Performance score ≥ 85 on mobile (simulated 4G).
- **NFR-02:** First Contentful Paint (FCP) ≤ 2.5 s on a 4G connection.
- **NFR-03:** Total transferred assets ≤ 2 MB (increased from 1.5 MB to accommodate the larger photo pool; ambient images are lazy-loaded to avoid saturating the initial load).
- **NFR-04:** Animations must run at ≥ 55 fps on a mid-range Android device (e.g., 2021-era Snapdragon 6xx series).
- **NFR-04b:** Anchor photos must be preloaded (via `<link rel="preload">` or equivalent) before the animation sequence begins. Ambient pool images must be lazy-loaded — only the next 2 images in the rotation queue are fetched ahead of time.

### 4.2 Accessibility

- **NFR-05:** All images must have descriptive `alt` text.
- **NFR-06:** The `prefers-reduced-motion` CSS media query must be respected; when active, the reveal sequence must be replaced by an instant full display of all content (no motion).
- **NFR-07:** Body text must meet WCAG 2.1 AA contrast ratio (≥ 4.5:1 against the background).
- **NFR-08:** The page must be navigable and readable with a screen reader in its final resting state.

### 4.3 Compatibility

- **NFR-09:** The page must render correctly on iOS Safari 15+ and Chrome for Android 100+.
- **NFR-10:** CSS animations must use `will-change` and `transform`/`opacity` properties only, to leverage GPU compositing and avoid layout thrash.

### 4.4 Security & Privacy

- **NFR-11:** No personal data (names, contact details) of recipients is stored or transmitted in v1.0.
- **NFR-12:** The page must be served over HTTPS.
- **NFR-13:** No third-party tracking scripts (analytics, advertising pixels) may be included without explicit coordinator approval.

### 4.5 Maintainability

- **NFR-14:** All content variables (event date, time, venue, copy text) must be isolated in a single configuration block at the top of the source file (or a separate `config.js`), clearly commented.
- **NFR-15:** All photo assets are stored in `/public/`. The anchor and ambient pool assignments are declared as the arrays `ANCHOR_PHOTOS` and `AMBIENT_PHOTOS` in `config.js`; coordinators can move any photo between categories by editing that file alone, without touching animation logic.
- **NFR-16:** The codebase must include a `README.md` with instructions for updating content, replacing photos, reassigning anchor vs. ambient photos, and deploying.

---

## 5. System Architecture Overview

```
┌─────────────────────────────────────┐
│           Static Hosting            │
│       (Vercel / Netlify / GH Pages) │
└──────────────┬──────────────────────┘
               │  HTTPS
               ▼
┌─────────────────────────────────────┐
│        index.html (single page)     │
│  ┌───────────┐   ┌───────────────┐  │
│  │ styles.css│   │  animation.js │  │
│  └───────────┘   └───────────────┘  │
│  ┌───────────────────────────────┐  │
│  │       config.js (content)     │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │   /public/penta-*.jpg/.png    │  │
│  │   (anchor + ambient pool)     │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

> **Photo categories in `config.js`:**
> - `ANCHOR_PHOTOS` — filenames of the 4–6 fixed photos used in the polaroid sequence and final grid.
> - `AMBIENT_PHOTOS` — filenames of all remaining photos used in the background slideshow (FR-17b). Coordinators may move filenames between the two arrays without touching animation logic.

### Animation Timeline Summary

```
0s          1.5s        4s          9-11s       12.5s       14s+
│           │           │           │           │           │
▼           ▼           ▼           ▼           ▼           ▼
[Blank]  [Polaroid 1] [Cascade    [Hold]     [Grid       [Message
         drops +      Polaroids             Transition]  Reveal +
         color]       2–5]                              Resting State]
```

---

## 6. Content Specification Template

The following fields must be populated by the BLD Lipa Youth Ministry coordinators before development begins.

| Field                 | Value                                             |
| --------------------- | ------------------------------------------------- |
| Event Name            | _(e.g., The Emergence)_                           |
| Event Date            | _(e.g., May 30, 2026)_                            |
| Event Time            | _(e.g., 1:00 PM)_                                 |
| Venue                 | _(e.g., Marian Center for Peace, Lipa City)_      |
| Greeting Line         | _(e.g., "Hello, beloved.")_                       |
| Invitation Body       | _(Full copy, ≤ 80 words recommended)_             |
| Closing CTA           | _(e.g., "Step forward. We are waiting for you.")_ |
| Ministry Logo         | _(PNG/SVG, transparent background)_               |
| Anchor Photos (opening + grid) | _(4–6 filenames from `/public/penta-*.jpg`, ≥ 800×800 px)_ |
| Ambient Pool Photos            | _(Remaining filenames from `/public/penta-*.jpg`, up to ~34)_ |
| Ambient Slideshow Opacity      | _(Default: 0.15; coordinator may adjust 0.10–0.25)_ |
| Polaroid Captions     | _(Short phrases, one per anchor photo, optional)_        |
| Approved Accent Color | _(Hex code, or "use default")_                    |

---

## 7. Acceptance Criteria

| ID    | Criterion                                                                                       |
| ----- | ----------------------------------------------------------------------------------------------- |
| AC-01 | The reveal animation plays automatically on page load without user interaction                  |
| AC-02 | The first polaroid transitions from grayscale to color visibly                                  |
| AC-03 | All subsequent polaroids appear sequentially with rotation and color transition                 |
| AC-04 | The photo grid forms smoothly from the polaroid scatter                                         |
| AC-05 | The invitation message appears line-by-line after the grid settles                              |
| AC-06 | The page is fully readable and static after all animations complete                             |
| AC-07 | The page renders without visual breakage on iPhone SE (375px), iPad (768px), and 1440px desktop |
| AC-08 | `prefers-reduced-motion` replaces the entire sequence with a static full display                |
| AC-09 | The shareable URL produces a meaningful link preview in Messenger and Viber                     |
| AC-10 | Lighthouse mobile score ≥ 85 on the deployed URL                                                |
| AC-11 | No personal names or recipient data appear anywhere on the page in v1.0                                     |
| AC-12 | Event details can be updated in ≤ 5 minutes by editing `config.js` alone                                    |
| AC-13 | A background photo from the ambient pool fades in behind the message text during Stage 5 and continues cycling in Stage 6 |
| AC-14 | The ambient slideshow does not reduce message text contrast below WCAG 2.1 AA (4.5:1) at its maximum opacity |

---

## 8. Revision History

| Version | Date     | Author | Notes             |
| ------- | -------- | ------ | ----------------- |
| 1.0     | May 2026 | —      | Initial SRS draft |
| 1.1     | May 2026 | —      | Added anchor/ambient photo pool concept; expanded photo count to up to 40 from `/public/`; added FR-17b (background slideshow), NFR-04b (lazy loading), AC-13–14; updated NFR-03, NFR-15, FR-23/24/26, FR-08, FR-22 |

---

_This document is intended as a living specification. Updates to content, branding, or feature scope should be recorded in the Revision History and communicated to all stakeholders before development resumes._
