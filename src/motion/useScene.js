import { useLayoutEffect } from 'react'
import SplitType from 'split-type'
import { gsap, MQ } from './gsap'

/**
 * useScene: the one way a section declares its choreography.
 *
 * Wraps gsap.matchMedia so every timeline / ScrollTrigger created inside
 * `build` is scoped to the section, rebuilt when breakpoints or the
 * reduced-motion preference change, and fully reverted on unmount.
 * Text splits made with `api.split()` are reverted too, so the DOM React
 * rendered is always restored.
 *
 * build(api) receives:
 *   api.reduced / api.mobile / api.desktop  active conditions
 *   api.q(selector)                          scoped selector
 *   api.split(target, types)                 SplitType helper (auto-reverted)
 * and may return a cleanup function.
 */
export function useScene(scopeRef, build, deps = []) {
  useLayoutEffect(() => {
    const scope = scopeRef.current
    if (!scope) return
    const mm = gsap.matchMedia(scope)

    mm.add({ reduced: MQ.reduced, mobile: MQ.mobile, desktop: MQ.desktop }, (ctx) => {
      const splits = []
      const api = {
        ...ctx.conditions,
        scope,
        q: gsap.utils.selector(scope),
        split(target, types = 'words,chars') {
          const s = new SplitType(target, { types, tagName: 'span' })
          splits.push(s)
          return s
        },
      }
      const cleanup = build(api)
      return () => {
        if (typeof cleanup === 'function') cleanup()
        splits.forEach((s) => s.revert())
      }
    })

    return () => mm.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
