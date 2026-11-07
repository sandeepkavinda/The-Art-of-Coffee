import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { stage } from '../motion/stage'
import {
  CUP,
  radiusAt,
  liquidGeometry,
  lidGeometry,
  creamGeometries,
  drizzleGeometry,
  baseGeometry,
  drawSleeve,
} from './geometry'

const { damp, lerp, smoothstep, clamp } = THREE.MathUtils
const band = (a, b, x) => smoothstep(x, a, b)

/*
 * Exploded-view choreography, as offsets from the assembled cup.
 * dy   = how far each component travels vertically when fully exploded
 * spin = extra turn while exploded (alternating direction reads as "mechanical")
 * cy   = assembled centre height (anchor for the label)
 */
const RIG = [
  { key: 'lid', dy: 3.0, spin: 0.55, cy: 1.66, lx: 1.4 },
  { key: 'cream', dy: 2.3, spin: -0.7, cy: 1.25, lx: 1.3 },
  { key: 'foam', dy: 1.95, spin: 0.45, cy: 0.65, lx: 1.3 },
  { key: 'espresso', dy: 1.65, spin: -0.4, cy: 0.1, lx: 1.3 },
  { key: 'ice', dy: 1.05, spin: 0.6, cy: 0.0, lx: 2.15 },
  { key: 'milk', dy: 0.9, spin: 0.3, cy: -0.83, lx: 1.3 },
  { key: 'body', dy: -2.0, spin: -0.22, cy: 0.0, lx: 1.4 },
  { key: 'base', dy: -2.45, spin: 0.5, cy: -1.55, lx: 1.2 },
]
const SPREAD_CENTER = 0.42 // centre of the exploded stack, so we can re-centre it

const ICE = Array.from({ length: 6 }, (_, i) => {
  const a = (i / 6) * Math.PI * 2 + 0.3
  return {
    a,
    r0: 0.34 + (i % 2) * 0.12,
    y0: -0.5 + (i * 0.19) % 0.95,
    r1: 1.5 + (i % 2) * 0.25,
    y1: ((i % 3) - 1) * 0.16,
    rot: [i * 0.7, i * 1.3, i * 0.4],
    s: 0.36 + (i % 3) * 0.05,
  }
})

const _v = new THREE.Vector3()

