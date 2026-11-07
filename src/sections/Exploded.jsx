import { useRef } from 'react'
import { useScene } from '../motion/useScene'
import { gsap } from '../motion/gsap'
import { stage } from '../motion/stage'
import { LAYERS } from '../data/content'

// Scroll budget (fractions of the pinned timeline). Shared with the 3D rig:
// separation completes at 0.30, the layer tour runs 0.30 → 0.80,
// reassembly finishes by 0.96.
const TOUR_START = 0.3
const TOUR_END = 0.8
const SLOT = (TOUR_END - TOUR_START) / LAYERS.length

/**
 * Scene 02: Anatomy of the signature iced coffee.
 * The section pins while the persistent 3D cup separates into its eight real
 * components. Copy for each layer is pre-rendered and choreographed on the
 * same scrubbed timeline, so text and geometry are frame-locked and reverse
 * perfectly when scrolling up.
 */
export function Exploded() {
  const root = useRef(null)

  useScene(root, (api) => {
    const { q } = api
    const panels = q('[data-panel]')
    const titles = panels.map((p) => api.split(p.querySelector('[data-title]'), 'words,chars'))

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        end: api.mobile ? '+=520%' : '+=640%',
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress
          stage.explode = p
          stage.active = p >= TOUR_START && p < TOUR_END ? Math.min(LAYERS.length - 1, Math.floor((p - TOUR_START) / SLOT)) : -1
        },
        onLeaveBack: () => {
          stage.explode = 0
          stage.active = -1
        },
      },
    })

    // Lock timeline length to 1 so positions read as scroll fractions.
    tl.set({}, {}, 1)

    // Intro copy steps aside as the cup separates
    tl.fromTo(q('[data-intro] > *'), { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.01, duration: 0.06 }, 0)
      .to(q('[data-intro] > *'), { y: -40, autoAlpha: 0, stagger: 0.01, duration: 0.06 }, 0.2)

    // Rail + counter frame
    tl.fromTo(q('[data-rail]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04 }, TOUR_START - 0.04)
      .fromTo(q('[data-rail-fill]'), { scaleY: 0 }, { scaleY: 1, duration: TOUR_END - TOUR_START }, TOUR_START)
      .to(q('[data-rail]'), { autoAlpha: 0, duration: 0.04 }, TOUR_END)

    // Per-layer copy, each owning one slot of the tour
    panels.forEach((panel, i) => {
      const at = TOUR_START + i * SLOT
      const chars = titles[i].chars
      const fades = panel.querySelectorAll('[data-fade]')
      const tick = q(`[data-tick="${i}"]`)
      tl.set(panel, { autoAlpha: 1 }, at)
      if (api.reduced) {
        tl.fromTo(fades, { autoAlpha: 0 }, { autoAlpha: 1, duration: SLOT * 0.2 }, at)
        tl.fromTo(chars, { autoAlpha: 0 }, { autoAlpha: 1, duration: SLOT * 0.2 }, at)
      } else {
        tl.fromTo(chars, { yPercent: 115 }, { yPercent: 0, stagger: SLOT * 0.012, duration: SLOT * 0.3 }, at)
        tl.fromTo(fades, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: SLOT * 0.05, duration: SLOT * 0.3 }, at + SLOT * 0.08)
      }
      tl.to(tick, { color: '#B87945', opacity: 1, duration: SLOT * 0.1 }, at)
      tl.to(tick, { color: '#F2E9DC', opacity: 0.4, duration: SLOT * 0.1 }, at + SLOT * 0.9)
      // exit (except chars of the last panel exit with the tour end)
      if (!api.reduced) tl.to(chars, { yPercent: -115, stagger: SLOT * 0.008, duration: SLOT * 0.2 }, at + SLOT * 0.8)
      tl.to(fades, { autoAlpha: 0, y: -16, duration: SLOT * 0.15 }, at + SLOT * 0.82)
      tl.set(panel, { autoAlpha: 0 }, at + SLOT)
    })

    // Reassembled: outro line
    tl.fromTo(q('[data-outro] > *'), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.012, duration: 0.06 }, 0.86)

    return () => {
      stage.explode = 0
      stage.active = -1
    }
  })

  return (
    <section
      id="anatomy"
      ref={root}
      data-scene
      data-bg="#1A120E"
      data-fg="#F2E9DC"
      aria-label="Anatomy of the signature iced coffee"
      className="relative z-10 h-[100svh] overflow-hidden"
    >
      {/* Intro */}
      <div data-intro className="absolute left-5 top-24 max-w-md md:left-10 md:top-32">
        <p className="t-eyebrow mb-5 text-caramel">02 — Anatomy</p>
        <h2 className="t-h2 mb-5">
          Eight layers.
          <br />
          <em className="italic text-caramel">One</em> ritual.
        </h2>
        <p className="t-lead max-w-sm text-cream/65">
          Our signature iced coffee, taken apart. Keep scrolling to separate the cup into every component
          we craft by hand.
        </p>
      </div>

      {/* Layer panels (stacked; one visible at a time) */}
      <div className="absolute inset-x-0 bottom-0 px-5 pb-8 md:bottom-auto md:left-10 md:right-auto md:top-1/2 md:w-[min(34rem,40vw)] md:-translate-y-1/2 md:px-0 md:pb-0">
        <div className="pointer-events-none absolute inset-x-0 -top-24 bottom-0 bg-gradient-to-t from-[#1A120E] via-[#1A120E]/90 to-transparent md:hidden" />
        <div className="relative min-h-[13.5rem] md:min-h-[20rem]">
          {LAYERS.map((layer, i) => (
            <article key={layer.key} data-panel className="invisible absolute inset-x-0 bottom-0 md:bottom-auto md:top-0">
              <p data-fade className="t-eyebrow mb-4 flex items-center gap-3 text-caramel">
                <span className="font-display text-base tracking-normal">{String(i + 1).padStart(2, '0')}</span>
                <span className="h-px w-8 bg-caramel/60" />
                <span className="text-cream/60">{layer.short}</span>
              </p>
              <h3 data-title data-mask className="t-display mb-5 !text-[clamp(2.4rem,5.4vw,5.4rem)]">
                {layer.name}
              </h3>
              <p data-fade className="t-lead mb-5 max-w-md text-cream/70">
                {layer.text}
              </p>
              <p data-fade className="t-eyebrow inline-flex rounded-full border border-cream/20 px-4 py-2 text-[0.6rem] text-cream/80">
                {layer.spec}
              </p>
            </article>
          ))}
        </div>
      </div>

      {/* Progress rail */}
      <div data-rail className="invisible absolute bottom-10 left-10 hidden items-end gap-6 md:flex">
        <div className="relative h-36 w-px bg-cream/15">
          <div data-rail-fill className="absolute inset-0 origin-top bg-caramel" />
        </div>
        <ol className="flex flex-col gap-1">
          {LAYERS.map((l, i) => (
            <li key={l.key} data-tick={i} className="t-eyebrow text-[0.55rem] text-cream opacity-40">
              {String(i + 1).padStart(2, '0')} {l.short}
            </li>
          ))}
        </ol>
      </div>

      {/* Reassembled */}
      <div data-outro className="absolute inset-x-0 bottom-10 flex flex-col items-center px-5 text-center md:bottom-14">
        <p className="t-eyebrow mb-3 text-caramel">Reassembled</p>
        <p className="t-h3 max-w-xl">
          Every layer has a reason. <em className="italic text-caramel">Now, where it all begins.</em>
        </p>
      </div>
    </section>
  )
}
