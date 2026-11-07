/**
 * Scroll progress indicator. Pure CSS: it reads --progress, which the
 * Director publishes, so it costs nothing per frame in React.
 */
export function ScrollProgress() {
  return (
    <div aria-hidden className="pointer-events-none fixed right-4 top-1/2 z-40 hidden h-40 -translate-y-1/2 md:block lg:right-7">
      <div className="relative h-full w-px bg-[color:var(--fg)]/15">
        <div
          className="absolute inset-0 origin-top bg-caramel"
          style={{ transform: 'scaleY(var(--progress))' }}
        />
      </div>
      <span className="t-eyebrow absolute left-1/2 top-full mt-4 -translate-x-1/2 text-[0.55rem] opacity-50 [writing-mode:vertical-rl]">
        Scroll
      </span>
    </div>
  )
}
