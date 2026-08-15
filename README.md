# Chromatique Studio

I built this to learn Vue. That's really it.

I wanted a real project to practice on — not another todo app — so I made a color tool that lets you pick two colors, see if they actually work together, and export the results as real CSS or Tailwind tokens you could drop into a real project.

---

## What it does

You pick a background color and a text color. The app tells you if they pass contrast standards (WCAG AA/AAA), shows you a live preview of how they look on screen, and lets you save pairings you like.

It's basically a workspace for testing "does this text color read on this background?" before you commit to it in your design.

---

## What's built so far

**Color Palette Library & Swatch Panel**
Save your color combos and come back to them. You can delete ones you don't want, load presets, and see which one is active by the black background highlight.

**Shade & Tint Generator**
Pick a color and it automatically builds a full 100–900 scale (like Tailwind's gray-100 through gray-900). You don't have to do that math yourself.

**Color Picker with Eyedropper**
You can sample any color off your screen — like from a website or a design file — and it pulls the hex value directly into the tool.

**Reset to Default**
One click gets you back to the starting colors (`#D8D8DC` and `#111113`) when you've gone too far down a rabbit hole.

**Live Preview (Edit Mode)**
There's a preview card that shows how your colors actually look with real text. You can click into it and type your own words to test legibility. It goes into a VS Code-style dark editor mode with an X button to close out.

**Typography Selector**
Dropdown to switch between Sans-Serif, Serif, and Monospace so you can see how font style changes the feel of your color pair.

**Export Token Schema**
When you find something you like, you can export it as CSS variables, a Tailwind config snippet, or W3C JSON. Copy button included.

---

## What's coming next

- **APCA Contrast Meter** — a more accurate way to measure contrast than the old WCAG math
- **Contrast Fix Helper** — auto-suggests small tweaks to failing color pairs until they pass
- **Component Switcher** — test your tokens on cards, badges, form inputs, and toggles inside the preview
- **Typography Specimen** — see how your colors look across headings, body text, captions, and code
- **Color History** — quick access to the last 5–10 combos you tested this session
- **Shareable URL** — encode your active colors into a link you can send to someone

---

## Why I built it this way

Vue was new to me. I needed something with enough moving parts to actually learn — reactivity, components, composables, computed values — but with a clear enough goal that I wouldn't get lost. Color tools made sense because the feedback is instant and visual. You change something, you see it.

This is a learning project. The code will keep getting better as I get better at Vue.

---

## Stack

- Vue 3 (Composition API)
- Tailwind CSS
- Vite
