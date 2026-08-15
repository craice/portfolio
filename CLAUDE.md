# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rafael Craice's personal site: a single-page link board (name, social links, a one-line tagline, and outbound links to products and projects) deployed to GitHub Pages at the custom domain `craice.me` (see `CNAME`). There is no build system, package manager, bundler, or test suite — it's plain HTML/CSS/JS served as-is.

The design originates from a Claude Design (claude.ai/design) prototype — project "Rafael Craice – portfólio profissional" (`Rafael Craice.dc.html`) — which was translated by hand into the vanilla implementation here. The `.dc.html` format is a live-preview fragment (`<x-dc>` + a `support.js`/React runtime); it is not shipped. `index.html`/`style.css`/`main.js` are the production reimplementation of that prototype's markup, styles, and interaction logic — keep them in sync if the Claude Design source changes, but the DC runtime itself never becomes part of this repo.

## Working with this repo

- No install/build/lint/test commands — there's no `package.json`. Preview by opening `index.html` directly or serving the directory (`python3 -m http.server`).
- Everything lives in three files: `index.html`, `assets/css/style.css`, `assets/js/main.js`. Don't split these up or add per-page stylesheets/scripts — the whole site is one page.
- Google Analytics (`G-6S6KJWPL23`) is the one piece carried over from the previous multi-page version of this site; keep the snippet in `index.html`'s `<head>` when editing markup.

## Architecture

### Interactive behavior (`assets/js/main.js`)
Three independent pieces of mouse-driven behavior, each self-contained:
- **Crosshair guides + coordinate readout** (`onGuideMove`): a vertical/horizontal line pair follows the cursor and a corner readout shows `XXXX · YYYY`; both fade in on movement and fade out after 1s idle. Throttled to one DOM write per animation frame.
- **Trailing dot** (`onTrailMove`/`tick`): a small dot eases toward the cursor at a fixed lerp factor (0.07/frame) via its own `requestAnimationFrame` loop, and grows to double size (`.dot--link`, still round) while hovering any `<a>`.
- **Language toggle** (`setLang`): swaps the `pt`/`en` hero heading and the two section labels (`produtos`/`products`, `projetos`/`projects`) and updates `<html lang>`. `pt` is the default; there's no persistence across reloads.

All three attach global `mousemove` listeners, so on touch devices (no `mousemove`) they simply never activate — `@media (hover: none)` in `style.css` also hides the guide/dot/readout elements outright as a belt-and-suspenders measure.

### CSS conventions
- Flat, purpose-named classes (`.hero`, `.links__row`, `.social__link`) — not BEM, since the page is small enough that nesting reads fine without it.
- Colors are `oklch()` custom properties in `:root` (`--bg`, `--ink` at various alpha levels, `--accent`). Reuse these tokens; don't hardcode new colors.
- Fluid sizing via `clamp()` on font sizes and vertical spacing instead of breakpoint-based media queries — there is intentionally no mobile/desktop split beyond the `hover: none` rule above.
- Fonts: `IBM Plex Mono` (Google Fonts) for all-caps/technical bits (labels, URLs, readout, lang toggle), `Inter` (Google Fonts, `--sans`) for the logo and everything else — the logo (`.logo`) is set bold.
- The hero heading (`#heroPt`) has a manual `<br>` after "organizo," for a deliberate line break; it isn't derived from wrapping/`max-width`. The `#heroEn` version doesn't have one — keep that in mind if either copy changes.

### Social icons
Each `.social__link` in `index.html` embeds the brand's real logo as an inline SVG (`viewBox="0 0 24 24"`, `fill: currentColor` via `.social__icon svg` in `style.css`) — no icon font or external request. Display order is fixed: LinkedIn, GitHub, Medium, Flickr. Keep new/reordered entries consistent with that pattern (inline SVG, not text abbreviations or icon-font glyphs).

### Adding a link
Product/project links are hardcoded `<a class="links__row ...">` entries under `.links`/`.links--projects` in `index.html` — there's no data-driven list. To add one, copy an existing `.links__row` (first item in a section gets `links__row--top`; the last also gets `links__row--bottom` for the closing border) and update the name/URL text.
