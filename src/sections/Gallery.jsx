import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useScene } from '../motion/useScene'
import { gsap, EASE } from '../motion/gsap'
import { revealText } from '../motion/presets'
import { useSmoothScroll } from '../motion/SmoothScroll'
import { GALLERY } from '../data/content'

/** Scene 08: an asymmetric, editorial gallery with a lightbox. */
export function Gallery() {
  const root = useRef(null)
  const box = useRef(null)
  const [open, setOpen] = useState(-1)
  const { stop, start } = useSmoothScroll() ?? {}

  useScene(root, (api) => {
    const { q } = api
    revealText(api, q('[data-gallery-title]')[0])
    if (api.reduced) return
    q('[data-shot]').forEach((el, i) => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(100% 0% 0% 0%)', y: 60 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          y: 0,
          duration: 1.4,
          ease: EASE.cine,
          delay: (i % 3) * 0.08,
          scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' },
        },
      )
    })
  })

  const close = useCallback(() => setOpen(-1), [])
  const step = useCallback((d) => setOpen((o) => (o + d + GALLERY.length) % GALLERY.length), [])

  useEffect(() => {
    if (open < 0) return
    stop?.()
    const el = box.current
    gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 })
    el.querySelector('button')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      start?.()
    }
  }, [open >= 0, close, step, stop, start]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (open < 0 || !box.current) return
    gsap.fromTo(box.current.querySelector('[data-lb-img]'), { scale: 1.06, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.9, ease: EASE.out })
  }, [open])

  const current = GALLERY[open]

  return (
    <section
      id="gallery"
      ref={root}
      data-scene
      data-bg="#FAF7F1"
      data-fg="#17100D"
      aria-label="Gallery"
      className="relative py-28 md:py-44"
    >
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <header className="mb-14 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
          <div>
            <p className="t-eyebrow mb-5 text-caramel">08 — Gallery</p>
            <h2 data-gallery-title className="t-display">
              Moments, <em className="italic text-caramel">poured</em>.
            </h2>
          </div>
          <p className="t-eyebrow text-espresso/50">{String(GALLERY.length).padStart(2, '0')} frames · tap to enlarge</p>
        </header>

        <ul className="grid auto-rows-[260px] grid-cols-2 gap-3 md:auto-rows-[230px] md:grid-cols-12 md:gap-5">
          {GALLERY.map((g, i) => (
            <li key={g.caption} data-shot className={`${i % 3 === 0 ? 'col-span-2' : 'col-span-1'} ${g.span}`}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                data-cursor="View"
                className="group relative block h-full w-full overflow-hidden text-left"
                aria-label={`Open image: ${g.caption}`}
              >
                <img
                  src={g.image}
                  alt={g.caption}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-100" />
                <span className="absolute inset-x-4 bottom-4 flex translate-y-2 items-end justify-between text-cream transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0">
                  <span className="font-display text-xl md:text-2xl">{g.caption}</span>
                  <span className="t-eyebrow hidden text-[0.55rem] text-cream/70 sm:block">{g.meta}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {current && (
        <div
          ref={box}
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
          className="fixed inset-0 z-[80] flex flex-col bg-espresso/95 p-5 text-cream backdrop-blur-md md:p-10"
          onClick={close}
        >
          <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
            <span className="t-eyebrow text-cream/60">
              {String(open + 1).padStart(2, '0')} / {String(GALLERY.length).padStart(2, '0')}
            </span>
            <button type="button" onClick={close} aria-label="Close" className="grid size-12 place-items-center rounded-full border border-cream/25">
              <X size={18} />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center py-6" onClick={(e) => e.stopPropagation()}>
            <img data-lb-img src={current.image} alt={current.caption} className="max-h-full max-w-full object-contain" />
          </div>
          <div className="flex items-center justify-between gap-4" onClick={(e) => e.stopPropagation()}>
            <div>
              <p className="font-display text-3xl">{current.caption}</p>
              <p className="t-eyebrow mt-1 text-cream/50">{current.meta}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="grid size-12 place-items-center rounded-full border border-cream/25">
                <ArrowLeft size={16} />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next image" className="grid size-12 place-items-center rounded-full border border-cream/25">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
