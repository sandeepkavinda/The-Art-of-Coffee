import { useRef } from 'react'
import { useScene } from '../motion/useScene'
import { gsap } from '../motion/gsap'
import { maskReveal, parallax, revealText } from '../motion/presets'
import { ATMOSPHERE } from '../data/content'

/**
 * Scene 07: The House.
 * A framed photograph pins and opens to full-bleed as if you stepped through
 * the door, then tiles drift on three parallax planes.
 */
export function Atmosphere() {
  const root = useRef(null)

  useScene(root, (api) => {
    const { q } = api
    revealText(api, q('[data-atmos-title]')[0])

    const caption = api.split(q('[data-room-title]')[0], 'words,chars')
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: q('[data-room]')[0],
        start: 'top top',
        end: api.mobile ? '+=90%' : '+=130%',
        pin: true,
        scrub: true,
      },
    })
    tl.fromTo(
      q('[data-room-frame]'),
      { clipPath: api.mobile ? 'inset(22% 8% 22% 8% round 24px)' : 'inset(20% 26% 20% 26% round 28px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1 },
    )
      .fromTo(q('[data-room-frame] img'), { scale: 1.45 }, { scale: 1, duration: 1 }, 0)
      .fromTo(q('[data-room-shade]'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.4)
      .fromTo(caption.chars, { yPercent: 115 }, { yPercent: 0, stagger: 0.012, duration: 0.4, ease: 'power3.out' }, 0.55)
      .fromTo(q('[data-room-sub]'), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3 }, 0.75)

    q('[data-tile]').forEach((t) => maskReveal(api, t.querySelector('.media'), { start: 'top 92%' }))
    const cols = q('[data-col]')
    parallax(api, cols[0], 4, root.current)
    parallax(api, cols[1], -8, root.current)
    parallax(api, cols[2], 6, root.current)
  })

  const cols = [0, 1, 2].map((c) => ATMOSPHERE.tiles.filter((_, i) => i % 3 === c))

  return (
    <section
      id="house"
      ref={root}
      data-scene
      data-bg="#17100D"
      data-fg="#F2E9DC"
      aria-label="The coffee house"
      className="relative pb-28 pt-28 md:pb-44 md:pt-40"
    >
      <header className="mx-auto mb-16 flex max-w-[1500px] flex-col justify-between gap-8 px-5 md:mb-24 md:flex-row md:items-end md:px-10">
        <div>
          <p className="t-eyebrow mb-5 text-caramel">07 — The House</p>
          <h2 data-atmos-title className="t-display">
            Warm light, <em className="italic text-caramel">long</em> tables.
          </h2>
        </div>
        <p className="t-lead max-w-sm text-cream/60">
          A former printworks with eighteen-foot ceilings, reclaimed oak and a bar you can see from every seat.
        </p>
      </header>

      <div data-room className="relative h-[100svh] overflow-hidden">
        <div data-room-frame className="absolute inset-0 overflow-hidden">
          <img src={ATMOSPHERE.hero} alt="The café interior in warm evening light" loading="lazy" className="h-full w-full object-cover" />
          <div data-room-shade className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-espresso/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso/60 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-12 px-5 md:bottom-20 md:px-10">
          <h3 data-room-title data-mask className="t-mega !text-[clamp(3rem,10vw,10rem)]">
            Built for slowness
          </h3>
          <p data-room-sub className="t-lead mt-6 max-w-md text-cream/75">
            No laptops at the window bar after five. Just coffee, conversation and the low hum of the grinder.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-24 grid max-w-[1500px] gap-5 px-5 md:mt-40 md:grid-cols-3 md:gap-8 md:px-10">
        {cols.map((col, c) => (
          <div key={c} data-col className={`flex flex-col gap-5 md:gap-8 ${c === 1 ? 'md:pt-40' : c === 2 ? 'md:pt-16' : ''}`}>
            {col.map((t) => (
              <figure key={t.title} data-tile>
                <div className="media aspect-[4/5]" data-cursor="View">
                  <img src={t.image} alt={t.title} loading="lazy" className="transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] hover:scale-105" />
                </div>
                <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="font-display text-2xl">{t.title}</span>
                  <span className="text-right text-sm text-cream/55">{t.text}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
