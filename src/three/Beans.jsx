import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { stage } from '../motion/stage'
import { beanGeometry } from './geometry'

const { damp, smoothstep } = THREE.MathUtils

// Deterministic pseudo-random so beans don't jump between reloads/HMR.
function rng(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** Floating roasted beans orbiting the cup: one instanced draw call. */
export function Beans({ count = 34 }) {
  const mesh = useRef()
  const sm = useRef({ intro: 0, hero: 0, explode: 0, outro: 0, px: 0, py: 0 })
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const geometry = useMemo(() => beanGeometry(), [])
  const material = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#3b1f12', roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.4 }),
    [],
  )

  const beans = useMemo(() => {
    const r = rng(7)
    const list = []
    while (list.length < count) {
      const x = (r() - 0.5) * 15
      const y = (r() - 0.5) * 8.5
      const z = -7 + r() * 9.5
      if (Math.abs(x) < 2 && z > -2.5) continue // keep the cup clear
      list.push({
        x,
        y,
        z,
        s: 0.13 + r() * 0.13,
        rx: r() * Math.PI,
        ry: r() * Math.PI,
        sp: 0.2 + r() * 0.5,
        ph: r() * Math.PI * 2,
      })
    }
    return list
  }, [count])

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  useFrame((state, dt) => {
    const s = sm.current
    const d = Math.min(dt, 0.05)
    s.intro = damp(s.intro, stage.intro, 1.8, d)
    s.hero = damp(s.hero, stage.hero, 6, d)
    s.explode = damp(s.explode, stage.explode, 6, d)
    s.outro = damp(s.outro, stage.outro, 6, d)
    s.px = damp(s.px, stage.pointer.x, 2, d)
    s.py = damp(s.py, stage.pointer.y, 2, d)
    const t = state.clock.elapsedTime
    const spread = 1 + smoothstep(s.explode, 0.05, 0.3) * 0.55 + s.hero * 0.15
    const lift = s.hero * 1.2 + s.outro * 5

    beans.forEach((b, i) => {
      const depth = (b.z + 8) / 10 // nearer beans parallax more
      dummy.position.set(
        b.x * spread + s.px * depth * 0.6,
        b.y * spread + Math.sin(t * b.sp + b.ph) * 0.25 + s.py * depth * 0.4 + lift * (0.5 + depth),
        b.z,
      )
      dummy.rotation.set(b.rx + t * b.sp * 0.6, b.ry + t * b.sp * 0.4, b.ph)
      dummy.scale.setScalar(b.s * s.intro * (1 - s.outro * 0.5))
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={mesh} args={[geometry, material, beans.length]} frustumCulled={false} />
}
