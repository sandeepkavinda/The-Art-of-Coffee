import { useRef } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useScene } from '../motion/useScene'
import { gsap, EASE } from '../motion/gsap'
import { stage, app } from '../motion/stage'
import { useSmoothScroll } from '../motion/SmoothScroll'
import { Magnetic } from '../components/Magnetic'
import { BRAND, HERO } from '../data/content'

/**
 * Scene 01: the cinematic introduction.
 * Typography sits *behind* the WebGL cup (the fixed stage canvas), so the
 * cup is always the focal point. On scroll the words part like curtains and
 * the cup rises toward the Anatomy scene.
 */
export function Hero() {
  const root = useRef(null)
  const { scrollTo } = useSmoothScroll() ?? {}

  useScene(root, (api) => {
    const { q } = api
    const l1 = api.split(q('[data-line="1"]')[0], 'words,chars')
    const l2 = api.split(q('[data-line="2"]')[0], 'words,chars')
    const chars = [...l1.chars, ...l2.chars]

    // ── Intro (plays once the loader lifts) ──
    const intro = gsap.timeline({ paused: true })
    if (api.reduced) {
      intro
        .from([q('[data-line]'), q('[data-fade]')], { autoAlpha: 0, duration: 0.8 })
        .to(stage, { intro: 1, duration: 0.6 }, 0)
    } else {
      intro
        .fromTo(q('[data-hero-bg]'), { scale: 1.35, autoAlpha: 0 }, { scale: 1.08, autoAlpha: 1, duration: 2.6, ease: EASE.out })
        .fromTo(chars, { yPercent: 120, rotate: 8 }, { yPercent: 0, rotate: 0, stagger: 0.035, duration: 1.5, ease: EASE.out }, 0.15)
        .to(stage, { intro: 1, duration: 2.2, ease: 'power2.out' }, 0.35)
        .from(q('[data-fade]'), { y: 30, autoAlpha: 0, stagger: 0.08, duration: 1.2, ease: EASE.out }, 0.9)
        .from(q('[data-rule]'), { scaleX: 0, transformOrigin: 'left', duration: 1.4, ease: EASE.cine }, 0.8)
    }
    const off = app.onReady(() => intro.play())

    // ── Scroll: words part, plate recedes, cup rises into Anatomy ──
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => (stage.hero = self.progress),
      },
    })
    if (!api.reduced) {
      tl.to(q('[data-line="1"]'), { xPercent: -28, ease: 'none' }, 0)
        .to(q('[data-line="2"]'), { xPercent: 22, ease: 'none' }, 0)
        .to(q('[data-lines]'), { autoAlpha: 0.08, ease: 'power1.in' }, 0)
        .to(q('[data-hero-plate]'), { yPercent: 18, scale: 1.12, ease: 'none' }, 0)
        .to(q('[data-hero-shade]'), { opacity: 1, ease: 'none' }, 0)
        .to(q('[data-hero-ui]'), { y: -80, autoAlpha: 0, ease: 'power1.in' }, 0)
    }

    return () => {
      off()
      stage.hero = 0
    }
  })

  return (
    <section
      id="top"
      ref={root}
      data-scene
      data-bg="#17100D"
      data-fg="#F2E9DC"
      className="relative h-[100svh] min-h-[620px] overflow-hidden"
    >
      {/* Photographic plate */}
      <div data-hero-plate className="absolute inset-0">
        <div data-hero-bg className="absolute inset-0 opacity-0">
          <img src={HERO.background} alt="" className="h-full w-full object-cover opacity-30 saturate-[0.85]" fetchPriority="high" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_48%,rgba(184,121,69,0.32),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_35%,#17100d_92%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-espresso to-transparent" />
      </div>
      <div data-hero-shade className="absolute inset-0 bg-espresso opacity-0" />

      <h1 className="sr-only">The Art of Coffee: specialty roastery and café</h1>

      {/* Oversized title, rendered behind the 3D cup */}
      <div
        data-lines
        aria-hidden
        className="pointer-events-none absolute inset-0 flex flex-col justify-start gap-1 px-4 pt-[16svh] text-cream md:justify-center md:gap-[6vh] md:px-10 md:pb-10 md:pt-0"
      >
        <div data-line="1" data-mask className="t-mega self-start whitespace-nowrap">
          THE ART
        </div>
        <div data-line="2" data-mask className="t-mega self-end whitespace-nowrap">
          <em className="font-normal italic text-caramel">of</em> COFFEE
        </div>
      </div>

      {/* Foreground UI (above the canvas) */}
      <div data-hero-ui className="absolute inset-x-0 bottom-0 z-10 px-5 pb-7 md:px-10 md:pb-10">
        <div data-rule className="mb-6 h-px w-full bg-cream/20" />
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div data-fade className="max-w-sm">
            <p className="t-eyebrow text-caramel sm:mb-3">{BRAND.tagline}</p>
            <p className="hidden text-sm leading-relaxed text-cream/70 sm:block">
              Single-origin coffee, roasted in small batches and poured with intent. Scroll to take the
              signature cup apart, layer by layer.
            </p>
          </div>

          <button
            data-fade
            type="button"
            onClick={() => scrollTo?.('#anatomy')}
            className="t-eyebrow hidden items-center gap-3 text-[0.6rem] text-cream/60 md:flex"
            aria-label="Scroll to the anatomy of the signature cup"
          >
            <span className="grid size-10 place-items-center rounded-full border border-cream/25">
              <ArrowDown size={14} className="animate-bounce" />
            </span>
            Scroll
          </button>

          <div data-fade className="flex gap-2 sm:gap-3">
            <Magnetic>
              <button type="button" className="btn btn-solid" onClick={() => scrollTo?.('#anatomy')} data-cursor="Discover">
                <span>Discover</span>
                <ArrowDown size={14} />
              </button>
            </Magnetic>
            <Magnetic>
              <button type="button" className="btn btn-ghost text-cream" onClick={() => scrollTo?.('#menu')} data-cursor="Menu">
                <span>Explore menu</span>
                <ArrowUpRight size={14} />
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  )
}
