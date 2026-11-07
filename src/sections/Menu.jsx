import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import SplitType from 'split-type'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import { useScene } from '../motion/useScene'
import { gsap, EASE, prefersReducedMotion } from '../motion/gsap'
import { revealText } from '../motion/presets'
import { Magnetic } from '../components/Magnetic'
import { useOrder } from '../components/OrderContext'
import { MENU } from '../data/content'

const pad = (n) => String(n).padStart(2, '0')
const price = (p) => `$${p.toFixed(2)}`

/** Product name that animates in, char by char, each time it mounts. */
function AnimatedName({ text, className }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const s = new SplitType(ref.current, { types: 'words,chars', tagName: 'span' })
    const tw = gsap.fromTo(s.chars, { yPercent: 115, rotate: 8 }, { yPercent: 0, rotate: 0, stagger: 0.025, duration: 1, ease: EASE.out })
    return () => {
      tw.kill()
      s.revert()
    }
  }, [text])
  return (
    <h3 ref={ref} className={`mask-words ${className}`}>
      {text}
    </h3>
  )
}

/**
 * Scene 05: the menu as a luxury product advertisement.
 * Arch-framed photography with circular wipe transitions, a ghosted giant
 * product name, and a details card. Keyboard and touch friendly.
 */
export function Menu() {
  const root = useRef(null)
  const [idx, setIdx] = useState(0)
  const prevIdx = useRef(0)
  const { add } = useOrder()
  const item = MENU[idx]

  const go = useCallback((n) => setIdx((n + MENU.length) % MENU.length), [])

  // Scroll entrance
  useScene(root, (api) => {
    const { q } = api
    revealText(api, q('[data-menu-title]')[0], { types: 'words,chars' })
    if (api.reduced) return
    gsap.from(q('[data-menu-row]'), {
      y: 40,
      autoAlpha: 0,
      stagger: 0.06,
      duration: 1,
      ease: EASE.out,
      scrollTrigger: { trigger: q('[data-menu-list]')[0], start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.fromTo(
      q('[data-arch]'),
      { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 0 0)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0 0)',
        duration: 1.6,
        ease: EASE.cine,
        scrollTrigger: { trigger: q('[data-arch]')[0], start: 'top 85%', toggleActions: 'play none none reverse' },
      },
    )
    gsap.fromTo(
      q('[data-ghost]'),
      { xPercent: 8 },
      { xPercent: -8, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
    )
  })

  // Image transition on selection change: circular wipe from below
  useEffect(() => {
    const from = prevIdx.current
    prevIdx.current = idx
    if (from === idx) return
    const layers = root.current.querySelectorAll('[data-shot]')
    const next = layers[idx]
    const reduced = prefersReducedMotion()
    layers.forEach((l, i) => gsap.set(l, { zIndex: i === idx ? 3 : i === from ? 2 : 1 }))
    if (reduced) {
      gsap.fromTo(next, { autoAlpha: 0, clipPath: 'none' }, { autoAlpha: 1, duration: 0.4 })
      return
    }
    gsap.set(next, { autoAlpha: 1 })
    gsap.fromTo(next, { clipPath: 'circle(0% at 50% 100%)' }, { clipPath: 'circle(150% at 50% 100%)', duration: 1.3, ease: EASE.cine })
    gsap.fromTo(next.querySelector('img'), { scale: 1.35 }, { scale: 1, duration: 1.6, ease: EASE.out })
    gsap.to(layers[from].querySelector('img'), { scale: 1.1, duration: 1.3, ease: EASE.cine })
    gsap.fromTo(root.current.querySelectorAll('[data-detail]'), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.9, ease: EASE.out, delay: 0.15 })
  }, [idx])

  const onKey = (e) => {
    if (e.key === 'ArrowRight') go(idx + 1)
    if (e.key === 'ArrowLeft') go(idx - 1)
  }

  // Touch swipe on the image
  const touch = useRef(null)
  const onTouchStart = (e) => (touch.current = e.touches[0].clientX)
  const onTouchEnd = (e) => {
    if (touch.current == null) return
    const dx = e.changedTouches[0].clientX - touch.current
    if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1))
    touch.current = null
  }

  return (
    <section
      id="menu"
      ref={root}
      data-scene
      data-bg="#261812"
      data-fg="#F2E9DC"
      data-color-start="top bottom"
      data-color-end="top 90%"
      aria-label="Menu"
      className="relative overflow-hidden bg-roast pb-24 pt-28 text-cream md:pb-32 md:pt-36"
      onKeyDown={onKey}
    >
      {/* Ghosted product name */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[38%] flex justify-center overflow-hidden">
        <div data-ghost>
          <div key={item.name} className="t-mega t-outline whitespace-nowrap text-cream/[0.07] [animation:ghost-in_1.2s_var(--ease-out-expo)_both]">
            {item.name}
          </div>
        </div>
      </div>
      <style>{`@keyframes ghost-in{from{opacity:0;letter-spacing:.06em}to{opacity:1;letter-spacing:-0.04em}}`}</style>

      <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
        <header className="mb-14 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
          <div>
            <p className="t-eyebrow mb-5 text-caramel">05 — The Menu</p>
            <h2 data-menu-title className="t-display">
              Choose your <em className="italic text-caramel">cup</em>
            </h2>
          </div>
          <p className="t-lead max-w-sm text-cream/60">
            Eight drinks, each built around a single origin. Pick one to see what goes into it.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Product list */}
          <div data-menu-list className="min-w-0 order-1 lg:col-span-4">
            <ul role="listbox" aria-label="Drinks" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:block lg:space-y-0 lg:overflow-visible lg:px-0">
              {MENU.map((m, i) => {
                const on = i === idx
                return (
                  <li key={m.name} data-menu-row role="option" aria-selected={on} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => go(i)}
                      data-cursor="Select"
                      className={`group flex w-full items-baseline gap-4 rounded-full border px-4 py-2 text-left transition-colors duration-500 lg:rounded-none lg:border-0 lg:border-b lg:border-cream/10 lg:px-0 lg:py-4 ${
                        on ? 'border-caramel text-cream' : 'border-cream/15 text-cream/45 hover:text-cream'
                      }`}
                    >
                      <span className={`t-eyebrow hidden w-6 lg:inline ${on ? 'text-caramel' : ''}`}>{pad(i + 1)}</span>
                      <span className="relative whitespace-nowrap font-display text-lg lg:flex-1 lg:text-2xl">
                        {m.name}
                        <span className={`absolute -bottom-1 left-0 hidden h-px bg-caramel transition-all duration-700 lg:block ${on ? 'w-full' : 'w-0 group-hover:w-1/3'}`} />
                      </span>
                      <span className="hidden text-sm tabular-nums lg:inline">{price(m.price)}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Arch image */}
          <div className="min-w-0 order-2 lg:col-span-5">
            <div
              data-arch
              className="relative mx-auto aspect-[3/4] w-full max-w-[520px] overflow-hidden rounded-t-full bg-coffee"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              data-cursor="Swipe"
            >
              {MENU.map((m, i) => (
                <div key={m.name} data-shot className="absolute inset-0 overflow-hidden" style={{ zIndex: i === 0 ? 3 : 1, visibility: i === 0 ? 'visible' : 'hidden' }}>
                  <img src={m.image} alt={m.name} loading="lazy" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/50 via-transparent to-transparent" />
                </div>
              ))}
              <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-espresso/60 px-4 py-2 backdrop-blur-md">
                <span className="t-eyebrow text-[0.6rem] text-cream">
                  {pad(idx + 1)} / {pad(MENU.length)}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0 order-3 flex flex-col justify-center lg:col-span-3" aria-live="polite">
            <p data-detail className="t-eyebrow mb-4 text-caramel">
              {item.temp} · {item.size}
            </p>
            <AnimatedName key={item.name} text={item.name} className="mb-6 font-display text-[clamp(2.2rem,3.3vw,3.6rem)] leading-[0.98] tracking-[-0.025em]" />
            <p data-detail className="mb-6 leading-relaxed text-cream/70">
              {item.text}
            </p>
            <ul data-detail className="mb-8 flex flex-wrap gap-2" aria-label="Tasting notes">
              {item.notes.map((n) => (
                <li key={n} className="rounded-full border border-cream/15 px-3 py-1.5 text-xs text-cream/75">
                  {n}
                </li>
              ))}
            </ul>
            <div data-detail className="mb-8 flex items-end justify-between border-t border-cream/10 pt-6">
              <span className="t-eyebrow text-cream/50">Price</span>
              <span className="font-display text-5xl tabular-nums">{price(item.price)}</span>
            </div>
            <div data-detail className="flex items-center gap-3">
              <Magnetic className="flex-1">
                <button type="button" className="btn btn-solid w-full justify-center" onClick={() => add(item)} data-cursor="Add">
                  <span>Add to order</span>
                  <Plus size={14} />
                </button>
              </Magnetic>
              <button type="button" onClick={() => go(idx - 1)} aria-label="Previous drink" className="grid size-12 shrink-0 place-items-center rounded-full border border-cream/20 transition-colors hover:border-caramel hover:text-caramel">
                <ArrowLeft size={16} />
              </button>
              <button type="button" onClick={() => go(idx + 1)} aria-label="Next drink" className="grid size-12 shrink-0 place-items-center rounded-full border border-cream/20 transition-colors hover:border-caramel hover:text-caramel">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
