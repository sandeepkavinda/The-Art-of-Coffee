import { useEffect, useRef } from 'react'
import { gsap, isTouch, prefersReducedMotion } from '../motion/gsap'

/**
 * Magnetic: the wrapped element leans toward the pointer and its inner
 * label leans a little further, then springs back on leave.
 */
export function Magnetic({ children, strength = 0.35, className = '', as: Tag = 'div' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || isTouch() || prefersReducedMotion()) return
    const inner = el.firstElementChild
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })
    const ixTo = inner && gsap.quickTo(inner, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })
    const iyTo = inner && gsap.quickTo(inner, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })

    const move = (e) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      xTo(dx * strength)
      yTo(dy * strength)
      ixTo?.(dx * strength * 0.35)
      iyTo?.(dy * strength * 0.35)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
      ixTo?.(0)
      iyTo?.(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])

  return (
    <Tag ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </Tag>
  )
}
