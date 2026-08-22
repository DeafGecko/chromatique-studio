# Chromatique Studio

Built this to learn Vue. That's it.

Didn't want to do another todo app so I made something I'd actually use — two colors go in, you find out if they work, you take what you like and drop it into a real project as actual design tokens.

---

## What it does

Surface color on the left. On-surface color on the right. The app calculates WCAG AA/AAA contrast ratios and an APCA Lc score in real time, shows you a live preview with real editable text, and lets you save pairings to localStorage so they're still there when you come back.

The question it answers: *does this text actually read on this background* — before you hard-code a hex value somewhere and find out the hard way.

---

## What's in it

**Palette Library**
Your saved pairings live in localStorage. Delete what doesn't work, load back to anything you kept. The active pairing gets the solid black highlight so you always know where you are. First four presets are read-only defaults.

**Shade & Tint Generator**
Feed it your surface color, it builds the full 100–900 scale back out via HSL interpolation. Tailwind-style naming. Click any swatch and it becomes your new surface color. You see the whole tonal range at once.

**Eyedropper**
EyeDropper API. Sample any pixel on screen — open tab, Figma file, screenshot, whatever's in front of you — and it writes the hex straight into the reactive color ref. No copy-pasting.

**Live Preview**
Inline styles bound to `bgColor` and `textColor` refs — what you see is exactly what those two values produce. Click the edit button and the preview goes `contenteditable`, VS Code dark editor style. Type your own words, see how legibility actually feels. X button exits and restores.

**Typography Selector**
A `v-model` bound select that swaps Tailwind font utility classes — `font-sans`, `font-serif`, `font-mono` — on the preview container. Same two colors look completely different in a different typeface. Worth checking.

**Component Preview**
Cards, badges, buttons, inputs, toggles — rendered with your actual tokens, driven by the same two color refs. No extra state. You see your palette on real UI shapes, not just a flat rectangle.

**WCAG + APCA Contrast**
WCAG uses a symmetric relative luminance formula — it can pass pale-on-white combinations that look unreadable and fail dark pairs that look totally fine. APCA Lc is directional and closer to how human vision actually reads lightness and contrast. Both computed values live in a single `useColorTokens` composable. They run side by side so you can see where they agree and where they don't.

**Export Modal**
CSS custom properties. Tailwind `theme.extend.colors` config. W3C Design Token JSON. All three generated from the same two hex values. Copy to clipboard per format, drop it into your project.

**Shareable URL**
`watch` on `[bgColor, textColor]` writes the active pair into the query string via `history.replaceState`. `onMounted` reads the params back on load. The URL is the state. Send it, paste it in Slack, drop it in a PR comment.

---

## What's next

- **Contrast Fix Helper** — auto-nudges failing pairs until they hit the threshold, shows you the adjusted hex
- **Typography Specimen** — headings, body, caption, code — your full type scale rendered at once in your colors
- **Color History** — reactive session log, last 5–10 pairs you tested, right there to step back through

---

## Why this way

Vue was new to me. I needed a project with enough real surface area to actually learn the Composition API — `ref`, `computed`, `watch`, composables, props and emits — but a clear enough problem that I wouldn't lose the thread halfway through.

Color tools made sense because the feedback is instant and visual. You change a value, something on screen changes. You can *see* if you broke it. That tight loop is good for learning something new.

The code will keep getting better as I do.

---

## Stack

- Vue 3 (Composition API)
- Tailwind CSS v3
- Vite
- VueUse (`useClipboard`)
- APCA-W3 (`computeAPCA`)
