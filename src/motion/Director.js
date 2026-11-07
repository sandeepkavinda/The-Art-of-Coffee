import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger } from './gsap'

/**
 * The Director: page-level choreography that no single section owns.
 *
 * Every <section data-scene data-bg data-fg> declares its palette. The Director
 * builds scrubbed transitions so the page background and foreground colours
 * morph continuously from one scene into the next (and back when scrolling up),
 * and publishes overall scroll progress as a CSS variable.
 *
 * It runs after all sections have mounted (parent effect), then sorts and
 * refreshes every ScrollTrigger so pinned sections are measured in page order.
 */
export function useDirector() {
  useLayoutEffect(() => {
    const root = document.documentElement
    const scenes = gsap.utils.toArray('[data-scene]')
    const palette = scenes.map((el) => ({ bg: el.dataset.bg, fg: el.dataset.fg }))
    const apply = ({ bg, fg }) => {
      root.style.setProperty('--bg', bg)
      root.style.setProperty('--fg', fg)
    }
    if (palette[0]) apply(palette[0])

    const triggers = scenes.slice(1).map((el, i) => {
      const from = palette[i]
      const to = palette[i + 1]
      const lerp = gsap.utils.interpolate(from, to)
      return ScrollTrigger.create({
        trigger: el,
        start: el.dataset.colorStart || 'top 70%',
        end: el.dataset.colorEnd || 'top 20%',
        onUpdate: (self) => apply(lerp(self.progress)),
        onLeave: () => apply(to),
        onLeaveBack: () => apply(from),
      })
    })

    const progress = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => root.style.setProperty('--progress', self.progress.toFixed(4)),
    })

    ScrollTrigger.sort()
    ScrollTrigger.refresh()

    // Re-measure once web fonts and late images settle (prevents drift).
    let raf
    const refresh = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('load', refresh)
      triggers.forEach((t) => t.kill())
      progress.kill()
    }
  }, [])
}
