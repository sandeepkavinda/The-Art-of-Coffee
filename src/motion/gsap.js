// Single registration point for GSAP so every module shares one instance.
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
gsap.defaults({ ease: 'power3.out', duration: 1 })
ScrollTrigger.config({ ignoreMobileResize: true })

/** Shared easing vocabulary: the rhythm of the whole film. */
export const EASE = {
  cine: 'expo.inOut',
  out: 'expo.out',
  soft: 'power2.inOut',
  linear: 'none',
}

/** Media queries used by every scene through useScene(). */
export const MQ = {
  reduced: '(prefers-reduced-motion: reduce)',
  mobile: '(max-width: 767px)',
  desktop: '(min-width: 768px)',
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(MQ.reduced).matches

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches

export { gsap, ScrollTrigger }
