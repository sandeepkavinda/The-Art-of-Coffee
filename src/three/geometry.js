// Procedural geometry for the iced-coffee cup. Every component is real,
// separate 3D geometry so the exploded view genuinely pulls the cup apart.
import * as THREE from 'three'

export const CUP = {
  height: 3,
  bottom: -1.5,
  top: 1.5,
  rBottom: 0.8,
  rTop: 1.05,
}

/** Outer radius of the tapered cup at height y. */
export const radiusAt = (y) => CUP.rBottom + ((y - CUP.bottom) / CUP.height) * (CUP.rTop - CUP.rBottom)

/** A liquid slab that exactly fills the cup between ya and yb, with a vertical colour gradient. */
export function liquidGeometry(ya, yb, c0, c1, { inset = 0.05, bumpTop = 0 } = {}) {
  const h = yb - ya
  const geo = new THREE.CylinderGeometry(radiusAt(yb) - inset, radiusAt(ya) - inset, h, 72, 6)
  const pos = geo.attributes.position
  const colors = []
  const a = new THREE.Color(c0)
  const b = new THREE.Color(c1)
  const tmp = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i)
    const t = (y + h / 2) / h
    // Organic surface on the top cap (foam etc.)
    if (bumpTop && Math.abs(y - h / 2) < 1e-4) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const n = Math.sin(x * 9.1) * Math.cos(z * 7.3) + Math.sin((x + z) * 13.7) * 0.5
      pos.setY(i, y + n * bumpTop)
    }
    tmp.copy(a).lerp(b, THREE.MathUtils.smoothstep(t, 0, 1))
    colors.push(tmp.r, tmp.g, tmp.b)
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geo.computeVertexNormals()
  geo.translate(0, (ya + yb) / 2, 0)
  return geo
}

/** Clear dome lid (lathe profile). Local origin = rim height. */
export function lidGeometry() {
  const pts = [
    [0.0, 0.44],
    [0.18, 0.44],
    [0.26, 0.43],
    [0.3, 0.38],
    [0.55, 0.3],
    [0.82, 0.17],
    [1.0, 0.07],
    [1.1, 0.03],
    [1.13, 0.0],
    [1.13, -0.07],
    [1.09, -0.09],
  ].map(([r, y]) => new THREE.Vector2(r, y))
  return new THREE.LatheGeometry(pts, 96)
}

/** Soft-serve style whipped cream: stacked swirls + a tip. Local origin = base of cream. */
export function creamGeometries() {
  const rings = [
    { r: 0.66, tube: 0.24, y: 0.14 },
    { r: 0.46, tube: 0.21, y: 0.38 },
    { r: 0.27, tube: 0.17, y: 0.58 },
  ]
  const parts = rings.map(({ r, tube, y }) => {
    const g = new THREE.TorusGeometry(r, tube, 28, 96)
    g.rotateX(Math.PI / 2)
    // Gentle twist so it reads as piped cream rather than a stack of rings
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const z = p.getZ(i)
      const ang = Math.atan2(z, x)
      p.setY(i, p.getY(i) + Math.sin(ang * 3) * 0.035)
    }
    g.computeVertexNormals()
    g.translate(0, y, 0)
    return g
  })
  const tip = new THREE.SphereGeometry(0.17, 32, 24)
  tip.scale(1, 1.25, 1)
  tip.translate(0, 0.74, 0)
  parts.push(tip)
  return parts
}

/** Caramel drizzle spiralling over the cream. */
export function drizzleGeometry() {
  const pts = []
  const turns = 3.2
  for (let i = 0; i <= 120; i++) {
    const t = i / 120
    const ang = t * Math.PI * 2 * turns
    const r = 0.88 * (1 - t) + 0.12
    const y = 0.3 + t * 0.62 + Math.sin(ang * 2) * 0.02
    pts.push(new THREE.Vector3(Math.cos(ang) * r, y, Math.sin(ang) * r))
  }
  const curve = new THREE.CatmullRomCurve3(pts)
  return new THREE.TubeGeometry(curve, 260, 0.028, 10, false)
}

/** Heavy amber base (lathe). Local origin = centre. */
export function baseGeometry() {
  const pts = [
    [0.0, -0.11],
    [0.74, -0.11],
    [0.82, -0.09],
    [0.85, -0.04],
    [0.85, 0.06],
    [0.81, 0.1],
    [0.0, 0.1],
  ].map(([r, y]) => new THREE.Vector2(r, y))
  return new THREE.LatheGeometry(pts, 72)
}

/** Coffee bean: squashed ellipsoid with a crease down the flat side. */
export function beanGeometry() {
  const g = new THREE.SphereGeometry(1, 28, 20)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i)
    const y = p.getY(i)
    let z = p.getZ(i)
    // flatten the back
    if (z < 0) z *= 0.55
    // crease
    const crease = Math.exp(-(x * x) / 0.012) * 0.28 * Math.max(0, z)
    z -= crease
    x += Math.sin(y * 3) * 0.06 * Math.max(0, z)
    p.setXYZ(i, x * 0.72, y, z * 0.62)
  }
  g.computeVertexNormals()
  return g
}

/** Kraft sleeve texture with the wordmark, drawn on a canvas. */
export function drawSleeve(canvas) {
  const ctx = canvas.getContext('2d')
  const { width: w, height: h } = canvas
  ctx.fillStyle = '#b87945'
  ctx.fillRect(0, 0, w, h)
  // paper fibre noise
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '255,235,210' : '60,35,20'},${Math.random() * 0.06})`
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2)
  }
  ctx.strokeStyle = 'rgba(23,16,13,0.55)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(0, 26)
  ctx.lineTo(w, 26)
  ctx.moveTo(0, h - 26)
  ctx.lineTo(w, h - 26)
  ctx.stroke()
  ctx.fillStyle = '#17100d'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  const label = 'THE ART OF COFFEE'
  if ('letterSpacing' in ctx) ctx.letterSpacing = '6px'
  for (let k = 0; k < 2; k++) {
    ctx.font = '600 76px "Bodoni Moda", Didot, serif'
    ctx.fillText(label, (w / 2) * k + w / 4, h / 2 + 3)
  }
  ctx.font = '40px "Bodoni Moda", serif'
  ;[0, w / 2, w].forEach((x) => ctx.fillText('✦', x, h / 2))
}
