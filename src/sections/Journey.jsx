import { useRef } from 'react'
import { useScene } from '../motion/useScene'
import { gsap, EASE } from '../motion/gsap'
import { stage } from '../motion/stage'
import { JOURNEY } from '../data/content'

/**
 * Scene 03: From bean to cup.
 * Arrives as a framed window that expands to full-bleed while the 3D cup lifts
 * away (the hand-off), then pins and plays six stages on one scrubbed
 * timeline: each photograph wipes up over the last, copy swaps in sync, and
 * the numeral odometer and progress bar advance together.
 */
export function Journey() {
  const root = useRef(null)

  useScene(root, (api) => {
    const { q } = api
    const n = JOURNEY.length
    const slides = q('[data-slide]')
    const imgs = q('[data-slide] img')
    const texts = q('[data-stage-text]')
    const titleSplits = texts.map((t) => api.split(t.querySelector('[data-title]'), 'words,chars'))
    const canvas = document.getElementById('stage-canvas')

    // ── Hand-off: window expands, cup departs ──
    const arrive = gsap.timeline({
      scrollTrigger: {
        trigger: root.current,
        start: 'top bottom',
        end: 'top top',
        scrub: true,
        onUpdate: (self) => {
          stage.outro = self.progress
          stage.setVisible(self.progress < 0.999)
        },
        onLeaveBack: () => {
          stage.outro = 0
          stage.setVisible(true)
        },
      },
    })
    arrive
      .fromTo(
        q('[data-frame]'),
        { clipPath: api.mobile ? 'inset(10% 5% 0% 5% round 24px)' : 'inset(14% 12% 0% 12% round 32px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' },
        0,
      )
      .fromTo(imgs[0], { scale: 1.35 }, { scale: 1.08, ease: 'none' }, 0)
    if (canvas) arrive.fromTo(canvas, { autoAlpha: 1 }, { autoAlpha: 0, ease: 'power1.in' }, 0.25)

    // ── Pinned stage tour ──
    gsap.set(slides.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' })
    gsap.set(texts.slice(1), { autoAlpha: 0 })
    titleSplits.slice(1).forEach((s) => gsap.set(s.chars, { yPercent: 115 }))

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * (api.mobile ? 4.2 : 5.2)}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
      },
    })
    tl.set({}, {}, n - 0.6) // hold on the final stage
    tl.fromTo(q('[data-bar-fill]'), { scaleX: 1 / n }, { scaleX: 1, duration: n - 1 }, 0)
    tl.to(q('[data-odometer]'), { yPercent: -((n - 1) / n) * 100, duration: n - 1 }, 0)

    for (let k = 1; k < n; k++) {
      const at = k - 1 + 0.15
      tl.to(slides[k], { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: EASE.soft }, at)
        .fromTo(imgs[k], { scale: 1.3, yPercent: 8 }, { scale: 1.08, yPercent: 0, duration: 0.85, ease: 'power2.out' }, at)
        .to(imgs[k - 1], { scale: 1.2, yPercent: -10, duration: 0.85, ease: 'power1.in' }, at)
        .to(q(`[data-shade="${k - 1}"]`), { opacity: 0.7, duration: 0.7 }, at)

      // copy swap
      const prev = texts[k - 1]
      const next = texts[k]
      tl.to(titleSplits[k - 1].chars, { yPercent: -115, stagger: 0.01, duration: 0.3, ease: 'power2.in' }, at)
        .to(prev.querySelectorAll('[data-fade]'), { y: -20, autoAlpha: 0, duration: 0.25 }, at)
        .set(prev, { autoAlpha: 0 }, at + 0.32)
        .set(next, { autoAlpha: 1 }, at + 0.32)
        .to(titleSplits[k].chars, { yPercent: 0, stagger: 0.012, duration: 0.4, ease: 'power3.out' }, at + 0.32)
        .fromTo(next.querySelectorAll('[data-fade]'), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.04, duration: 0.35 }, at + 0.4)
        .to(q(`[data-step="${k}"]`), { opacity: 1, duration: 0.2 }, at + 0.3)
    }

    if (!api.reduced) {
      tl.to(q('[data-badge]'), { rotate: 360, duration: n - 0.6 }, 0)
    }

    return () => {
      stage.outro = 0
      stage.setVisible(true)
    }
  })

  return (
    <section
      id="journey"
      ref={root}
      data-scene
      data-bg="#17100D"
      data-fg="#F2E9DC"
      aria-label="From bean to cup"
      className="relative h-[100svh] overflow-hidden"
    >
      <div data-frame className="absolute inset-0 overflow-hidden" style={{ clipPath: 'inset(14% 12% 0% 12% round 32px)' }}>
        {JOURNEY.map((s, i) => (
          <div key={s.no} data-slide className="absolute inset-0 overflow-hidden" style={{ zIndex: i }}>
            <img
              src={s.image}
              alt={`${s.title}: ${s.meta}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-espresso/90 via-espresso/45 to-espresso/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-espresso/30" />
            <div data-shade={i} className="absolute inset-0 bg-espresso opacity-0" />
          </div>
        ))}
      </div>

      {/* Heading strip */}
      <div className="absolute inset-x-0 top-24 z-20 flex items-start justify-between px-5 md:top-28 md:px-10">
        <p className="t-eyebrow text-caramel">03 — From bean to cup</p>
        <div className="relative hidden h-[1.1em] overflow-hidden font-display text-[clamp(5rem,12vw,11rem)] leading-none md:block" style={{ height: '0.9em' }}>
          <div data-odometer className="t-outline text-cream/70">
            {JOURNEY.map((s) => (
              <div key={s.no} className="h-[0.9em] leading-[0.9em]">
                {s.no}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage copy */}
      <div className="absolute inset-x-0 bottom-28 z-20 px-5 md:bottom-32 md:px-10">
        <div className="relative min-h-[15rem] max-w-2xl">
          {JOURNEY.map((s) => (
            <div key={s.no} data-stage-text className="absolute inset-x-0 bottom-0">
              <p data-fade className="t-eyebrow mb-4 text-caramel">
                {s.no} · {s.meta}
              </p>
              <h3 data-title data-mask className="t-mega mb-6 !text-[clamp(3.6rem,11vw,10rem)]">
                {s.title}
              </h3>
              <p data-fade className="t-lead max-w-md text-cream/75">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="absolute inset-x-0 bottom-8 z-20 px-5 md:bottom-10 md:px-10">
        <div className="relative mb-3 h-px w-full bg-cream/20">
          <div data-bar-fill className="absolute inset-0 origin-left bg-caramel" />
        </div>
        <ol className="grid grid-cols-6 gap-2">
          {JOURNEY.map((s, i) => (
            <li key={s.no} data-step={i} className={`t-eyebrow truncate text-[0.52rem] md:text-[0.6rem] ${i === 0 ? '' : 'opacity-40'}`}>
              <span className="hidden sm:inline">{s.no} </span>
              {s.title}
            </li>
          ))}
        </ol>
      </div>

      {/* Rotating badge */}
      <div className="pointer-events-none absolute bottom-28 right-10 z-20 hidden size-36 lg:block" aria-hidden>
        <svg data-badge viewBox="0 0 200 200" className="size-full text-cream/70">
          <defs>
            <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
          </defs>
          <text className="fill-current text-[15px] tracking-[0.42em] uppercase" style={{ fontFamily: 'var(--font-sans)' }}>
            <textPath href="#badge-circle">From bean to cup · Grown · Roasted · Poured ·</textPath>
          </text>
          <ellipse cx="100" cy="100" rx="17" ry="24" fill="#B87945" transform="rotate(-25 100 100)" />
          <path d="M93 80c10 10 4 28 14 40" stroke="#17100D" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  )
}
