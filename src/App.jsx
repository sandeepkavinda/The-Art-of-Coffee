import { lazy, Suspense } from 'react'
import { SmoothScroll } from './motion/SmoothScroll'
import { useDirector } from './motion/Director'
import { OrderProvider } from './components/OrderContext'
import { Loader } from './components/Loader'
import { Nav } from './components/Nav'
import { Cursor } from './components/Cursor'
import { ScrollProgress } from './components/ScrollProgress'
import { Hero } from './sections/Hero'
import { Exploded } from './sections/Exploded'
import { Journey } from './sections/Journey'
import { Pour } from './sections/Pour'
import { Menu } from './sections/Menu'
import { Story } from './sections/Story'
import { Atmosphere } from './sections/Atmosphere'
import { Gallery } from './sections/Gallery'
import { Testimonials } from './sections/Testimonials'
import { Contact } from './sections/Contact'
import { Finale } from './sections/Finale'

// three.js is the heaviest dependency: load it in its own chunk.
const Stage = lazy(() => import('./three/Stage'))

/**
 * Scene order is the film's edit. Each section owns its own timeline
 * (useScene); the Director stitches them together with continuous colour
 * transitions; the fixed WebGL stage carries one cup from the Hero through
 * the Anatomy until the Journey takes over.
 */
function Film() {
  useDirector()
  return (
    <>
      <div id="stage-canvas" aria-hidden className="pointer-events-none fixed inset-0 z-[5]">
        <Suspense fallback={null}>
          <Stage />
        </Suspense>
      </div>

      <main>
        <Hero />
        <Exploded />
        <Journey />
        <Pour />
        <Menu />
        <Story />
        <Atmosphere />
        <Gallery />
        <Testimonials />
        <Contact />
        <Finale />
      </main>
    </>
  )
}

export default function App() {
  return (
    <SmoothScroll>
      <OrderProvider>
        <a href="#menu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-cream focus:px-4 focus:py-2 focus:text-espresso">
          Skip to menu
        </a>
        <Loader />
        <Nav />
        <Film />
        <ScrollProgress />
        <Cursor />
        <div className="grain" aria-hidden />
      </OrderProvider>
    </SmoothScroll>
  )
}
