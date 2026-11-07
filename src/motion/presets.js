// Reusable motion vocabulary. Sections compose these instead of inventing
// one-off animations, so the whole site shares the same cadence.
import { gsap, EASE } from './gsap'

/** Characters rise out of their word mask. */
export function charsIn(chars, opts = {}) {
  return gsap.fromTo(
    chars,
    { yPercent: 115, rotate: opts.rotate ?? 6 },
    {
      yPercent: 0,
      rotate: 0,
      duration: opts.duration ?? 1.2,
      ease: opts.ease ?? EASE.out,
      stagger: opts.stagger ?? 0.025,
      delay: opts.delay ?? 0,
      ...opts.vars,
    },
  )
}

/** Scroll-triggered text reveal (plays on enter, reverses on leave-back). */
export function revealText(api, el, { types = 'words,chars', start = 'top 85%', stagger } = {}) {
  if (!el) return
  if (api.reduced) {
    return gsap.from(el, {
      autoAlpha: 0,
      duration: 0.6,
      scrollTrigger: { trigger: el, start, toggleActions: 'play none none reverse' },
    })
  }
  const split = api.split(el, types)
  const targets = types.includes('chars') ? split.chars : split.words
  el.classList.add('mask-words')
  return gsap.fromTo(
    targets,
    { yPercent: 115 },
    {
      yPercent: 0,
      duration: 1.1,
      ease: EASE.out,
      stagger: stagger ?? (types.includes('chars') ? 0.018 : 0.04),
      scrollTrigger: { trigger: el, start, toggleActions: 'play none none reverse' },
    },
  )
}

/** Clip-path image reveal with a counter-scaled image inside. */
export function maskReveal(api, wrap, { from = 'inset(100% 0% 0% 0%)', start = 'top 85%', scrub = false } = {}) {
  if (!wrap) return
  const img = wrap.querySelector('img')
  if (api.reduced) {
    return gsap.from(wrap, { autoAlpha: 0, duration: 0.8, scrollTrigger: { trigger: wrap, start } })
  }
  const tl = gsap.timeline({
    scrollTrigger: scrub
      ? { trigger: wrap, start, end: 'top 30%', scrub: true }
      : { trigger: wrap, start, toggleActions: 'play none none reverse' },
  })
  tl.fromTo(wrap, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: EASE.cine })
  if (img) tl.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.6, ease: EASE.out }, 0)
  return tl
}

/** Scrubbed parallax: moves an element by `amount` (yPercent) across its viewport journey. */
export function parallax(api, el, amount = 15, trigger) {
  if (!el || api.reduced) return
  return gsap.fromTo(
    el,
    { yPercent: -amount },
    {
      yPercent: amount,
      ease: 'none',
      scrollTrigger: { trigger: trigger ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
    },
  )
}