export function CupModel({ labels }) {
  const root = useRef()
  const outer = useRef([])
  const spin = useRef([])
  const ice = useRef([])
  const sm = useRef({ intro: 0, hero: 0, explode: 0, outro: 0, px: 0, py: 0, act: new Array(8).fill(0) })
  const { size, camera } = useThree()

  /* ── Geometry & materials (built once, disposed on unmount) ── */
  const assets = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 320
    drawSleeve(canvas)
    const sleeveTex = new THREE.CanvasTexture(canvas)
    sleeveTex.colorSpace = THREE.SRGBColorSpace
    sleeveTex.anisotropy = 8

    const geo = {
      lid: lidGeometry(),
      lidRim: new THREE.TorusGeometry(1.115, 0.035, 12, 96).rotateX(Math.PI / 2),
      cream: creamGeometries(),
      drizzle: drizzleGeometry(),
      foam: liquidGeometry(0.45, 0.85, '#d8b48c', '#f3e6d4', { bumpTop: 0.025 }),
      espresso: liquidGeometry(-0.25, 0.45, '#7a4423', '#24120a'),
      milk: liquidGeometry(-1.42, -0.25, '#f5ede1', '#b98c62'),
      body: new THREE.CylinderGeometry(CUP.rTop, CUP.rBottom, CUP.height, 96, 1, true),
      rim: new THREE.TorusGeometry(CUP.rTop, 0.028, 12, 96).rotateX(Math.PI / 2),
      sleeve: new THREE.CylinderGeometry(radiusAt(0.35) + 0.014, radiusAt(-0.55) + 0.014, 0.9, 96, 1, true),
      base: baseGeometry(),
    }

    const glass = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      roughness: 0.05,
      metalness: 0,
      transparent: true,
      opacity: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      side: THREE.DoubleSide,
      depthWrite: false,
      envMapIntensity: 2.2,
    })
    const mat = {
      glass,
      lid: glass.clone(),
      plastic: new THREE.MeshPhysicalMaterial({ color: '#f4ede4', roughness: 0.25, clearcoat: 0.6, transparent: true, opacity: 0.85 }),
      cream: new THREE.MeshPhysicalMaterial({ color: '#fbf3e8', roughness: 0.62, sheen: 1, sheenColor: '#fff6ea', sheenRoughness: 0.6 }),
      drizzle: new THREE.MeshPhysicalMaterial({ color: '#a85b23', roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 }),
      foam: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92 }),
      espresso: new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.18, clearcoat: 0.9, clearcoatRoughness: 0.1 }),
      milk: new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.42, clearcoat: 0.35, sheen: 0.4, sheenColor: '#ffffff' }),
      ice: new THREE.MeshPhysicalMaterial({
        color: '#f4faff',
        emissive: '#56606a',
        emissiveIntensity: 0.35,
        roughness: 0.04,
        transparent: true,
        opacity: 0.62,
        clearcoat: 1,
        ior: 1.31,
        envMapIntensity: 2.5,
        depthWrite: false,
      }),
      sleeve: new THREE.MeshStandardMaterial({ map: sleeveTex, roughness: 0.88 }),
      base: new THREE.MeshPhysicalMaterial({
        color: '#c98a4e',
        roughness: 0.1,
        clearcoat: 1,
        transparent: true,
        opacity: 0.88,
        envMapIntensity: 1.8,
      }),
    }
    mat.lid.opacity = 0.28
    return { geo, mat, sleeveTex, canvas }
  }, [])

  useEffect(() => {
    // Redraw the sleeve once Bodoni has loaded so the wordmark uses the brand face.
    document.fonts?.ready.then(() => {
      drawSleeve(assets.canvas)
      assets.sleeveTex.needsUpdate = true
    })
    return () => {
      Object.values(assets.geo).flat().forEach((g) => g.dispose())
      Object.values(assets.mat).forEach((m) => m.dispose())
      assets.sleeveTex.dispose()
    }
  }, [assets])

  /* ── Per-frame choreography ── */
  useFrame((state, dt) => {
    const s = sm.current
    const d = Math.min(dt, 0.05)
    s.intro = damp(s.intro, stage.intro, 2.6, d)
    s.hero = damp(s.hero, stage.hero, 6, d)
    s.explode = damp(s.explode, stage.explode, 6, d)
    s.outro = damp(s.outro, stage.outro, 6, d)
    s.px = damp(s.px, stage.pointer.x, 3, d)
    s.py = damp(s.py, stage.pointer.y, 3, d)

    const t = state.clock.elapsedTime
    const e = s.explode
    const approach = band(0.0, 0.14, e)
    const sep = band(0.1, 0.3, e) * (1 - band(0.82, 0.96, e))
    const settle = band(0.82, 0.96, e) // reassembled, framing for hand-off
    const desk = size.width >= 900
    const intro = s.intro

    /* Root transform: hero → anatomy → hand-off */
    const g = root.current
    const heroX = 0
    const heroY = desk ? -0.12 : -0.45
    const heroS = desk ? 1 : 0.64
    const exX = desk ? 2.35 : 0
    const exY = (desk ? 0 : 1.55) - SPREAD_CENTER * sep * (desk ? 1 : 0.6)
    const exS = desk ? 1 : 0.6

    let x = lerp(heroX, exX, approach)
    let y = lerp(heroY + s.hero * 0.25, exY, approach)
    let sc = lerp(heroS * (1 + s.hero * 0.06), exS, approach)
    // when reassembled at the end, glide back to centre-stage for the hand-off
    x = lerp(x, 0, settle)
    y = lerp(y, desk ? 0.35 : 0.6, settle)
    sc = lerp(sc, desk ? 1.05 : 0.8, settle)

    // Intro: rise from below, spin in
    y += (1 - intro) * -5.5
    sc *= 0.55 + intro * 0.45
    // Outro: lift away as the Journey arrives
    y += s.outro * 6.5
    sc *= 1 - s.outro * 0.35

    g.position.set(x, y + Math.sin(t * 0.9) * 0.05 * (1 - sep), 0)
    g.scale.setScalar(sc)
    g.rotation.x = lerp(0.1, 0.26, sep) - s.py * 0.06 + (1 - intro) * 0.6
    g.rotation.z = s.px * -0.04 + (1 - intro) * -0.3 + s.outro * 0.25
    g.rotation.y = s.px * 0.18

    /* Camera dolly: pull back to fit the exploded stack */
    const camZ = lerp(9.5, desk ? 18 : 19.5, sep) + s.hero * -0.4
    camera.position.z = damp(camera.position.z, camZ, 5, d)
    camera.position.y = lerp(0.35, 1.1, sep)
    camera.lookAt(0, lerp(0, 0.2, sep), 0)

    /* Layers */
    const idle = t * 0.22 + s.hero * Math.PI * 0.9 + (1 - intro) * -2
    const active = stage.active
    RIG.forEach((r, i) => {
      const o = outer.current[i]
      const sp = spin.current[i]
      if (!o || !sp) return
      s.act[i] = damp(s.act[i], active === i && sep > 0.5 ? 1 : 0, 6, d)
      const a = s.act[i]
      const float = Math.sin(t * 1.1 + i * 0.9) * 0.06 * sep
      o.position.y = r.dy * sep + float
      o.position.z = a * 0.6
      o.position.x = -a * 0.1
      o.scale.setScalar(1 + a * 0.1)
      sp.rotation.y = idle + r.spin * sep * Math.PI
      sp.rotation.x = Math.sin(t * 0.7 + i) * 0.04 * sep

      const label = labels?.current[i]
      if (label) {
        _v.set(r.lx, r.cy, 0)
        o.updateWorldMatrix(true, false)
        o.localToWorld(_v).project(camera)
        const lx = (_v.x * 0.5 + 0.5) * size.width
        const ly = (-_v.y * 0.5 + 0.5) * size.height
        label.style.transform = `translate3d(${lx.toFixed(1)}px, ${ly.toFixed(1)}px, 0) translateY(-50%)`
        const vis = clamp((sep - 0.55) / 0.35, 0, 1)
        label.style.opacity = String(vis * (active < 0 ? 0.7 : active === i ? 1 : 0.35))
        label.dataset.active = active === i ? 'true' : 'false'
      }
    })

    /* Ice cubes fan out radially */
    ICE.forEach((c, i) => {
      const m = ice.current[i]
      if (!m) return
      const r = lerp(c.r0, c.r1, sep)
      m.position.set(Math.cos(c.a) * r, lerp(c.y0, c.y1, sep), Math.sin(c.a) * r)
      m.rotation.set(c.rot[0] + t * 0.3 * sep, c.rot[1] + t * 0.2 * sep, c.rot[2])
    })
  })

  const { geo, mat } = assets

  const refs = { outer, spin }
  const Layer = CupLayer

  return (
    <group ref={root}>
      {/* 1 · Lid */}
      <Layer i={0} refs={refs}>
        <group position={[0, CUP.top, 0]}>
          <mesh geometry={geo.lid} material={mat.lid} renderOrder={5} />
          <mesh geometry={geo.lidRim} material={mat.plastic} />
        </group>
      </Layer>

      {/* 2 · Whipped cream + caramel drizzle */}
      <Layer i={1} refs={refs}>
        <group position={[0, 0.85, 0]}>
          {geo.cream.map((g2, k) => (
            <mesh key={k} geometry={g2} material={mat.cream} />
          ))}
          <mesh geometry={geo.drizzle} material={mat.drizzle} />
        </group>
      </Layer>

      {/* 3 · Foam */}
      <Layer i={2} refs={refs}>
        <mesh geometry={geo.foam} material={mat.foam} />
      </Layer>

      {/* 4 · Espresso */}
      <Layer i={3} refs={refs}>
        <mesh geometry={geo.espresso} material={mat.espresso} />
      </Layer>

      {/* 5 · Ice */}
      <Layer i={4} refs={refs}>
        {ICE.map((c, k) => (
          <RoundedBox
            key={k}
            ref={(el) => (ice.current[k] = el)}
            args={[c.s, c.s, c.s]}
            radius={0.06}
            smoothness={3}
            material={mat.ice}
            renderOrder={4}
          />
        ))}
      </Layer>

      {/* 6 · Milk */}
      <Layer i={5} refs={refs}>
        <mesh geometry={geo.milk} material={mat.milk} />
      </Layer>

      {/* 7 · Cup body: glass, rim and kraft sleeve */}
      <Layer i={6} refs={refs}>
        <mesh geometry={geo.body} material={mat.glass} renderOrder={6} />
        <mesh geometry={geo.rim} material={mat.plastic} position={[0, CUP.top, 0]} />
        <mesh geometry={geo.sleeve} material={mat.sleeve} position={[0, -0.1, 0]} />
      </Layer>

      {/* 8 · Base */}
      <Layer i={7} refs={refs}>
        <mesh geometry={geo.base} material={mat.base} position={[0, -1.55, 0]} />
      </Layer>
    </group>
  )
}

function CupLayer({ i, refs, children }) {
  return (
    <group ref={(el) => (refs.outer.current[i] = el)}>
      <group ref={(el) => (refs.spin.current[i] = el)}>{children}</group>
    </group>
  )
}
