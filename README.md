# Vrikshā Saār — studio website

A single-page site for **Vrikshā Saār Design Collective**, an architecture, design and
urbanism practice with studios in Delhi, Rajkot and Sonepat.

Built as plain HTML / CSS / JS — **no build step, no dependencies, no framework**.
Drop the folder on any static host (Netlify, Vercel, GitHub Pages, cPanel, S3) and it runs.

---

## ⚠️ One thing you must set before going live

The floating WhatsApp button and the WhatsApp card in the Contact section both read
one constant. Open **`assets/js/main.js`** and change line 14:

```js
var WHATSAPP_NUMBER = '91XXXXXXXXXX';   // ← country code + number, digits only
```

- Digits only. No `+`, no spaces, no dashes.
- Include the country code: an Indian number `98765 43210` becomes `919876543210`.

Until a valid number is set, both WhatsApp links **fall back to email**
(`vrikshasaar@gmail.com`) so nothing is ever a dead link, and a warning is logged
to the browser console.

You can also edit the pre-filled first message on the next line
(`WHATSAPP_MESSAGE`).

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
├── index.html              all markup, one page, eight sections
├── serve.ps1               local preview server (not for production)
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

## Before launch

- [ ] Set `WHATSAPP_NUMBER` in `assets/js/main.js`
- [ ] Point `vrikshasaar.in` at the host (the domain is registered but currently parked)
- [ ] Swap in higher-resolution project photography where available — several images
      are Instagram reel covers at 640px wide and will soften on large displays
- [ ] Replace `og:image` with an absolute URL once the domain is live
