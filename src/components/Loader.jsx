import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, EASE, prefersReducedMotion } from '../motion/gsap'
import { app } from '../motion/stage'
import { useSmoothScroll } from '../motion/SmoothScroll'
import { HERO } from '../data/content'

const loadImage = (src) =>
  new Promise((resolve) => {
    const i = new Image()
    i.onload = i.onerror = resolve
    i.src = src
  })

/**
 * Opening title card. Counts while fonts and the hero plate load, then lifts
 * like a curtain and hands the stage to the hero intro (app.setReady()).
 */
export function Loader() {
  const root = useRef(null)
  const count = useRef(null)
  const [done, setDone] = useState(false)
  const scroll = useSmoothScroll()
  const scrollRef = useRef(scroll)
  scrollRef.current = scroll

  useLayoutEffect(() => {
    document.body.classList.add('is-loading')
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    const reduced = prefersReducedMotion()
    const counter = { v: 0 }
    let cancelled = false

    const assets = Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      loadImage(HERO.background),
      new Promise((r) => setTimeout(r, reduced ? 200 : 1900)),
    ])

    const ctx = gsap.context(() => {
      gsap.from('[data-loader-mark] .ch', {
        yPercent: 110,
        stagger: 0.05,
        duration: 1.1,
        ease: EASE.out,
        delay: 0.1,
      })
      const countTween = gsap.to(counter, {
        v: 86,
        duration: reduced ? 0.2 : 1.8,
        ease: 'power2.out',
        onUpdate: () => {
          if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
        },
      })

      assets.then(() => ctx.add(() => {
        if (cancelled) return
        countTween.kill()
        const tl = gsap.timeline({
          onComplete: () => {
            setDone(true)
          },
        })
        tl.to(counter, {
          v: 100,
          duration: 0.5,
          ease: 'power2.out',
          onUpdate: () => {
            if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
          },
        })
          .to('[data-loader-line]', { scaleX: 1, duration: 0.5, ease: EASE.soft }, 0)
          .to('[data-loader-mark] .ch', { yPercent: -110, stagger: 0.03, duration: 0.7, ease: 'power3.in' }, '+=0.1')
          .add(() => {
            document.body.classList.remove('is-loading')
            scrollRef.current?.start()
            app.setReady()
          }, '-=0.25')
          .to(
            root.current,
            { clipPath: 'inset(0% 0% 100% 0%)', duration: reduced ? 0.3 : 1.25, ease: EASE.cine },
            '-=0.35',
          )
      }))
    }, root)

    return () => {
      cancelled = true
      ctx.revert()
    }
  }, [])

  if (done) return null

  return (
    <div
      ref={root}
      role="status"
      aria-label="Loading The Art of Coffee"
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-espresso p-6 text-cream md:p-10"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <div className="t-eyebrow flex justify-between text-cream/50">
        <span>Specialty Roastery</span>
        <span>Est. 2014</span>
      </div>
      <div data-loader-mark className="t-display overflow-hidden text-center leading-none">
        {'The Art of Coffee'.split('').map((c, i) => (
          <span key={i} className="ch inline-block whitespace-pre">
            {c}
          </span>
        ))}
      </div>
      <div className="flex items-end justify-between gap-6">
        <div className="relative h-px flex-1 bg-cream/15">
          <div data-loader-line className="absolute inset-0 origin-left scale-x-0 bg-caramel" />
        </div>
        <span ref={count} className="font-display text-5xl tabular-nums md:text-7xl">
          000
        </span>
      </div>
    </div>
  )
}
