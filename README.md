# Chromatique Studio

A small tool for testing two colors before you hard-code them. Pick a surface color and a text color, see whether they read, and export them as real design tokens.

Built to learn Vue. Kept going because it's something I actually use.

Live at [chroma.09labs.dev](https://chroma.09labs.dev).

---

## What it does

Surface color on the left, on-surface color on the right. The app calculates WCAG AA and AAA contrast ratios and an APCA Lc score as you type or pick, and shows them side by side. You see where the two measures agree and where they don't.

It answers one question: *does this text actually read on this background?* Answer it before you write a hex value into a stylesheet.

Everything sits on one card. On desktop and iPad the whole tool fits the screen without scrolling. On a phone the sections stack and you scroll.

---

## Features

**Contrast readout**
WCAG ratio, AA and AAA pass or fail, APCA Lc, and a rating label. WCAG is symmetric and can pass pale-on-white pairs that look unreadable. APCA is directional and closer to how people perceive lightness. Both run in `useColorTokens`.

**Live preview**
The preview is styled from the same two values, so what you see is what they produce. Click the edit button to type your own copy into the preview. The X button exits and restores.

**Component preview**
Cards, badges, buttons, inputs, and toggles rendered with your tokens.

**Color-blindness preview**
Protanopia, deuteranopia, and tritanopia filters on the preview.

**Shade and tint scale**
A 100–900 scale built by mixing the surface color toward white and black. Click a swatch to make it the new surface color.

**Palettes**
Four read-only presets. Save any pairing to localStorage, delete what you don't need, and load any saved pairing back in.

**Eyedropper**
Samples a color from anywhere on screen, where the browser supports the EyeDropper API.

**Typography**
Switch the preview between sans-serif, serif, and monospace. The same two colors look different in each.

**Export**
CSS custom properties, a Tailwind `theme.extend.colors` config, and W3C Design Token JSON, all from the same two hex values.

**Shareable URL**
The active pair is written to the query string. Send the link and the other person sees the same pair.

**Keyboard shortcuts**

| Key | Action |
|---|---|
| `S` | Save the current pairing |
| `R` | Reset to Raw Linen |
| `E` | Toggle preview editing |
| `/` | Focus the background hex input |
| `Escape` | Exit preview editing |

Shortcuts are ignored while you're typing in a field and when Ctrl, Cmd, or Alt is held. A legend appears after your first key press, so mouse users never see it.

---

## Accessibility

- Keyboard focus shows a visible outline. Tab order and focus were checked on the main controls.
- The browser tests scan every preset, each color-blindness mode, edit mode, and the export modal with axe, against WCAG 2.0 and 2.1 A and AA.
- Automated checks can't replace a manual pass with a screen reader. That hasn't been done yet.

---

## Running it

```bash
npm install
npm run dev          # http://localhost:5173 (or the next free port)
```

### Tests

```bash
npm test             # unit tests (Vitest)
npm run test:watch   # unit tests, watch mode
npm run test:e2e     # browser tests and axe scans (Playwright)
```

- **Unit tests** run from `src/**/*.spec.js` with Vitest and jsdom. They cover `useColorTokens` and `useKeyboardShortcuts`. The Vue plugin is loaded, so components can be imported in tests.
- **Browser tests** run from `e2e/` against a Vite server on port 5199, started automatically. The port is fixed and never reused, so the tests can't attach to another project's server. Install the browser once with `npx playwright install chromium`.
- **Lighthouse** isn't wired into a script. Run it against the production build, not the dev server, since dev-mode code skews the scores: `npm run build && npx vite preview --port 4174`, then point Lighthouse at `http://localhost:4174`.

Last full run: 30 of 30 unit tests, 16 of 16 browser tests, and Lighthouse at 100 in Performance, Accessibility, Best Practices, and SEO.

---

## Stack

- Vue 3 (Composition API)
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Vite
- VueUse (`useStorage`, `useClipboard`)
- Inter for section headings, self-hosted via `@fontsource-variable/inter`
- Vitest, @vue/test-utils, jsdom
- Playwright, @axe-core/playwright

APCA-W3 is calculated in `useColorTokens` (soft black clamp, 0.027 offset, 0.1 cutoff) rather than from a library.

---

## What's next

- **Accent color:** a third picker with suggestions that already pass contrast against the surface.
- **Contrast fix helper:** nudges a failing pair until it passes, and shows the adjusted hex.
- **Typography specimen:** headings, body, caption, and code, rendered together in your colors.
- **Color history:** the last 5–10 pairs you tested, so you can step back through them.

---

## Why this way

Vue was new to me. I needed a project with enough real surface area to learn the Composition API (`ref`, `computed`, `watch`, composables, props and emits), and a problem clear enough that I wouldn't lose the thread.

Color tools made sense because the feedback is instant. You change a value and something on screen changes.
