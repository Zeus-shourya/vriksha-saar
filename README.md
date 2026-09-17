# Vrikshā Saār — studio website

**Live:** <https://zeus-shourya.github.io/vriksha-saar/>

A two-page site for **Vrikshā Saār Design Collective**, an architecture, design and
urbanism practice with studios in Delhi, Rajkot and Sonepat.

Built as plain HTML / CSS / JS — **no build step, no dependencies, no framework**.
Drop the folder on any static host (GitHub Pages, Netlify, Vercel, cPanel, S3) and it runs.

---

## WhatsApp

The floating WhatsApp button and the WhatsApp card in the Contact section both read
one constant at the top of **`assets/js/main.js`**:

```js
var WHATSAPP_NUMBER = '918447396030';   // +91 84473 96030
```

Digits only — country code, no `+`, no spaces. To change the number, edit that one
line. If it is ever left blank or malformed, both links fall back to email
(`vrikshasaar@gmail.com`) rather than breaking, and log a warning to the console.

The pre-filled first message is on the next line (`WHATSAPP_MESSAGE`).

---

## Run it locally

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Then open <http://localhost:4345>. (No Node or Python needed — `serve.ps1` is a
self-contained static file server. It is a dev convenience only; don't deploy it.)

---

## Structure

```
vriksha-saar/
├── index.html              the main page, eight sections
├── founders.html           Aakash Khurana & Jill Gajera
├── serve.ps1               local preview server (not for production)
├── .nojekyll               stops GitHub Pages running Jekyll
├── README.md
└── assets/
    ├── css/style.css       design tokens, components, responsive, reduced-motion
    ├── js/main.js          motion + interaction (WhatsApp config at the top)
    └── img/                photography pulled from @vrikshasaar
```

### Sections

| # | Section  | What it holds |
|---|----------|---------------|
| — | Hero     | Full-bleed facade shot, split-word headline, live counters |
| 01 | Ethos   | वृक्ष / सार gloss, positioning statement, animated tree mark |
| 02 | Approach| Six numbered disciplines with cursor-following image preview |
| 03 | Works   | Filterable 7-project grid + Instagram tile; each opens a detail panel |
| 04 | Process | Discourse → Enquiry → Drawing → Making |
| 05 | Voices  | Client-testimonial pull quote over a full-bleed image |
| 06 | Studio  | Team, collective credits, three studio addresses |
| 07 | Careers | The two live openings (Architects, Spatial Researchers) |
| 08 | Contact | Email · WhatsApp · Instagram, then the footer wordmark |

---

## Design system

**Type** — `Cormorant Garamond` for display and the wordmark (it matches the studio's
existing logo lettering), `Jost` for UI, eyebrows and body. Both from Google Fonts.

**Colour**

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0B0C0B` | page ground |
| `--ink-2` / `--ink-3` | `#121412` / `#1A1D1A` | alternating section bands |
| `--bone` | `#F1EDE4` | primary text, preloader ground |
| `--clay` | `#C2673A` | the single accent — rules, numbers, italic emphasis |
| `--moss` | `#55654E` | reserved secondary |

All colours, spacing, easing and the nav height are CSS custom properties on
`:root` — retheming is a handful of lines.

**Logo** — the Instagram profile picture is used directly as the favicon, the
preloader stamp and the footer seal. In the nav and footer the same wordmark is set
live in Cormorant Garamond so it stays sharp at every size and on retina screens
(the source image is only 150×150).

---

## Motion

Everything is hand-written; there is no GSAP, Lenis or ScrollTrigger to load.

- Preloader with counter, logo stamp and curtain wipe
- Custom cursor (dot + lerped ring) that grows and labels itself over targets
- Split-word headline reveals — each word masks itself, so wrapping never breaks it
- Scroll-linked parallax on the hero and testimonial images; hero drifts and fades out
- `IntersectionObserver` reveals with per-element stagger
- SVG tree drawn with `stroke-dashoffset`, leaves popping in after
- Counters, infinite ticker, magnetic buttons, image-mask wipes, scroll progress bar,
  animated film grain, hover image preview on the Approach list

**`prefers-reduced-motion: reduce` is fully honoured.** Animations are neutralised,
the preloader is skipped, the custom cursor is disabled and every element renders in
its final state — the site is complete and legible with all motion off.

---

## Content

Copy and photography are drawn from the studio's own Instagram captions and
public listings — project names (House on Water, The VOID, Aurabella, The Terrace
Commons), the evaporative-cooling moon court, the client-testimonial line, the two
open roles, the team and the Delhi address. Project blurbs in the detail panels live
in the `PROJECTS` object in `main.js` and are easy to extend.

### Adding a project

1. Drop the image in `assets/img/`.
2. Copy an `<article class="card">` block in `index.html`, set `data-cat`
   (`residential` `housing` `interiors` `landscape`, space-separated), `--i`,
   and a new `data-project` key.
3. Add that key to `PROJECTS` in `assets/js/main.js`.
4. Bump the `<sup>` counts on the filter buttons.

The grid is 6 columns; `card--tall` spans two rows and `card--wide` spans four
columns. Keep the row count even so the composition stays a clean rectangle.

---

## Founders page

`founders.html` covers both co-founders — **Aakash Khurana** (Principal Architect ·
Urban Designer · Planner) and **Jill Gajera** (Architect). Aakash's credentials come
from his own public profile: University of Sydney, founder of Banyan Fig, and a role
at The Design Village.

Two things there are worth a second pass by the studio:

- **Jill's facts list** (`Discipline`, `Practice`, `Since`, `Studios`) is built from
  what is publicly stated. Education and any prior practices should be added.
- **Portraits** are the founders' own Instagram profile pictures at 150×150. They
  hold up as circular medallions but should be swapped for proper headshots —
  replace `assets/img/founder-aakash.jpg` and `founder-jill.jpg`, same filenames,
  square crop, 600px or larger.

Each role line is marked with an HTML comment so it is easy to find and edit.

---

## Deployment

Hosted on GitHub Pages from the `main` branch, repo root:

```bash
git push
```

A push redeploys automatically — usually live within a minute.

To attach the studio's own domain: add a `CNAME` file containing `vrikshasaar.in`,
then point the domain's DNS at GitHub Pages. (The domain is registered but currently
parked on GoDaddy.)

---

## Before launch

- [x] Set `WHATSAPP_NUMBER` in `assets/js/main.js` — +91 84473 96030
- [ ] Replace the founder portraits with proper headshots
- [ ] Fill in Jill Gajera's education / background on `founders.html`
- [ ] Point `vrikshasaar.in` at GitHub Pages and add a `CNAME` file
- [ ] Swap in higher-resolution project photography where available — several images
      are Instagram reel covers at 640px wide and will soften on large displays
- [ ] Replace `og:image` with an absolute URL once the domain is live
