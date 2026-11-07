// Shared, mutable state that bridges DOM ScrollTriggers and the WebGL stage.
// ScrollTriggers write raw progress; the render loop reads and damps it.
// Kept outside React so scrolling never causes re-renders.

const visibleListeners = new Set()

export const stage = {
  intro: 0, // 0 → 1 once the loader lifts
  hero: 0, // hero scroll progress
  explode: 0, // exploded-view pinned progress
  outro: 0, // hand-off into the Journey
  active: -1, // focused layer index in the exploded view
  pointer: { x: 0, y: 0 },
  visible: true,
  setVisible(v) {
    if (v === this.visible) return
    this.visible = v
    visibleListeners.forEach((fn) => fn(v))
  },
  onVisible(fn) {
    visibleListeners.add(fn)
    return () => visibleListeners.delete(fn)
  },
}

// Tiny app-wide "ready" signal (loader → hero intro).
const readyListeners = new Set()
export const app = {
  ready: false,
  setReady() {
    if (this.ready) return
    this.ready = true
    readyListeners.forEach((fn) => fn())
  },
  onReady(fn) {
    if (this.ready) {
      fn()
      return () => {}
    }
    readyListeners.add(fn)
    return () => readyListeners.delete(fn)
  },
}
