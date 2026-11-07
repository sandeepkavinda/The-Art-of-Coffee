import { useRef } from 'react'
import { useScene } from '../motion/useScene'
import { gsap, EASE } from '../motion/gsap'
import { maskReveal, parallax, revealText } from '../motion/presets'
import { STORY } from '../data/content'

/**
 * Scene 06: Brand story, set like a magazine spread on cream paper.
 * The manifesto "reads itself" (words light up with scroll), then images
 * open through clip-path masks with inner parallax.
 */
export function Story() {
  const root = useRef(null)

  useScene(root, (api) => {
    const { q } = api
    const manifesto = q('[data-manifesto]')[0]
    const words = api.split(manifesto, 'words').words
    gsap.fromTo(
      words,
      { opacity: 0.14 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: manifesto, start: 'top 80%', end: 'bottom 45%', scrub: true },
      },
    )

    revealText(api, q('[data-story-title]')[0])
    maskReveal(api, q('[data-tall]')[0], { from: 'inset(0% 0% 100% 0%)' })
    maskReveal(api, q('[data-small="1"]')[0], { from: 'inset(0% 100% 0% 0%)', start: 'top 90%' })
    maskReveal(api, q('[data-small="2"]')[0], { from: 'inset(0% 0% 0% 100%)', start: 'top 90%' })
    parallax(api, q('[data-tall] img')[0], 8, q('[data-tall]')[0])
    parallax(api, q('[data-small="1"]')[0], -14)
    parallax(api, q('[data-small="2"]')[0], 18)

    if (!api.reduced) {
      q('[data-pillar]').forEach((p, i) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: p, start: 'top 88%', toggleActions: 'play none none reverse' },
          delay: (i % 4) * 0.08,
        })
        tl.fromTo(p.querySelector('[data-line]'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: EASE.cine })
          .from(p.querySelectorAll('[data-in]'), { y: 30, autoAlpha: 0, stagger: 0.08, duration: 1, ease: EASE.out }, 0.25)
      })
    }
  })

  return (
    <section
      id="story"
      ref={root}
      data-scene
      data-bg="#F2E9DC"
      data-fg="#17100D"
      aria-label="Our story"
      className="relative py-28 md:py-44"
    >
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <p className="t-eyebrow mb-10 text-caramel">06 — Our Story</p>
        <p data-manifesto className="font-display text-[clamp(1.8rem,4.2vw,4.4rem)] leading-[1.08] tracking-[-0.02em]">
          {STORY.manifesto}
        </p>

        <div className="mt-24 grid gap-12 md:mt-40 md:grid-cols-12 md:gap-10">
          <div data-tall className="media aspect-[4/5] md:col-span-5 md:aspect-auto md:min-h-[78vh]">
            <img src={STORY.images.tall} alt="A barista preparing pour-over coffee at the slow bar" loading="lazy" className="scale-110" />
          </div>

          <div className="flex flex-col justify-between md:col-span-6 md:col-start-7">
            <div>
              <h2 data-story-title className="t-display mb-8">
                Crafted by hand, <em className="italic text-caramel">measured</em> by heart.
              </h2>
              <p className="t-lead max-w-lg text-espresso/70">
                It started in 2014 with a two-group lever machine and a stubborn idea: that a café could be as
                rigorous as a laboratory and as warm as a kitchen. We still roast every bean we pour, in a
                twelve-kilo drum behind the bar.
              </p>
            </div>

            <div className="relative mt-16 grid grid-cols-2 gap-5 md:mt-10">
              <div data-small="1" className="media aspect-[3/4]">
                <img src={STORY.images.hands} alt="Hands holding freshly roasted coffee beans" loading="lazy" />
              </div>
              <div data-small="2" className="media mt-16 aspect-[3/4]">
                <img src={STORY.images.barista} alt="Barista pouring latte art" loading="lazy" />
              </div>
            </div>
            <p className="mt-10 font-display text-2xl italic text-espresso/80">— Mateo &amp; Lina, founders</p>
          </div>
        </div>

        <div className="mt-28 grid gap-10 sm:grid-cols-2 md:mt-40 lg:grid-cols-4">
          {STORY.pillars.map((p) => (
            <article key={p.title} data-pillar>
              <div data-line className="mb-6 h-px origin-left bg-espresso/30" />
              <p data-in className="mb-6 font-display text-2xl italic text-caramel">
                {p.no}
              </p>
              <h3 data-in className="t-h3 mb-4">
                {p.title}
              </h3>
              <p data-in className="leading-relaxed text-espresso/65">
                {p.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
