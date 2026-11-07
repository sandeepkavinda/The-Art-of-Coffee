# The Art of Coffee

A cinematic, scroll-directed website for a specialty coffee brand.
React + Vite, Tailwind v4, GSAP/ScrollTrigger, Lenis, SplitType, React Three Fiber.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## The film (scene order)

| # | Scene | Technique |
|---|-------|-----------|
| 01 | **Hero** | Title behind a live 3D cup; words part like curtains on scroll |
| 02 | **Anatomy** | Pinned; the same 3D cup separates into 8 real geometry components, with scroll-locked copy, labels and a progress rail, then reassembles |
| 03 | **Journey** | Framed window expands to full-bleed while the cup lifts away; six pinned stages wipe over each other |
| 04 | **Pour** | Layered SVG pour (stream, rising crema, ripples, steam) on scroll; coffee floods the frame and becomes the Menu |
| 05 | **Menu** | Arch-framed product stage, circular wipes, ghosted name, add-to-order |
| 06 | **Story** | Manifesto lights up word by word; masked editorial images |
| 07 | **House** | Pinned photo opens from a card to full-bleed; three parallax planes |
| 08 | **Gallery** | Asymmetric grid, hover zoom, lightbox |
| 09 | **Voices** | Editorial testimonial slider + marquee |
| 10 | **Visit** | Hours, contact, self-drawing SVG map |
| 11 | **Finale** | Brand name assembles around a turning cup; footer |

## Animation architecture

```
src/motion/
  gsap.js          one GSAP instance, shared eases + media queries
  useScene.js      every section's choreography goes through this hook:
                   gsap.matchMedia scoped to the section → auto cleanup,
                   rebuilds on breakpoint / reduced-motion change,
                   SplitType instances auto-reverted
  presets.js       shared vocabulary: charsIn, revealText, maskReveal, parallax
  Director.js      page-level: morphs --bg/--fg between scenes (data-bg/data-fg),
                   publishes --progress, sorts + refreshes all triggers
  stage.js         mutable bridge between ScrollTriggers and the WebGL loop
  SmoothScroll.jsx Lenis driven by GSAP's ticker (one clock)
src/three/
  Stage.jsx        the single fixed canvas (lazy-loaded chunk), label overlay
  CupModel.jsx     8-part cup + exploded-view rig (damped, scroll-driven)
  geometry.js      procedural lathe/tube/cylinder geometry, sleeve texture
  Beans.jsx        instanced floating beans
```

Rules the code follows:
- Sections never animate on their own clock: everything scroll-bound is one scrubbed timeline per scene, so it reverses perfectly.
- 3D never re-renders React on scroll. Triggers write numbers to `stage`, and `useFrame` damps them.
- The canvas stops rendering (`frameloop="never"`) once the Journey has taken over.
- `prefers-reduced-motion`: Lenis off, cursor/magnetics off, reveals become fades, ambient loops disabled.
- Mobile: smaller pins, fewer beans, lower DPR, no 3D callouts (copy panel instead).

All copy and media live in `src/data/content.js`. Photography is from Unsplash (stored locally in `public/images`).
