import { useRef } from 'react'
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { useScene } from '../motion/useScene'
import { gsap, EASE } from '../motion/gsap'
import { revealText } from '../motion/presets'
import { Magnetic } from '../components/Magnetic'
import { CONTACT } from '../data/content'

/** Stylised neighbourhood map (pure SVG; no third-party map scripts). */
function MapArt() {
  return (
    <svg viewBox="0 0 600 600" className="h-full w-full" role="img" aria-label="Map showing the café near the river in Old Town">
      <rect width="600" height="600" fill="#2c1c15" />
      {/* park */}
      <path data-draw d="M60 70 h150 v120 h-150 z" fill="#3a2a1d" />
      <path d="M380 420 h170 v130 h-170 z" fill="#3a2a1d" />
      {/* river */}
      <path data-draw d="M-20 470 C 120 420, 200 520, 330 470 S 520 360, 640 400" stroke="#4b3426" strokeWidth="46" fill="none" />
      <path data-draw d="M-20 470 C 120 420, 200 520, 330 470 S 520 360, 640 400" stroke="#5a3f2e" strokeWidth="2" strokeDasharray="6 10" fill="none" />
      {/* streets */}
      <g stroke="#4a362a" strokeWidth="10" fill="none" strokeLinecap="round">
        {[
          'M0 230 H600',
          'M0 330 C 200 320, 400 350, 600 300',
          'M250 0 V600',
          'M420 0 C 410 200, 450 300, 430 600',
          'M100 0 C 120 200, 80 400, 120 600',
          'M0 120 C 200 140, 400 90, 600 140',
        ].map((d) => (
          <path key={d} data-draw d={d} />
        ))}
      </g>
      <g stroke="#3b2b21" strokeWidth="3" fill="none">
        {['M0 280 H600', 'M330 0 V600', 'M180 0 V600', 'M0 180 H600', 'M520 0 V600'].map((d) => (
          <path key={d} data-draw d={d} />
        ))}
      </g>
      <text x="270" y="222" fill="#8a6a52" fontSize="11" letterSpacing="3" style={{ fontFamily: 'var(--font-sans)' }}>
        ROASTERY LANE
      </text>
      <text x="40" y="455" fill="#8a6a52" fontSize="11" letterSpacing="3" style={{ fontFamily: 'var(--font-sans)' }}>
        RIVERSIDE
      </text>
      <text x="75" y="135" fill="#8a6a52" fontSize="11" letterSpacing="3" style={{ fontFamily: 'var(--font-sans)' }}>
        OLD TOWN PARK
      </text>
      {/* pin */}
      <g transform="translate(300 270)">
        <circle r="12" fill="#B87945" style={{ transformOrigin: 'center', transformBox: 'fill-box', animation: 'pulse-ring 2.4s ease-out infinite' }} />
        <circle r="12" fill="#B87945" style={{ transformOrigin: 'center', transformBox: 'fill-box', animation: 'pulse-ring 2.4s ease-out 1.2s infinite' }} />
        <circle r="10" fill="#B87945" stroke="#F2E9DC" strokeWidth="3" />
      </g>
    </svg>
  )
}

