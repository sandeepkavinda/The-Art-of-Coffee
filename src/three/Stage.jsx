import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { stage } from '../motion/stage'
import { CupModel } from './CupModel'
import { Beans } from './Beans'
import { LAYERS } from '../data/content'

/**
 * The persistent WebGL stage behind the Hero and the Anatomy section.
 * One canvas, one cup: the hero cup *is* the exploded cup, so the transition
 * between the two sections is continuous rather than a cut.
 * Rendering pauses entirely once the stage is scrolled out of view.
 */
export default function Stage() {
  const [visible, setVisible] = useState(stage.visible)
  const [vw, setVw] = useState(() => window.innerWidth)
  const labels = useRef([])

  useEffect(() => stage.onVisible(setVisible), [])
  useEffect(() => {
    let raf
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setVw(window.innerWidth))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const mobile = vw < 768
  return (
    <>
    <Canvas
      frameloop={visible ? 'always' : 'never'}
      dpr={[1, mobile ? 1.5 : 2]}
      camera={{ position: [0, 0.35, 9.5], fov: 35, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.35} color="#ffe6cc" />
      <directionalLight position={[4, 6, 5]} intensity={2.6} color="#ffe2c2" />
      <directionalLight position={[-5, 2, -4]} intensity={2.2} color="#b87945" />
      <directionalLight position={[0, -4, 3]} intensity={0.4} color="#f2e9dc" />

      {/* Procedural studio reflections: no HDR download needed */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} color="#fff4e6" position={[0, 5, -3]} scale={[12, 2, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={2} color="#d69a63" position={[5, 0, 1]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#ffffff" position={[0, 0, 6]} scale={3} />
      </Environment>

      <CupModel labels={labels} />
      <Beans count={mobile ? 16 : 34} />
    </Canvas>

    {/* Layer callouts: plain DOM, positioned each frame by projecting 3D anchors */}
    {vw >= 1024 && (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {LAYERS.map((l, i) => (
          <div
            key={l.key}
            ref={(el) => (labels.current[i] = el)}
            className="absolute left-0 top-0 flex items-center gap-3 whitespace-nowrap text-cream opacity-0 will-change-transform"
          >
            <span className="h-px w-10 bg-cream/50" />
            <span className="t-eyebrow text-[0.6rem]">
              <span className="text-caramel">0{i + 1}</span>&nbsp;&nbsp;{l.short}
            </span>
          </div>
        ))}
      </div>
    )}
    </>
  )
}
