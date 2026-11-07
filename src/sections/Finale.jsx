import { useRef, useState } from 'react'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { useScene } from '../motion/useScene'
import { gsap, EASE } from '../motion/gsap'
import { useSmoothScroll } from '../motion/SmoothScroll'
import { Magnetic } from '../components/Magnetic'
import { Logo } from '../components/Nav'
import { CONTACT, FINALE, NAV_LINKS } from '../data/content'

/**
 * Scene 11: the grand finale.
 * The brand name assembles from both sides around a slowly turning cup of
 * latte art; the call to action lands last. Then the footer.
 */
export function Finale() {
  const root = useRef(null)
  const { scrollTo } = useSmoothScroll() ?? {}
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  useScene(root, (api) => {
    const { q } = api
    const stage = q('[data-finale]')[0]
    if (api.reduced) return
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom bottom', scrub: true },
    })
    tl.fromTo(q('[data-fl="1"]'), { xPercent: -45 }, { xPercent: 0 }, 0)
      .fromTo(q('[data-fl="2"]'), { xPercent: 45 }, { xPercent: 0 }, 0)
      .fromTo(q('[data-fl="3"]'), { xPercent: -30 }, { xPercent: 0 }, 0)
      .fromTo(q('[data-orb]'), { scale: 0.35, rotate: -120, yPercent: 40 }, { scale: 1, rotate: 0, yPercent: 0 }, 0)
      .fromTo(q('[data-glow]'), { opacity: 0 }, { opacity: 1 }, 0.3)

    gsap.from(q('[data-cta] > *'), {
      y: 40,
      autoAlpha: 0,
      stagger: 0.1,
      duration: 1.2,
      ease: EASE.out,
      scrollTrigger: { trigger: q('[data-cta]')[0], start: 'top 92%', toggleActions: 'play none none reverse' },
    })
    gsap.from(q('[data-foot] > *'), {
      y: 30,
      autoAlpha: 0,
      stagger: 0.06,
      duration: 1,
      ease: EASE.out,
      scrollTrigger: { trigger: q('[data-foot]')[0], start: 'top 95%', toggleActions: 'play none none reverse' },
    })
  })

  return (
    <section
      id="finale"
      ref={root}
      data-scene
      data-bg="#17100D"
      data-fg="#F2E9DC"
      aria-label="The Art of Coffee"
      className="relative overflow-hidden"
    >
      <div data-finale className="relative flex min-h-[100svh] flex-col items-center justify-center px-4 py-28">
        <div data-glow className="pointer-events-none absolute left-1/2 top-1/2 size-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-caramel/25 blur-[120px]" />

        <div data-orb className="absolute left-1/2 top-1/2 z-0 -ml-[min(22vw,180px)] -mt-[min(22vw,180px)] size-[min(44vw,360px)] overflow-hidden rounded-full shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]">
          <img src={FINALE.image} alt="Latte art in a ceramic cup, seen from above" loading="lazy" className="h-full w-full scale-125 object-cover" />
        </div>

        <h2 className="relative z-10 flex flex-col items-center text-center" aria-label="The Art of Coffee">
          <span data-fl="1" className="t-mega block whitespace-nowrap">
            THE ART
          </span>
          <span data-fl="2" className="t-mega block whitespace-nowrap italic text-caramel">
            of
          </span>
          <span data-fl="3" className="t-mega block whitespace-nowrap">
            COFFEE
          </span>
        </h2>

        <div data-cta className="relative z-10 mt-14 flex flex-col items-center gap-6 text-center">
          <p className="t-lead max-w-md text-cream/70">Your table is waiting. The kettle is already warm.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Magnetic>
              <a href={`mailto:${CONTACT.email}?subject=Table%20reservation`} className="btn btn-solid" data-cursor="Book">
                <span>Reserve your table</span>
                <ArrowUpRight size={14} />
              </a>
            </Magnetic>
            <Magnetic>
              <button type="button" className="btn btn-ghost" onClick={() => scrollTo?.('#menu')}>
                <span>Order ahead</span>
              </button>
            </Magnetic>
          </div>
        </div>
      </div>

      <footer className="relative border-t border-cream/10 px-5 pb-8 pt-16 md:px-10">
        <div data-foot className="mx-auto grid max-w-[1500px] gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/55">
              Specialty roastery and café. Single-origin coffee, roasted in small batches behind the bar since 2014.
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="t-eyebrow mb-4 text-cream/40">Explore</p>
            <ul className="space-y-2 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollTo?.(l.href)
                    }}
                    className="link-line"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="t-eyebrow mb-4 text-cream/40">Visit</p>
            <p className="text-sm leading-relaxed text-cream/75">
              {CONTACT.address[0]}
              <br />
              {CONTACT.address[1]}
            </p>
            <p className="mt-3 text-sm text-cream/75">Daily from 7:00</p>
          </div>
          <div className="md:col-span-4">
            <p className="t-eyebrow mb-4 text-cream/40">The roast letter</p>
            {joined ? (
              <p className="font-display text-2xl">Thank you. See you at the bar.</p>
            ) : (
              <form
                className="flex items-center gap-2 border-b border-cream/25 pb-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (email.includes('@')) setJoined(true)
                }}
              >
                <label htmlFor="newsletter" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email for new arrivals"
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-cream outline-none placeholder:text-cream/35"
                />
                <button type="submit" className="t-eyebrow text-caramel">
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-[1500px] flex-col items-start justify-between gap-4 border-t border-cream/10 pt-6 text-xs text-cream/40 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} The Art of Coffee. Crafted slowly.</p>
          <button type="button" onClick={() => scrollTo?.(0, { duration: 2.6 })} className="t-eyebrow flex items-center gap-2 text-[0.6rem] text-cream/60 hover:text-caramel">
            Back to top <ArrowUp size={13} />
          </button>
        </div>
      </footer>
    </section>
  )
}
