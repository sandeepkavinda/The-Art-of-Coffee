import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import SplitType from 'split-type'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useScene } from '../motion/useScene'
import { gsap, EASE, prefersReducedMotion } from '../motion/gsap'
import { revealText } from '../motion/presets'
import { TESTIMONIALS } from '../data/content'

const DURATION = 7

/** Scene 09: an editorial testimonial slider on caramel. */
export function Testimonials() {
  const root = useRef(null)
  const quote = useRef(null)
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const t = TESTIMONIALS[idx]

  useScene(root, (api) => {
    revealText(api, api.q('[data-t-title]')[0])
    if (api.reduced) return
    gsap.fromTo(
      api.q('[data-mark]'),
      { yPercent: 30, rotate: -8 },
      { yPercent: -30, rotate: 4, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
    )
  })

  // Quote words rise in on every change
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const s = new SplitType(quote.current, { types: 'words', tagName: 'span' })
    const tw = gsap.fromTo(s.words, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, stagger: 0.025, duration: 1, ease: EASE.out })
    return () => {
      tw.kill()
      s.revert()
    }
  }, [idx])

  // Autoplay only while visible and not hovered
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(root.current)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    if (!inView || paused || prefersReducedMotion()) return
    const id = setTimeout(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), DURATION * 1000)
    return () => clearTimeout(id)
  }, [idx, inView, paused])

  const running = inView && !paused

  return (
    <section
      id="voices"
      ref={root}
      data-scene
      data-bg="#B87945"
      data-fg="#17100D"
      aria-label="What our guests say"
      className="relative overflow-hidden py-28 md:py-40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto grid max-w-[1500px] gap-10 px-5 md:grid-cols-12 md:px-10">
        <div className="relative md:col-span-4">
          <p className="t-eyebrow mb-5">09 — Voices</p>
          <h2 data-t-title className="t-h2 max-w-xs">
            Said over <em className="italic">a second</em> cup.
          </h2>
          
        </div>

        <div className="relative md:col-span-8">
          <div data-mark aria-hidden className="pointer-events-none absolute -left-4 -top-24 font-display text-[16rem] leading-none text-espresso/10 md:-left-16 md:-top-32 md:text-[24rem]">
            “
          </div>
          <blockquote className="relative min-h-[14rem] md:min-h-[18rem]">
            <p ref={quote} key={idx} className="font-display text-[clamp(1.7rem,3.6vw,3.6rem)] leading-[1.12] tracking-[-0.015em]">
              “{t.quote}”
            </p>
            <footer className="mt-10 flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-full bg-espresso font-display text-lg text-cream">
                {t.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')}
              </span>
              <span>
                <cite className="block not-italic font-semibold">{t.name}</cite>
                <span className="text-sm text-espresso/70">{t.role}</span>
              </span>
            </footer>
          </blockquote>

          <div className="mt-14 flex items-center gap-6">
            <div className="grid flex-1 grid-cols-4 gap-2" role="tablist" aria-label="Choose testimonial">
              {TESTIMONIALS.map((x, i) => (
                <button
                  key={x.name}
                  type="button"
                  role="tab"
                  aria-selected={i === idx}
                  aria-label={`Testimonial from ${x.name}`}
                  onClick={() => setIdx(i)}
                  className="relative h-6"
                >
                  <span className="absolute inset-x-0 top-1/2 h-px bg-espresso/25" />
                  <span
                    key={`${idx}-${running}`}
                    className="absolute left-0 top-1/2 h-px bg-espresso"
                    style={{
                      width: i < idx ? '100%' : i === idx ? undefined : '0%',
                      animation: i === idx ? `t-fill ${DURATION}s linear both` : 'none',
                      animationPlayState: running ? 'running' : 'paused',
                    }}
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" aria-label="Previous testimonial" onClick={() => setIdx((idx - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="grid size-12 place-items-center rounded-full border border-espresso/30 transition-colors hover:bg-espresso hover:text-cream">
                <ArrowLeft size={16} />
              </button>
              <button type="button" aria-label="Next testimonial" onClick={() => setIdx((idx + 1) % TESTIMONIALS.length)} className="grid size-12 place-items-center rounded-full border border-espresso/30 transition-colors hover:bg-espresso hover:text-cream">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div aria-hidden className="mt-24 overflow-hidden border-y border-espresso/20 py-5 md:mt-32">
        <div className="flex w-max [animation:marquee_40s_linear_infinite]">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {['Single origin', 'Roasted in house', 'Slow bar', 'Clear-cut ice', 'Open late', 'Since 2014'].map((w) => (
                <span key={w} className="flex items-center font-display text-4xl italic md:text-6xl">
                  <span className="px-8">{w}</span>
                  <span className="text-2xl not-italic text-espresso/40">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes t-fill{from{width:0%}to{width:100%}}`}</style>
    </section>
  )
}
