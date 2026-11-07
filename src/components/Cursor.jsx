import { useEffect, useRef, useState } from 'react'
import { gsap, isTouch, prefersReducedMotion } from '../motion/gsap'
import { stage } from '../motion/stage'

/**
 * Desktop-only custom cursor: a precise dot plus a lagging ring that grows
 * and shows a label over anything marked data-cursor="Label".
 * Also feeds normalised pointer coordinates to the 3D stage.
 */
export function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const [label, setLabel] = useState('')
  const [enabled] = useState(() => !isTouch() && !prefersReducedMotion())

  useEffect(() => {
    const onMove = (e) => {
      stage.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      stage.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    if (!enabled) return () => window.removeEventListener('pointermove', onMove)

    document.documentElement.classList.add('has-cursor')
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, x: -100, y: -100 })
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' })

    const move = (e) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e) => {
      const target = e.target.closest?.('[data-cursor], a, button')
      const text = target?.dataset?.cursor ?? ''
      setLabel(text)
      gsap.to(ring.current, {
        scale: target ? (text ? 2.6 : 1.7) : 1,
        backgroundColor: text ? 'rgba(184,121,69,0.92)' : 'rgba(184,121,69,0)',
        borderColor: text ? 'rgba(184,121,69,0)' : 'rgba(242,233,220,0.6)',
        duration: 0.5,
        ease: 'expo.out',
      })
      gsap.to(dot.current, { scale: target ? 0 : 1, duration: 0.3 })
    }
    const leaveWin = () => gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 })
    const enterWin = () => gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 })

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over)
    document.addEventListener('pointerleave', leaveWin)
    document.addEventListener('pointerenter', enterWin)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerleave', leaveWin)
      document.removeEventListener('pointerenter', enterWin)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] grid size-10 place-items-center rounded-full border border-cream/60 mix-blend-normal"
      >
        <span className="text-[0.32rem] font-semibold uppercase tracking-[0.2em] text-espresso">{label}</span>
      </div>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[91] size-1.5 rounded-full bg-caramel"
      />
    </>
  )
}
