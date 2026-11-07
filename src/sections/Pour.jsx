import { useRef } from 'react'
import { useScene } from '../motion/useScene'
import { gsap } from '../motion/gsap'

const WORDS = ['Slow.', 'Precise.', 'Poured.']
const STATS = [
  { k: 'Water', v: '93°C' },
  { k: 'Dose', v: '18 g' },
  { k: 'Bloom', v: '0:45' },
]

/**
 * Scene 04: the pour.
 * A layered SVG pour (stream, rising crema surface, ripples, steam) driven by
 * scroll. The stream length, fill level and copy share one scrubbed timeline.
 * At the end the coffee floods the frame and becomes the Menu's background,
 * a literal liquid transition into the next scene.
 */
export function Pour() {
  const root = useRef(null)

  useScene(root, (api) => {
    const { q } = api
    const stream = q('[data-stream]')[0]
    const len = stream.getTotalLength()
    gsap.set(stream, { strokeDasharray: len, strokeDashoffset: len })
    const ml = { v: 0 }
    const mlEl = q('[data-ml]')[0]
    const words = q('[data-word]')
    const splits = words.map((w) => api.split(w, 'words,chars'))

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        end: api.mobile ? '+=260%' : '+=320%',
        pin: true,
        scrub: true,
      },
    })
    tl.set({}, {}, 1)

    // Stream falls, then the tail drops away
    tl.to(stream, { strokeDashoffset: 0, duration: 0.14, ease: 'power1.in' }, 0.04)
      .fromTo(q('[data-kettle]'), { rotate: -6, x: 30, y: -20 }, { rotate: 8, x: 0, y: 0, duration: 0.12, ease: 'power2.out' }, 0)
      .to(stream, { strokeDashoffset: -len, duration: 0.1, ease: 'power1.in' }, 0.62)
      .to(q('[data-kettle]'), { rotate: -10, x: 40, y: -40, autoAlpha: 0, duration: 0.12, ease: 'power2.in' }, 0.64)

    // Surface rises inside the rim; ripples are active while pouring
    tl.fromTo(q('[data-surface]'), { attr: { cy: 432, rx: 78, ry: 14 } }, { attr: { cy: 398, rx: 106, ry: 19 }, duration: 0.5, ease: 'power1.out' }, 0.16)
      .fromTo(q('[data-crema]'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.3)
      .fromTo(q('[data-ripples]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04 }, 0.17)
      .to(q('[data-ripples]'), { autoAlpha: 0, duration: 0.06 }, 0.66)
      .to(ml, { v: 180, duration: 0.5, ease: 'power1.out', onUpdate: () => (mlEl.textContent = Math.round(ml.v)) }, 0.16)
      .fromTo(q('[data-steam] path'), { autoAlpha: 0, y: 20 }, { autoAlpha: 0.6, y: 0, stagger: 0.02, duration: 0.1 }, 0.62)

    // Copy: three words, one per beat of the pour
    splits.forEach((s, i) => {
      const at = 0.06 + i * 0.2
      if (api.reduced) tl.fromTo(words[i], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, at)
      else tl.fromTo(s.chars, { yPercent: 115 }, { yPercent: 0, stagger: 0.006, duration: 0.08, ease: 'power3.out' }, at)
    })
    tl.fromTo(q('[data-stat]'), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.03, duration: 0.08 }, 0.2)

    // Flood: the coffee rises past the frame and becomes the Menu
    tl.fromTo(q('[data-flood]'), { yPercent: 102 }, { yPercent: 0, duration: 0.24, ease: 'power2.in' }, 0.76)
      .to(q('[data-pour-scene]'), { y: -80, scale: 0.94, duration: 0.24, ease: 'power2.in' }, 0.76)

    // Ambient loops (continuous, not scroll-bound): ripples + stream shimmer
    if (!api.reduced) {
      gsap.fromTo(
        q('[data-ripple]'),
        { attr: { rx: 4, ry: 1 }, opacity: 0.9 },
        { attr: { rx: 70, ry: 12 }, opacity: 0, duration: 1.6, repeat: -1, stagger: 0.53, ease: 'power1.out' },
      )
      gsap.to(q('[data-steam] path'), { x: 6, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.4 })
      gsap.to(q('[data-wave]'), { xPercent: -50, duration: 6, repeat: -1, ease: 'none' })
    }
  })

  return (
    <section
      ref={root}
      data-scene
      data-bg="#F2E9DC"
      data-fg="#17100D"
      aria-label="The pour"
      className="relative h-[100svh] overflow-hidden"
    >
      <div className="mx-auto grid h-full max-w-[1500px] grid-rows-[auto_1fr] items-center px-5 pt-24 md:grid-cols-12 md:grid-rows-1 md:px-10 md:pt-0">
        {/* Words */}
        <div className="md:col-span-6 lg:col-span-5">
          <p className="t-eyebrow mb-6 text-caramel">04 — The Pour</p>
          <div className="space-y-1">
            {WORDS.map((w, i) => (
              <div key={w} data-word data-mask className={`t-mega !text-[clamp(3.2rem,9vw,9rem)] ${i === 1 ? 'italic text-caramel' : ''}`}>
                {w}
              </div>
            ))}
          </div>
          <dl className="mt-10 hidden grid-cols-3 gap-6 border-t border-espresso/15 pt-6 md:grid">
            {STATS.map((s) => (
              <div key={s.k} data-stat>
                <dt className="t-eyebrow mb-2 text-espresso/50">{s.k}</dt>
                <dd className="font-display text-3xl">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Pour scene */}
        <div data-pour-scene className="relative mx-auto h-full max-h-[52svh] w-full md:col-span-6 md:col-start-7 md:max-h-[86svh] lg:col-span-6 lg:col-start-7">
          <svg viewBox="0 0 400 640" className="h-full w-full overflow-visible" role="img" aria-label="Coffee being poured into a cup">
            <defs>
              <linearGradient id="stream-g" x1="0" x2="1">
                <stop offset="0" stopColor="#3b2014" />
                <stop offset=".45" stopColor="#7a4423" />
                <stop offset="1" stopColor="#2a160c" />
              </linearGradient>
              <radialGradient id="surface-g" cx=".45" cy=".4" r=".7">
                <stop offset="0" stopColor="#8a5631" />
                <stop offset=".55" stopColor="#4a2816" />
                <stop offset="1" stopColor="#24120a" />
              </radialGradient>
              <radialGradient id="crema-g" cx=".5" cy=".5" r=".5">
                <stop offset=".55" stopColor="#c08a5a" stopOpacity="0" />
                <stop offset=".85" stopColor="#c99566" stopOpacity=".85" />
                <stop offset="1" stopColor="#d9a874" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="cup-g" x1="0" x2="1">
                <stop offset="0" stopColor="#e9dfd1" />
                <stop offset=".35" stopColor="#ffffff" />
                <stop offset=".75" stopColor="#f3ece2" />
                <stop offset="1" stopColor="#d8cbb9" />
              </linearGradient>
              <clipPath id="rim-clip">
                <ellipse cx="200" cy="392" rx="110" ry="22" />
              </clipPath>
              <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="10" />
              </filter>
            </defs>

            {/* Gooseneck kettle */}
            <g data-kettle style={{ transformOrigin: '360px 0px', transformBox: 'view-box' }}>
              {/* matte-black gooseneck kettle, body mostly off-frame top right */}
              <defs>
                <linearGradient id="kettle-g" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#4a3329" />
                  <stop offset=".5" stopColor="#261812" />
                  <stop offset="1" stopColor="#17100D" />
                </linearGradient>
              </defs>
              {/* handle */}
              <path d="M436 -70 C 492 -74, 500 22, 440 30" stroke="#261812" strokeWidth="12" fill="none" strokeLinecap="round" />
              {/* lid + knob */}
              <rect x="330" y="-104" width="90" height="10" rx="5" fill="#39251C" />
              <rect x="364" y="-118" width="22" height="16" rx="6" fill="#B87945" />
              {/* body: slightly tapered, soft shoulders */}
              <path d="M312 -94 Q 312 -100 320 -100 L 430 -100 Q 438 -100 438 -94 L 446 34 Q 448 56 424 56 L 326 56 Q 302 56 304 34 Z" fill="url(#kettle-g)" />
              <path d="M330 -84 L 324 30" stroke="#ffffff" strokeOpacity=".08" strokeWidth="8" strokeLinecap="round" />
              <rect x="304" y="40" width="142" height="5" fill="#B87945" opacity=".7" />
              {/* gooseneck: rises from the base of the body, arcs and tapers down to the tip */}
              <path d="M300 40 C 262 52, 250 100, 236 88 C 224 78, 214 62, 204 60 C 199 59, 197 62, 197 68" stroke="url(#kettle-g)" strokeWidth="11" fill="none" strokeLinecap="round" />
              <path d="M296 36 C 262 48, 252 92, 238 82" stroke="#6b4a3a" strokeOpacity=".7" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>

            {/* Stream */}
            <path data-stream d="M197 70 C 197 160, 200 260, 201 396" stroke="url(#stream-g)" strokeWidth="7" fill="none" strokeLinecap="round" />

            {/* Shadow + saucer */}
            <ellipse cx="200" cy="590" rx="190" ry="26" fill="#17100D" opacity=".18" filter="url(#soft)" />
            <ellipse cx="200" cy="572" rx="176" ry="30" fill="#e6dccd" />
            <ellipse cx="200" cy="566" rx="168" ry="25" fill="#faf7f1" />
            <ellipse cx="200" cy="566" rx="96" ry="13" fill="#e9dfd1" />

            {/* Handle */}
            <path d="M306 420 C 372 410, 378 500, 300 510" stroke="#efe6d9" strokeWidth="20" fill="none" strokeLinecap="round" />
            <path d="M306 420 C 372 410, 378 500, 300 510" stroke="#d8cbb9" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".7" />

            {/* Cup body */}
            <path d="M90 392 C 92 470, 120 552, 200 556 C 280 552, 308 470, 310 392 Z" fill="url(#cup-g)" />
            <path d="M120 420 C 126 480, 148 530, 180 544" stroke="#ffffff" strokeWidth="6" strokeOpacity=".7" fill="none" strokeLinecap="round" />

            {/* Inside of the cup + liquid surface (clipped to the rim) */}
            <ellipse cx="200" cy="392" rx="110" ry="22" fill="#d6c7b3" />
            <g clipPath="url(#rim-clip)">
              <ellipse cx="200" cy="384" rx="110" ry="22" fill="#c9b8a1" />
              <ellipse data-surface cx="200" cy="432" rx="78" ry="14" fill="url(#surface-g)" />
              <ellipse data-crema cx="200" cy="398" rx="106" ry="19" fill="url(#crema-g)" opacity="0" />
              <g data-ripples opacity="0">
                {[0, 1, 2].map((i) => (
                  <ellipse key={i} data-ripple cx="201" cy="402" rx="4" ry="1" fill="none" stroke="#e2b98e" strokeWidth="1.4" />
                ))}
              </g>
            </g>
            <ellipse cx="200" cy="392" rx="110" ry="22" fill="none" stroke="#ffffff" strokeWidth="3" />

            {/* Steam */}
            <g data-steam stroke="#39251C" strokeOpacity=".35" strokeWidth="3" fill="none" strokeLinecap="round">
              <path d="M170 360 C 155 330, 185 310, 170 280 C 158 255, 180 240, 172 220" opacity="0" />
              <path d="M205 350 C 190 320, 220 300, 205 268 C 194 244, 214 226, 206 204" opacity="0" />
              <path d="M238 362 C 224 334, 252 316, 238 286 C 228 262, 246 248, 240 228" opacity="0" />
            </g>
          </svg>

          <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-baseline gap-2 md:-bottom-2">
            <span data-ml className="font-display text-5xl tabular-nums md:text-6xl">
              0
            </span>
            <span className="t-eyebrow text-espresso/50">ml</span>
          </div>
        </div>
      </div>

      {/* Coffee flood: becomes the Menu background */}
      <div data-flood className="absolute inset-0 z-10 bg-roast">
        <div className="absolute -top-[38px] left-0 h-10 w-[200%] overflow-hidden">
          <svg data-wave viewBox="0 0 2400 40" preserveAspectRatio="none" className="h-full w-full fill-roast">
            <path d="M0 20 Q 150 0 300 20 T 600 20 T 900 20 T 1200 20 T 1500 20 T 1800 20 T 2100 20 T 2400 20 V 40 H 0 Z" />
          </svg>
        </div>
      </div>
    </section>
  )
}
