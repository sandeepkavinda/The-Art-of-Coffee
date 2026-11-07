import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ShoppingBag, ArrowUpRight } from 'lucide-react'
import { gsap, ScrollTrigger, EASE } from '../motion/gsap'
import { app } from '../motion/stage'
import { useSmoothScroll } from '../motion/SmoothScroll'
import { useOrder } from './OrderContext'
import { BRAND, NAV_LINKS } from '../data/content'
import { Magnetic } from './Magnetic'

export function Logo({ className = '' }) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 40 40" className="size-8" aria-hidden>
        <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeOpacity=".35" />
        <ellipse cx="20" cy="20" rx="8.5" ry="12" fill="var(--color-caramel)" transform="rotate(-25 20 20)" />
        <path d="M16.5 10.5c5 5 2.5 14 7.5 19" stroke="var(--bg)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </svg>
      <span className="font-display text-lg leading-none tracking-tight">
        The Art <em className="font-normal italic text-caramel">of</em> Coffee
      </span>
    </span>
  )
}

/**
 * Fixed navigation. Colours follow the Director's --fg so it re-tints itself
 * as scenes change; hides on scroll-down and returns on scroll-up.
 */
export function Nav() {
  const bar = useRef(null)
  const overlay = useRef(null)
  const [open, setOpen] = useState(false)
  const { scrollTo, stop, start } = useSmoothScroll() ?? {}
  const { count } = useOrder()
  const bag = useRef(null)

  // Entrance + hide/show on scroll direction
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(bar.current, { yPercent: -120 })
      const off = app.onReady(() => gsap.to(bar.current, { yPercent: 0, duration: 1.2, ease: EASE.out, delay: 0.9 }))
      const st = ScrollTrigger.create({
        start: 200,
        end: 'max',
        onUpdate: (self) => {
          if (!app.ready) return
          gsap.to(bar.current, { yPercent: self.direction === 1 ? -120 : 0, duration: 0.6, ease: 'power3.out', overwrite: 'auto' })
        },
        onLeaveBack: () => gsap.to(bar.current, { yPercent: 0, duration: 0.6, overwrite: 'auto' }),
      })
      return () => {
        off()
        st.kill()
      }
    })
    return () => ctx.revert()
  }, [])

  // Bump the bag when items are added
  useEffect(() => {
    if (!count || !bag.current) return
    gsap.fromTo(bag.current, { scale: 1.35 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1,0.35)' })
  }, [count])

  // Mobile overlay choreography
  useEffect(() => {
    const el = overlay.current
    if (!el) return
    if (open) {
      stop?.()
      gsap.set(el, { display: 'flex' })
      gsap.fromTo(el, { clipPath: 'circle(0% at 100% 0%)' }, { clipPath: 'circle(150% at 100% 0%)', duration: 1, ease: EASE.cine })
      gsap.fromTo(el.querySelectorAll('[data-item]'), { yPercent: 110 }, { yPercent: 0, stagger: 0.06, duration: 0.9, ease: EASE.out, delay: 0.3 })
    } else {
      start?.()
      gsap.to(el, { clipPath: 'circle(0% at 100% 0%)', duration: 0.7, ease: EASE.cine, onComplete: () => gsap.set(el, { display: 'none' }) })
    }
  }, [open, stop, start])

  const go = (href) => (e) => {
    e.preventDefault()
    setOpen(false)
    setTimeout(() => scrollTo?.(href), open ? 350 : 0)
  }

  return (
    <>
      <header
        ref={bar}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 text-[color:var(--fg)] md:px-10 md:py-6"
      >
        <a href="#top" onClick={go('#top')} aria-label={`${BRAND.name}, back to top`}>
          <Logo />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={go(l.href)} className="t-eyebrow link-line pb-1 text-[0.66rem]">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Magnetic strength={0.25}>
            <a
              href="#menu"
              onClick={go('#menu')}
              className="relative flex items-center gap-2 rounded-full border border-[color:var(--fg)]/25 px-4 py-2.5 backdrop-blur-md"
              aria-label={`Order, ${count} items`}
            >
              <ShoppingBag size={16} strokeWidth={1.6} />
              <span className="t-eyebrow hidden text-[0.62rem] sm:inline">Order</span>
              <span
                ref={bag}
                className="grid size-5 place-items-center rounded-full bg-caramel text-[0.65rem] font-semibold text-espresso"
              >
                {count}
              </span>
            </a>
          </Magnetic>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-[color:var(--fg)]/25 backdrop-blur-md lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-2.5 w-5">
              <span className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
              <span className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={overlay}
        className="fixed inset-0 z-[45] hidden flex-col justify-between bg-espresso px-6 pb-10 pt-28 text-cream lg:hidden"
        style={{ clipPath: 'circle(0% at 100% 0%)' }}
      >
        <ul className="space-y-2">
          {NAV_LINKS.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <a data-item href={l.href} onClick={go(l.href)} className="flex items-baseline gap-4 font-display text-5xl">
                <span className="t-eyebrow text-caramel">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="overflow-hidden">
          <a data-item href="#visit" onClick={go('#visit')} className="t-eyebrow flex items-center gap-2 text-cream/70">
            Reserve a table <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </>
  )
}
