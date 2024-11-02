import { Scene } from 'three/build/three.module.js'

export class $Scene {
  constructor() {
    this.Scene = new Scene()
  }
  init() {
    this.Scene.position.set(0, 0, 0)
  }
  getScene() {
    return this.Scene
  }
  destroyed() {
    const { Scene } = this
    Scene.traverse((e) => {
      if (e.BufferGeometry) e.BufferGeometry.dispose()
      if (e.material) {
        if (Array.isArray(e.material)) {
          e.material.forEach((m) => {
            m.dispose()
          })
        } else {
          e.material.dispose()
        }
      }
      if (e.isMesh) {
        e.remove()
      }
    })
    Scene.remove()
  }
}