/** Scene 10: visit us. */
export function Contact() {
  const root = useRef(null)

  useScene(root, (api) => {
    const { q } = api
    revealText(api, q('[data-visit-title]')[0])
    if (api.reduced) return
    gsap.from(q('[data-info]'), {
      y: 40,
      autoAlpha: 0,
      stagger: 0.08,
      duration: 1.1,
      ease: EASE.out,
      scrollTrigger: { trigger: q('[data-info]')[0], start: 'top 88%', toggleActions: 'play none none reverse' },
    })
    // Streets draw themselves in as the map opens
    const streets = q('[data-draw]').filter((p) => !p.getAttribute('stroke-dasharray') && p.getAttribute('fill') !== '#3a2a1d')
    streets.forEach((p) => {
      const len = p.getTotalLength()
      gsap.fromTo(
        p,
        { strokeDasharray: len, strokeDashoffset: len },
        {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: EASE.cine,
          scrollTrigger: { trigger: q('[data-map]')[0], start: 'top 75%', toggleActions: 'play none none reverse' },
        },
      )
    })
    gsap.fromTo(
      q('[data-map]'),
      { clipPath: 'inset(10% 10% 10% 10% round 400px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 28px)',
        ease: 'none',
        scrollTrigger: { trigger: q('[data-map]')[0], start: 'top 95%', end: 'top 35%', scrub: true },
      },
    )
    gsap.fromTo(
      q('[data-map] svg'),
      { scale: 1.3, rotate: -4 },
      { scale: 1, rotate: 0, ease: 'none', scrollTrigger: { trigger: q('[data-map]')[0], start: 'top bottom', end: 'top 30%', scrub: true } },
    )
  })

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.mapsQuery)}`

  return (
    <section
      id="visit"
      ref={root}
      data-scene
      data-bg="#39251C"
      data-fg="#F2E9DC"
      aria-label="Visit us"
      className="relative py-28 md:py-40"
    >
      <div className="mx-auto grid max-w-[1500px] gap-14 px-5 md:px-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p className="t-eyebrow mb-5 text-caramel">10 — Visit</p>
          <h2 data-visit-title className="t-display mb-12">
            Come in, <em className="italic text-caramel">stay</em> a while.
          </h2>

          <div className="grid gap-10 sm:grid-cols-2">
            <div data-info>
              <p className="t-eyebrow mb-4 flex items-center gap-2 text-cream/50">
                <MapPin size={13} /> Address
              </p>
              <address className="font-display text-2xl not-italic leading-snug">
                {CONTACT.address.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
            </div>
            <div data-info>
              <p className="t-eyebrow mb-4 flex items-center gap-2 text-cream/50">
                <Clock size={13} /> Hours
              </p>
              <dl className="space-y-2">
                {CONTACT.hours.map((h) => (
                  <div key={h.day} className="flex justify-between gap-4 border-b border-cream/10 pb-2 text-sm">
                    <dt className="text-cream/70">{h.day}</dt>
                    <dd className="tabular-nums">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div data-info>
              <p className="t-eyebrow mb-4 text-cream/50">Contact</p>
              <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`} className="link-line mb-2 flex w-fit items-center gap-2">
                <Phone size={14} className="text-caramel" /> {CONTACT.phone}
              </a>
              <a href={`mailto:${CONTACT.email}`} className="link-line flex w-fit items-center gap-2">
                <Mail size={14} className="text-caramel" /> {CONTACT.email}
              </a>
            </div>
            <div data-info>
              <p className="t-eyebrow mb-4 text-cream/50">Follow</p>
              <ul className="space-y-2">
                {CONTACT.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="link-line inline-flex items-center gap-1">
                      {s.label} <ArrowUpRight size={13} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div data-info className="mt-12 flex flex-wrap gap-3">
            <Magnetic>
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn btn-solid" data-cursor="Go">
                <span>Get directions</span>
                <ArrowUpRight size={14} />
              </a>
            </Magnetic>
            <Magnetic>
              <a href={`mailto:${CONTACT.email}?subject=Table%20reservation`} className="btn btn-ghost">
                <span>Reserve a table</span>
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div data-map className="relative aspect-square overflow-hidden rounded-[28px] lg:aspect-auto lg:h-full lg:min-h-[640px]">
            <MapArt />
            <div className="absolute bottom-5 left-5 right-5 flex items-center gap-4 rounded-2xl bg-espresso/80 p-4 backdrop-blur-md md:right-auto">
              <img src={CONTACT.image} alt="" loading="lazy" className="size-16 rounded-xl object-cover" />
              <div>
                <p className="font-display text-xl">The Art of Coffee</p>
                <p className="text-sm text-cream/60">{CONTACT.address.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
