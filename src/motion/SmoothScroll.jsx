import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'

const ScrollCtx = createContext(null)

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis
 * share one clock (no jitter between scrubbed animations and the scroll).
 * Disabled entirely for reduced-motion users (native scroll).
 */
export function SmoothScroll({ children }) {
  const lenisRef = useRef(null)
  const [lenis, setLenis] = useState(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const instance = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true })
    lenisRef.current = instance
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    if (document.body.classList.contains('is-loading')) instance.stop()
    setLenis(instance)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      lenisRef.current = null
    }
  }, [])

  const api = useMemo(
    () => ({
      lenis,
      scrollTo(target, opts = {}) {
        const el = typeof target === 'string' ? document.querySelector(target) : target
        if (lenisRef.current) {
          lenisRef.current.scrollTo(el ?? target, {
            duration: 1.8,
            easing: (t) => 1 - Math.pow(1 - t, 4),
            ...opts,
          })
        } else if (el?.scrollIntoView) {
          el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
        } else if (typeof target === 'number') {
          window.scrollTo({ top: target })
        }
      },
      start: () => lenisRef.current?.start(),
      stop: () => lenisRef.current?.stop(),
    }),
    [lenis],
  )

  return <ScrollCtx.Provider value={api}>{children}</ScrollCtx.Provider>
}

// eslint-disable-next-line react/only-export-components
export const useSmoothScroll = () => useContext(ScrollCtx)
